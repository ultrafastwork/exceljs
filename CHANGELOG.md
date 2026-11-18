# Changelog

All notable changes to this fork of [exceljs/exceljs](https://github.com/exceljs/exceljs) are documented here.
Upstream releases up to `4.4.0` are listed in the [README release history](./README.md#release-history).

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
