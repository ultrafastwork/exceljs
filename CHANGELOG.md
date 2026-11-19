# Changelog

All notable changes to this fork of [exceljs/exceljs](https://github.com/exceljs/exceljs) are documented here.
Upstream releases up to `4.4.0` are listed in the [README release history](./README.md#release-history).

## [Unreleased]

## [5.0.0] - 2026-11-19

Codebase, dependency and tooling modernization: native ES modules on Node.js 24+, no ES5 build.
Install with `pnpm add github:ultrafastwork/exceljs#v5.0.0`. The tag includes the built `dist/` browser bundles.

### Breaking

- **Node.js 24 or newer is required** (`engines.node: ">=24"`, was `>=8.3.0`).
- **ExcelJS is now an ES module** (`"type": "module"`). `import ExcelJS from 'exceljs'` and named imports
  (`import {Workbook} from 'exceljs'`) work. CommonJS `require('exceljs')` keeps working through Node.js 24's
  `require(esm)`, including destructuring and `.default`.
- **The ES5 build is gone**: `exceljs/dist/es5`, the root `index.js`/`excel.js` files and the core-js/regenerator
  polyfills were removed.
- **An `exports` map now limits deep imports** to `exceljs`, `exceljs/browser`, `exceljs/dist/*` and
  `exceljs/package.json`. Internal paths such as `exceljs/lib/...` can no longer be imported.
- **Browser bundles target modern browsers** (Chrome/Edge 111+, Firefox 115+, Safari 16.4+) and ship without
  polyfills. `exceljs.bare(.min).js` are now aliases of `exceljs(.min).js`.

### Added

- `dist/exceljs.browser.mjs`: an ES module browser build, selected automatically by bundlers via the `browser`
  export condition (`exceljs/browser` also points to it).
- A typed default export in `index.d.ts`, so `import ExcelJS from 'exceljs'` type-checks under ESM.

### Changed

- Runtime dependencies: `archiver` 5 → 8, `unzipper` 0.10 → 0.12, `readable-stream` 3 → 4, `saxes` 5 → 6,
  `fast-csv` 4 → 5, `jszip` 3.10.1 → 3.10.2 (CSP patch regenerated), `dayjs` 1.11.23, `tmp` 0.2.7.
- On Node.js the library uses native `node:` streams, events and crypto. `readable-stream` is no longer a runtime
  dependency, only a browser-bundle polyfill. Benchmarks (stream/in-memory read and write, CSV) show no
  regression, and writes are slightly faster.
- Platform-neutral web APIs replace Node-only code paths: `TextDecoder`/`TextEncoder` (instead of
  `StringDecoder` and `process.browser` branches) and `DecompressionStream('deflate-raw')` in the browser `Blob`
  reader (instead of a zlib polyfill). In browsers, worksheet-protection hashing uses `@noble/hashes` (selected
  through the `#crypto` subpath import), verified to produce the same hashes as `node:crypto`.
- Sheet-protection hashing no longer concatenates a new buffer on every spin iteration.
- Prototype-based `CommentXform`, `CommentsXform` and `StreamBuf` are now ES classes, and the internal
  `utils.inherits` helper was removed. Unused internal modules (`line-buffer`, `auto-drain`, `stream-base64`,
  `string-builder`, `stuttered-pipe`, `typed-stack`) and helpers (`promiseImmediate`, the broken
  `toIsoDateString`) were removed.
- The `uuid` dependency was removed. UUIDs now come from `crypto.randomUUID()`, falling back to
  `crypto.getRandomValues()` in insecure browser contexts (`lib/utils/uuid.js`).
- `StreamBuf` exposes `readable`/`writable` flags so archiver 8 accepts it as a stream.
- The web `WritableStream` adapter no longer masks the original write error with a lock-release error
  (readable-stream 4 enables `autoDestroy`).

### Tooling

- Grunt, Babel, Browserify, Terser and `grunt-contrib-jasmine` were replaced by an esbuild build script
  (`scripts/build.js`) and a Mocha + Puppeteer browser test (`spec/browser/run.js`) that tests both the script
  and module bundles in headless Chrome.
- The `test:es5` scripts are gone. `pnpm test` runs build, unit, integration, end-to-end, browser, TypeScript and
  dist suites. All scripts are now cross-platform (no POSIX `export`/`rm`).
- Mocha 12, Chai 6, TypeScript 7 (type-check with `tsc`, specs run with `tsx`), Express 5, lint-staged 17.
- Prettier 3 (`.prettierrc.json`) is now the only formatter, and the codebase was reformatted with it once
  (the commit is listed in `.git-blame-ignore-revs`). New scripts: `pnpm format` / `pnpm format:check`.
- ESLint 10 flat config (`eslint.config.js`, `@eslint/js` + `eslint-plugin-n`) checks correctness only, with no
  formatting rules. Replaces airbnb-base, `eslint-config-prettier`, `eslint-plugin-node`, `eslint-plugin-import`
  and `prettier-eslint`. Stale `eslint-disable` directives were removed.
- `got` and `ts-node` were removed.
- The pre-commit hook chunks lint-staged file lists so large commits fit the Windows command-line limit.
- CI tests Node 24 and 26 with pnpm.
- `pnpm-lock.yaml` is now tracked in git.
- Release tags include the built `dist/`: `scripts/release-tag.js` builds the bundles and tags a detached commit
  that adds them on top of the version bump, so git-tag installs get the browser bundles while `master` stays
  free of build output. The tag commit also drops the dev-only `prepare` (husky) script: pnpm refuses git-hosted
  packages with a `prepare` script unless the consumer allowlists them.

## [4.5.0] - 2026-11-19

First fork release. Based on upstream `4.4.0` and adds all 135 open upstream pull requests,
each reviewed, ported where applicable, and covered by tests. See [ai-docs/prs/README.md](./ai-docs/prs/README.md)
for the full per-PR catalog.

### Behavior changes to review before upgrading

No public API has been removed, but these fixes change output or start rejecting input that was accepted before:

- **Image anchoring** uses Excel's default scaling (column width 8.43 = 640000 EMU, row height 15 = 180000 EMU), so
  images on sheets with custom column widths or row heights may land in slightly different (correct) positions (#2924).
- **Table validation**: `addTable` now throws on invalid table names (#2767) and on an empty `rows` array (#2680).
- **CSV reading** keeps numbers that would lose precision (e.g. long IDs) as strings (#1743), and keeps
  whitespace-only strings instead of converting them (#2752).
- **Data validations** covering very large ranges are clamped to the last row that contains data (#2977).
- **`XLSX#load`** logs a `console.warn` when an archive contains no worksheets (#2779).

### Added

- `Cell#addStyle(style)` merges a partial style without mutating shared style objects (#2867).
- `stylesCacheMode` option (`WEAK_MAP`, `JSON_MAP`, `FAST_MAP`, `NO_CACHE`) on `XLSX` and `WorkbookWriter` for faster
  style serialization (#2867).
- `Workbook#getFirstWorksheet()` (#2991).
- `Worksheet#addShape()` for basic shapes and text boxes (#2077, #2601).
- `Worksheet#removeImage()` (#2903), `editAs: 'twoCell'` (#2983), image `title`/`descr`/`decorative` (#1789),
  `rotation`/`extent`/`offset` (#2049), and header/footer images (#2563).
- Pivot tables: `'count'` metric (#2885), multiple value fields (#2578), multiple pivot tables on the same source
  (#2995), and the `applyWidthHeightFormats` option (#2997).
- `Worksheet#duplicateRows()` (#2116), `Worksheet#fillCells()` (#1061), and `Worksheet#makeColumns()` for nested column
  definitions (#1889).
- `Cell#removeNote()` (#1746), automatic comment box sizing (#1933), and notes inside tables (#2079).
- `quotePrefix` style property (#2809), `inlineStr` cells (#1576), and `worksheet.properties.outlineProperties` (#2102).
- Conditional formatting: `stopIfTrue` and optional `priority` (#2736), expressions without formulae (#2883), and
  `x14:cfRule` expressions (#1767).
- Tables: `headerRow: false`, `removeTable(name, withData)`, `tableRef` over existing data (#1345), excluded AutoFilter
  columns (#1383), and `addRow()` on loaded tables (#2998).
- Streaming: Web `ReadableStream`/`WritableStream` support in XLSX and CSV `read()`/`write()` (#2849), a browser
  `Blob` streaming reader exposed as `ExcelJS.stream.xlsx.WorkbookReader` (#1457), merged-cell events in the streaming
  reader (#3002), and `addTable()`/`addImage()` on the streaming `WorksheetWriter` (#1885, #2201, #2633).
- CSV `headers` read option (#2080).
- TypeScript: new declarations for all of the above, plus `DataValidationType`, `ImageEditAs`, `Address`, `Row.values`,
  `Row.dimensions`, `CellFormulaValue.date1904`, and `WorksheetReader` fixes.

### Fixed

- Streaming reader: silent early termination on Node.js 22 (#3031), multibyte UTF-8 characters split across chunks
  (#1665, #2081, #2894), missing worksheets, rels and styles caused by entry ordering (#1570, #2671, #2791, #2852,
  #2874), temp file cleanup on early exit (#2148), and hidden row/column properties (#2800).
- Browser bundles no longer contain `new Function`, so they work under a strict Content Security Policy without
  `'unsafe-eval'` (#2278, #2672).
- Corrupted files caused by: modified tables (#2089), conditional formatting combined with hyperlinks (#2803),
  `pageSetUpPr` placement (#2807), `[object Object]` number formats (#2698), and streaming `sheetProtection`/`autoFilter`
  ordering (#2685).
- `spliceRows()`/`spliceColumns()` with merged cells, tables and media (#1600, #2090, #2625), out-of-order `<col>`
  elements (#1563), and much faster merge checks on sheets with many merged cells (#2691, #2920).
- Compatibility with HAN CELL (#3020), non-Office generated (#2846) and Strict OpenXML (#2702) files; a default theme is
  added when saving workbooks loaded without one (#2009).
- Style objects are cloned on assignment so edits no longer affect other cells (#1378, #1573, #2781).
- Rich text, shared-string hyperlinks, hyperlink `#` fragments, table loading (`totalsRowResult`,
  `calculatedColumnFormula`), AutoFilter `dynamicFilter` nodes, data bar defaults, page breaks, multiple print areas,
  and `dateToExcel()` with non-numeric input. See the PR catalog for the full list.

### Security & build

- Updated dependencies to remove reported critical vulnerabilities (#2999).
- jszip is patched at install time (`patches/jszip@3.10.1.patch`, registered in `pnpm-workspace.yaml`) to remove the
  `new Function` fallback from the browser bundles.
- The published `files` list now includes `index.js` (previously listed as the non-existent `index.ts`).
