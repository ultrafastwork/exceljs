// Builds the browser bundles in dist/ with esbuild.
//
// The library source uses `node:*` built-ins. For browsers they are mapped to
// userland equivalents (readable-stream, events, buffer); `node:fs` becomes an
// empty module because file-system methods are not available in browsers.

import fs from 'node:fs/promises';
import path from 'node:path';
import * as esbuild from 'esbuild';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const {version} = JSON.parse(await fs.readFile(path.join(root, 'package.json'), 'utf8'));

const emptyNodeFs = {
  name: 'empty-node-fs',
  setup(build) {
    build.onResolve({filter: /^(node:)?fs(\/promises)?$/}, () => ({
      path: 'fs',
      namespace: 'empty',
    }));
    build.onLoad({filter: /.*/, namespace: 'empty'}, () => ({contents: 'export default {};'}));
  },
};

const common = {
  absWorkingDir: root,
  entryPoints: ['lib/exceljs.browser.js'],
  bundle: true,
  platform: 'browser',
  // browsers with native DecompressionStream('deflate-raw') support
  target: ['chrome111', 'edge111', 'firefox115', 'safari16.4'],
  sourcemap: 'linked',
  legalComments: 'eof',
  banner: {js: `/*! ExcelJS ${version} | MIT License */`},
  // dependencies import built-ins both with and without the `node:` prefix
  alias: Object.fromEntries(
    Object.entries({
      stream: 'readable-stream',
      events: 'events',
      buffer: 'buffer',
      util: './scripts/browser-util.js',
    }).flatMap(([name, target]) => [
      [name, target],
      [`node:${name}`, target],
    ]),
  ),
  inject: [path.join(root, 'scripts/browser-globals.js')],
  define: {global: 'globalThis'},
  plugins: [emptyNodeFs],
  logLevel: 'warning',
};

await fs.rm(dist, {recursive: true, force: true});

await Promise.all([
  // classic <script> builds exposing a global `ExcelJS`
  esbuild.build({
    ...common,
    format: 'iife',
    globalName: 'ExcelJS',
    outfile: 'dist/exceljs.js',
  }),
  esbuild.build({
    ...common,
    format: 'iife',
    globalName: 'ExcelJS',
    minify: true,
    outfile: 'dist/exceljs.min.js',
  }),
  // ES module build for bundlers and <script type="module">
  esbuild.build({
    ...common,
    format: 'esm',
    minify: true,
    outfile: 'dist/exceljs.browser.mjs',
  }),
]);

// The "bare" bundles used to be the builds without polyfills. No build ships
// polyfills any more, so they are kept as aliases for existing <script> tags.
for (const suffix of ['js', 'min.js']) {
  const map = `exceljs.${suffix}.map`;
  const code = await fs.readFile(path.join(dist, `exceljs.${suffix}`), 'utf8');
  await fs.writeFile(
    path.join(dist, `exceljs.bare.${suffix}`),
    code.replace(`sourceMappingURL=${map}`, `sourceMappingURL=exceljs.bare.${suffix}.map`),
  );
  await fs.copyFile(path.join(dist, map), path.join(dist, `exceljs.bare.${suffix}.map`));
}

await fs.copyFile(path.join(root, 'LICENSE'), path.join(dist, 'LICENSE'));
