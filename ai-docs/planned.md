# ExcelJS Fork — Planned Roadmap & Release Checklist

## Current Status
- All **135** upstream pull requests cataloged in [ai-docs/prs/README.md](./prs/README.md) have been audited/implemented and marked `DONE`.
- Lint, build, unit, integration, end-to-end, distribution/CSP, browser Jasmine, and TypeScript test suites are passing.

## Release Readiness Checklist
- [ ] Decide target fork version bump (currently `4.4.0` in `package.json`).
- [ ] Update `CHANGELOG.md` / release notes summarizing the ported upstream PRs and fork enhancements (`stylesCacheMode`, `Cell#addStyle`, `WorkbookReaderBlob`, shapes/text boxes, pivot table enhancements, web-native streams, Node 22 & CSP fixes).
- [ ] Run `pnpm test:all` (including ES5 build verification `EXCEL_BUILD=es5`) before tagging/publishing if ES5 consumers remain supported.
- [ ] Run `npm pack --dry-run` (or `pnpm pack --dry-run`) to verify published files (`dist/`, `lib/`, `excel.js`, `index.js`, `index.d.ts`, `LICENSE`, `README.md`, `README_zh.md`).

## Future Maintenance & Backlog
1. **Pivot Table Refactoring & Metrics**:
   - Convert `makePivotTable` in `lib/doc/pivot-table.js` into a proper class constructor (tracked via `TK(2023-10-10)` comment in source).
   - Evaluate additional aggregation metrics beyond `'sum'` and `'count'`.
2. **Browser Test Tooling Modernization**:
   - Upgrade `jasmine` from `3.8.0` to `4.x` in `gruntfile.js` (removing the `customBootFile` workaround and updating `spec/browser/exceljs.spec.js` if needed) and opt into Puppeteer's `headless: 'new'` mode.
3. **ZIP Dependency & Node Engine Strategy**:
   - Monitor `unzipper` (`^0.10.14`) and `archiver` (`^5.3.2`) for security/maintenance updates or revisit a streaming alternative such as `yauzl-promise` (see `#2687` / `#2869`).
   - Evaluate bumping minimum supported Node.js version in `package.json` (`engines.node: ">=8.3.0"`) and deprecating legacy `dist/es5` polyfill targets in a future major release.
