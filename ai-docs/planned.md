# ExcelJS Fork — Planned Roadmap & Release Checklist

## Current Status
- All **135** upstream pull requests cataloged in [ai-docs/prs/README.md](./prs/README.md) have been audited/implemented and marked `DONE`.
- Lint, build, unit, integration, end-to-end, distribution/CSP, browser Jasmine, and TypeScript test suites are passing.

## Release Readiness Checklist (`v4.5.0`, released 2026-11-19)
- [x] Decide target fork version bump: `4.4.0` → `4.5.0`.
- [x] Add `CHANGELOG.md` with release notes for the ported upstream PRs and fork enhancements.
- [x] Run native + ES5 (`EXCEL_BUILD=es5`) unit, integration, end-to-end, dist suites, plus TypeScript and browser Jasmine.
- [x] Run `pnpm pack --dry-run` (568 files, only `files` whitelist entries).
- [x] Wire the jszip CSP patch via `patchedDependencies` in `pnpm-workspace.yaml` (now tracked in git).

## Known Environment Caveats
- `pnpm test:browser` uses Puppeteer's own Chrome download. If `Could not find Chrome` appears, run `pnpm exec puppeteer browsers install chrome`. On Node 26 the download has been seen to fail to extract (session `v1.0.0+88`); if so, run it once under Node 24.
- All `package.json` scripts are cross-platform (no POSIX `export`/`rm`). The ES5 suites were removed in session `v1.0.0+90`.
- **Distribution decision (2026-11-19):** keep git-tag installs (`github:ultrafastwork/exceljs#vX.Y.Z`), with no rename and no npm publish. `repository.url` now points to the fork. Gap: `dist/` is gitignored, so git-tag consumers get no browser bundle (`browser` field) and no `dist/es5`. The jszip CSP patch also only applies inside this workspace.

## Future Maintenance & Backlog
1. **Pivot Table Refactoring & Metrics**:
   - Convert `makePivotTable` in `lib/doc/pivot-table.js` into a proper class constructor (tracked via `TK(2023-10-10)` comment in source).
   - Evaluate additional aggregation metrics beyond `'sum'` and `'count'`.
2. **Browser Test Tooling Modernization**:
   - [x] Jasmine `3.8.0` → `4.6.1`, `customBootFile` removed, Puppeteer `19` → `24` via pnpm override (new headless mode is the default since Puppeteer 22, so no `headless` option is needed). Done in session `v1.0.0+88`.
   - [x] `grunt-contrib-jasmine` and Grunt were replaced by `spec/browser/run.js` (Mocha + Chai in headless Chrome via Puppeteer, testing the script and module bundles). The Puppeteer override was dropped. Done in session `v1.0.0+90`.
3. **ZIP Dependency & Node Engine Strategy**:
   - [x] `unzipper` → `^0.12.5`, `archiver` → `^8.0.0` (ESM-only, now `new ZipArchive(options)`). Done in session `v1.0.0+89`.
   - [x] Minimum Node.js raised to `>=24` (user decision, session `v1.0.0+89`). This needs a **major** release (`5.0.0`), see `CHANGELOG.md` `[Unreleased]`.
   - Revisit a streaming ZIP alternative such as `yauzl-promise` (see `#2687` / `#2869`) if unzipper stalls again.
   - [x] `dist/es5`, Babel and the core-js/regenerator polyfills were removed. The codebase is native ESM, and browser bundles are built by esbuild (`scripts/build.js`) for Chrome/Edge 111+, Firefox 115+ and Safari 16.4+. Done in session `v1.0.0+90`.
4. **ESM Modernization** (user request, session `v1.0.0+90`):
   - [x] `"type": "module"` + `exports`/`imports` maps; CommonJS consumers keep working through `require(esm)`.
   - [x] `node:` built-ins in lib, mapped to polyfills only in the browser build. Web APIs (`TextDecoder`, `DecompressionStream`) replace Node-only paths, and `#crypto` splits hashing by platform.
   - `dist/` must ship with git-tag installs, because the `browser` export condition points to `dist/exceljs.browser.mjs` (see the handoff).
5. **Lint/Format Split** (user decision, session `v1.0.0+89`):
   - [x] Prettier owns all formatting. The whole codebase was reformatted once, and that commit is in `.git-blame-ignore-revs`. Markdown, `**/data/` fixtures and `.github/lock.yml` are excluded in `.prettierignore`.
   - [x] ESLint is kept for correctness only (undefined/unused variables, `eqeqeq`, Node API support against `engines` via `eslint-plugin-n`). `@stylistic`, `eslint-config-prettier` and the airbnb style preferences were removed, along with 75 stale `eslint-disable` directives.
   - When porting upstream PRs, run `pnpm format` on the touched files. Upstream code uses the old style (`function()`, etc.), so expect formatting-only conflicts.
