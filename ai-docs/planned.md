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
- `pnpm test:jasmine` runs on **Node.js 26** (Jasmine 4.6.1, Puppeteer overridden to `^24` in `pnpm-workspace.yaml`). However, Puppeteer's browser download silently fails to extract the Chrome zip on Node 26. If `Could not find Chrome` appears, delete any partial `~/.cache/puppeteer/{chrome,chrome-headless-shell}/win64-<ver>` folders and run the installer once on Node 24: `fnm exec --using=v24.22.2 node <path-to>/node_modules/puppeteer/install.mjs` (path: `node_modules/.pnpm/puppeteer@24*/node_modules/puppeteer`).
- `package.json` scripts use POSIX `export EXCEL_BUILD=es5`; on Windows set `$env:EXCEL_BUILD = "es5"` and run the individual `test:*` scripts.
- **Distribution decision (2026-11-19):** keep git-tag installs (`github:ultrafastwork/exceljs#vX.Y.Z`), with no rename and no npm publish. `repository.url` now points to the fork. Gap: `dist/` is gitignored, so git-tag consumers get no browser bundle (`browser` field) and no `dist/es5`. The jszip CSP patch also only applies inside this workspace.

## Future Maintenance & Backlog
1. **Pivot Table Refactoring & Metrics**:
   - Convert `makePivotTable` in `lib/doc/pivot-table.js` into a proper class constructor (tracked via `TK(2023-10-10)` comment in source).
   - Evaluate additional aggregation metrics beyond `'sum'` and `'count'`.
2. **Browser Test Tooling Modernization**:
   - [x] Jasmine `3.8.0` → `4.6.1`, `customBootFile` removed, Puppeteer `19` → `24` via pnpm override (new headless mode is the default since Puppeteer 22, so no `headless` option is needed). Done in session `v1.0.0+88`.
   - `grunt-contrib-jasmine@4.0.0` is the final release and is unmaintained. Consider replacing it with a direct Puppeteer/`jasmine-browser-runner` setup, and drop the override once that is done.
3. **ZIP Dependency & Node Engine Strategy**:
   - [x] `unzipper` → `^0.12.5`, `archiver` → `^8.0.0` (ESM-only, now `new ZipArchive(options)`). Done in session `v1.0.0+89`.
   - [x] Minimum Node.js raised to `>=24` (user decision, session `v1.0.0+89`). This needs a **major** release (`5.0.0`), see `CHANGELOG.md` `[Unreleased]`.
   - Revisit a streaming ZIP alternative such as `yauzl-promise` (see `#2687` / `#2869`) if unzipper stalls again.
   - Consider deprecating the legacy `dist/es5` build and the core-js/regenerator polyfills in `lib/exceljs.browser.js` now that Node 24 is the floor. Browser targets come from `.browserslistrc`.
4. **Lint/Format Split** (user decision, session `v1.0.0+89`):
   - [x] Prettier owns all formatting. The whole codebase was reformatted once, and that commit is in `.git-blame-ignore-revs`. Markdown, `**/data/` fixtures and `.github/lock.yml` are excluded in `.prettierignore`.
   - [x] ESLint is kept for correctness only (undefined/unused variables, `eqeqeq`, Node API support against `engines` via `eslint-plugin-n`). `@stylistic`, `eslint-config-prettier` and the airbnb style preferences were removed, along with 75 stale `eslint-disable` directives.
   - When porting upstream PRs, run `pnpm format` on the touched files. Upstream code uses the old style (`function()`, etc.), so expect formatting-only conflicts.
