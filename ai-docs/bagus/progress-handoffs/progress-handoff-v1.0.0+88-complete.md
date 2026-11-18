# progress-handoff (v1.0.0+88) - Completed

## Status
- **Status**: Completed
- **Current Session**: `v1.0.0+88`
- **Developer**: bagus

## Accomplishments
- **Browser tests run on Node 26 again** (commit `0efab7a`, `chore: run browser tests on Node 26`):
  - `grunt-contrib-jasmine@4.0.0` is already the final release and pins `puppeteer@^19`, whose `yargs@17.7.1` fails on Node 26. Added `overrides: grunt-contrib-jasmine>puppeteer: ^24.43.1` in `pnpm-workspace.yaml`. Puppeteer 24 supports Node 18 and up (v25 needs Node 22.12 or later). Chrome is 148.0.7778.97.
  - Jasmine `3.8.0` → `4.6.1`. Removed `customBootFile`, since the plugin natively uses Jasmine 4's `boot0.js`/`boot1.js`. The 4 specs in `spec/browser/exceljs.spec.js` needed no changes.
  - No `headless: 'new'` option was added. Puppeteer 22+ uses the new headless mode by default (`'new'` is no longer a valid value), and `grunt-contrib-jasmine` only forwards `args` from `sandboxArgs`/`noSandbox` anyway.
- Removed the redundant `patches/jszip+3.10.1.patch`. After `pnpm install && pnpm build`, `test-pr-2672.spec.js` passes (2/2).
- **Distribution decided (user):** keep git-tag installs with no rename (commit `9ba8e69`). `package.json` `repository.url` now points to `ultrafastwork/exceljs`. The README has an install note (`pnpm add github:ultrafastwork/exceljs#v4.5.0`), and `ai-docs/planned.md` caveats are updated.
- Verified on Node 26.13.0:
  - `pnpm lint`: clean
  - native + ES5: unit 1080 passing (1 pending), integration 320, end-to-end 1
  - dist: 10; `test:typescript`: 24
  - `test:jasmine`: 4 specs, 0 failures. It also passes on Node 24.22.2.

## Findings / Caveats
- **Puppeteer's browser download breaks on Node 26.** It silently stops extracting the Chrome zip after 3 files. A partial `chrome-headless-shell` folder then makes later installs fail. Fix: delete the partial `~/.cache/puppeteer/{chrome,chrome-headless-shell}/win64-148.0.7778.97` folders, then run `fnm exec --using=v24.22.2 node node_modules/.pnpm/puppeteer@24*/node_modules/puppeteer/install.mjs` once. Documented in `ai-docs/planned.md`.
- **Gap in git-tag distribution:** `dist/` is gitignored. Git-tag consumers get the Node entry (`excel.js` → `lib/`) but no `browser` bundle (`dist/exceljs.min.js`) and no `exceljs/dist/es5`. The jszip CSP patch (`patchedDependencies`) also only applies inside this workspace, not in consumers' installs.
- `pnpm-lock.yaml` is gitignored, so dependency resolution (including the Puppeteer override) isn't pinned for other clones.

## Next Steps
- Close the `dist/` gap for git-tag consumers, after asking the user which option to use: (a) a release branch or tag commit that includes the built `dist/`, (b) a `prepare` build step (heavy: it needs devDependencies at install), or (c) GitHub Release tarballs (`pnpm pack`) that consumers install by URL.
- Consider tracking `pnpm-lock.yaml` for reproducible installs (ask the user first; it is gitignored on purpose today).
- Long term: replace the unmaintained `grunt-contrib-jasmine` with direct Puppeteer or `jasmine-browser-runner`, then drop the override.
- Backlog in `ai-docs/planned.md`: pivot table class refactor and metrics, ZIP dependency strategy, Node engine floor.
