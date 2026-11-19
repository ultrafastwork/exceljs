// Runs spec/browser/*.spec.js with Mocha in headless Chrome, once against the
// classic <script> bundle (global ExcelJS) and once against the ES module bundle.
// Requires `pnpm build` first.

import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer';

const root = path.resolve(import.meta.dirname, '../..');
const types = {'.js': 'text/javascript', '.mjs': 'text/javascript', '.html': 'text/html'};

const loaders = {
  script: {tag: '<script src="/dist/exceljs.min.js"></script>', load: ''},
  module: {tag: '', load: "globalThis.ExcelJS = await import('/dist/exceljs.browser.mjs');"},
};

const page = loader => `<!doctype html>
<meta charset="utf-8">
<script src="/node_modules/mocha/mocha.js"></script>
${loaders[loader].tag}
<script type="module">
  ${loaders[loader].load}
  import {expect} from '/node_modules/chai/index.js';
  globalThis.expect = expect;
  mocha.setup({ui: 'bdd', reporter: 'spec', timeout: 30000});
  await import('/spec/browser/exceljs.spec.js');
  mocha.run(failures => { globalThis.__failures = failures; });
</script>`;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname.startsWith('/page/')) {
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(page(url.pathname.slice('/page/'.length)));
    return;
  }
  const file = path.join(root, decodeURIComponent(url.pathname));
  if (!file.startsWith(root)) {
    res.writeHead(403).end();
    return;
  }
  try {
    const body = await fs.readFile(file);
    res.writeHead(200, {'content-type': types[path.extname(file)] ?? 'application/octet-stream'});
    res.end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await puppeteer.launch();
let failed = 0;
try {
  for (const loader of Object.keys(loaders)) {
    process.stdout.write(`\n=== ${loader} bundle ===\n`);
    const tab = await browser.newPage();
    tab.on('console', async msg => {
      const args = await Promise.all(msg.args().map(arg => arg.jsonValue().catch(() => '')));
      console.log(...args); // eslint-disable-line no-console
    });
    tab.on('pageerror', err => {
      process.stdout.write(`page error: ${err.message}\n`);
      failed++;
    });
    await tab.goto(`${base}/page/${loader}`);
    const failures = await tab
      .waitForFunction(() => globalThis.__failures !== undefined, {timeout: 120_000, polling: 100})
      .then(
        () => tab.evaluate(() => globalThis.__failures),
        () => 'timeout',
      );
    if (failures === 'timeout') {
      process.stdout.write('timed out waiting for mocha\n');
      failed++;
    } else {
      failed += failures;
    }
    await tab.close();
  }
} finally {
  await browser.close();
  server.close();
}
process.exitCode = failed ? 1 : 0;
