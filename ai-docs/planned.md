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
- `pnpm test:jasmine` fails to load on **Node.js 26** (`require is not defined in ES module scope` from Puppeteer 19's `yargs`), and Puppeteer's postinstall cannot download Chromium there. Run browser tests on Node 24 (`fnm exec --using=v24.22.2 node node_modules/grunt/bin/grunt jasmine`).
- `package.json` scripts use POSIX `export EXCEL_BUILD=es5`; on Windows set `$env:EXCEL_BUILD = "es5"` and run the individual `test:*` scripts.
- `package.json` still uses the name `exceljs` and the upstream repository URL, so it cannot be published to npm as-is. Consumers install from git tags.

## Future Maintenance & Backlog
1. **Pivot Table Refactoring & Metrics**:
   - Convert `makePivotTable` in `lib/doc/pivot-table.js` into a proper class constructor (tracked via `TK(2023-10-10)` comment in source).
   - Evaluate additional aggregation metrics beyond `'sum'` and `'count'`.
2. **Browser Test Tooling Modernization**:
   - Upgrade `jasmine` from `3.8.0` to `4.x` in `gruntfile.js` (removing the `customBootFile` workaround and updating `spec/browser/exceljs.spec.js` if needed) and opt into Puppeteer's `headless: 'new'` mode.
   - Upgrade `grunt-contrib-jasmine` / Puppeteer so browser tests run on Node.js 26.
3. **ZIP Dependency & Node Engine Strategy**:
   - Monitor `unzipper` (`^0.10.14`) and `archiver` (`^5.3.2`) for security/maintenance updates or revisit a streaming alternative such as `yauzl-promise` (see `#2687` / `#2869`).
   - Evaluate bumping minimum supported Node.js version in `package.json` (`engines.node: ">=8.3.0"`) and deprecating legacy `dist/es5` polyfill targets in a future major release.
