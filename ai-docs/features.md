# ExcelJS Fork — Implemented Features

This document summarizes the capabilities available in this fork of **exceljs** (base upstream `4.4.0` plus all **135** upstream PRs audited/ported in [ai-docs/prs/README.md](./prs/README.md)).

## 1. Workbook & Worksheet Core
- **Workbook Management**: Read, manipulate, and write `.xlsx` and `.csv` files in Node.js and browsers.
- **Safe Worksheet Lookup**: `Workbook#getFirstWorksheet()` returns the first existing worksheet (`#2991`).
- **Worksheet Naming Validation**: Rejects invalid Excel characters and enforces valid worksheet names (`#2126`, `#2257`).
- **Compatibility & Resilience**:
  - HAN CELL Excel file compatibility (`#3020`).
  - Non-Office generated XLSX compatibility (`#2846`).
  - Default `theme1.xml` insertion when saving workbooks loaded without themes (`#2009`).
  - Warning log (`console.warn`) in `XLSX#load` when an archive contains no worksheets (`#2779`).
  - Early reference release for large buffers/streams to assist garbage collection (`#1929`).
- **Nested Columns**: `Worksheet#makeColumns()` with `lib/utils/column-flatter.js` for flattening nested column definitions (`#1889`).
- **Row & Column Operations**:
  - `Worksheet#duplicateRows()` for duplicating multiple rows (`#2116`).
  - `Worksheet#fillCells()` for applying fill styles across a range (`#1061`).
  - Improved `spliceRows()` and `spliceColumns()` handling for row deletion, merged cells, tables, and media (`#1600`, `#2090`, `#2625`).
  - Out-of-order `<col>` element handling when loading column properties (`#1563`).
  - Optimized merge conflict checks for worksheets with large numbers of merged cells (`#2691`, `#2920`).

## 2. Cells, Values, Comments & Rich Text
- **Style Safety & Incremental Styling**:
  - `Cell#addStyle(style)` for merging partial styles without mutating shared style objects (`#2867`).
  - Defensive style cloning on `cell.style` assignment and fill loading (`#1378`, `#1573`, `#2781`).
  - `quotePrefix` cell style property support (`#2809`).
- **Comments / Notes**:
  - `Cell#removeNote()` to delete cell comments (`#1746`).
  - Automatic comment box sizing (`autoShape`) (`#1933`) and margin/protection/positioning fixes (`#2651`).
  - Cell notes inside Excel tables (`#2079`).
- **Rich Text & Strings**:
  - `inlineStr` cell type support (`#1576`).
  - Unclosed rich text tag compatibility, empty substring omission, and shared-string hyperlink handling (`#2001`, `#2737`, `#1688`, `#2588`).
  - Strict OpenXML date parsing (`#2702`) and non-numeric guard in `dateToExcel()` (`#2956`).
  - Hyperlink hash fragment preservation (`#2002`).

## 3. Styles & Performance (`stylesCacheMode`)
- **`stylesCacheMode` / `styleCacheMode`**: Configurable style caching in `StylesXform`, `XLSX`, and `WorkbookWriter` (`WEAK_MAP`, `JSON_MAP`, `FAST_MAP`, `NO_CACHE`) backed by `lib/utils/style-fast-serialize.js` (`serializeStyle`, `deserializeStyle`) for faster XLSX serialization (`#2867`).
- **Custom Format Code Fix**: Prevents `[object Object]` format codes in `styles.xml` (`#2698`).

## 4. Tables & AutoFilters
- **Table Creation & Validation**: Enforces valid table names (`#2767`) and disallows empty `rows` arrays (`#2680`).
- **Loaded Tables**: Supports `getTable().addRow()` on loaded tables (`#2998`), loads table `rows`, `totalsRowResult`, and `calculatedColumnFormula` (`#1938`, `#1936`), fixes corrupted saves on modified tables (`#2089`), merges column styles in `Table.store` (`#1907`), and supports `None`/`null` table themes (`#2061`), `headerRow: false`, `removeTable(..., withData)`, and `tableRef` over existing data (`#1345`).
- **AutoFilters**: Supports excluding AutoFilter columns (`#1383`), handles `dynamicFilter` table nodes (`#2973`), fixes undefined column assignment (`#2978`), and fixes `filterColumn` / `headerRowCount` / `totalsRowCount` defaults (`#2185`).

## 5. Images, Shapes & Drawings
- **Shapes & Text Boxes**: Basic shape and text box support via `Worksheet#addShape()` and `lib/doc/shape.js` (`#2077`, `#2601`).
- **Images**:
  - `Worksheet#removeImage(sheetImageId)` (`#2903`).
  - `ImageEditAs` `'twoCell'` support (`#2983`) and `addImage` validation/positioning fixes (`#1448`, `#2614`, `#2876`, `#2924`).
  - Image accessibility metadata (`title`, `descr`, `decorative`) (`#1789`) and `rotation`, `extent`, `offset` media properties (`#2049`).
  - Header and footer image support (`#2563`).

## 6. Pivot Tables
- **Pivot Table Generation**: `Worksheet#addPivotTable()` with `'sum'` and `'count'` metrics (`#2551`, `#2885`).
- **Multiple Values & Multiple Tables**: Supports multiple value fields (`#2578`) and multiple pivot tables sharing the same source data (`#2995`).
- **Options & Escaping**: `applyWidthHeightFormats` option (`#2997`) and XML special character / null value handling (`#2996`).

## 7. Conditional Formatting, Data Validations & Page Setup
- **Conditional Formatting**: `stopIfTrue` and optional `priority` (`#2736`), expressions without formulae (`#2883`), `x14:cfRule` expressions (`#1767`), `dataBar` default values (`#3019`), `dxf` font preservation (`#2095`), and hyperlink compatibility (`#2803`).
- **Data Validations**: Clamps large validation ranges to the highest data row (`#2977`).
- **Page Setup & Properties**: Row and column page break parsing (`#2602`), multiple print areas serialization (`#1516`, `#1971`), `pageSetUpPr` placement in `sheetPr` (`#2807`), and `worksheet.properties.outlineProperties` (`#2102`).

## 8. Streaming I/O & Browser Support
- **Web-Native Streams**: Supports Web `ReadableStream` and `WritableStream` in XLSX and CSV `read()`/`write()` via `lib/utils/web-stream.js` (`#2849`).
- **Browser `Blob` Streaming Reader**: `WorkbookReaderBlob` (`lib/stream/xlsx/workbook-reader-blob.js`) and `BlobZipStream` (`lib/utils/blob-zip-stream.js`), sharing `AbstractWorkbookReader` with Node's `WorkbookReader`, exposed at `ExcelJS.stream.xlsx.WorkbookReader` in browser/bare bundles (`#1457`).
- **Streaming Writer**: `WorksheetWriter#addTable()` (`#1885`), `WorksheetWriter#addImage()` (`#2201`, `#2633`), and ordered `sheetProtection` / `autoFilter` serialization (`#2685`).
- **Streaming Reader**: Merged cell events (`#3002`), Node.js 22 early stream termination fix (`#3031`), temp file cleanup on early exit (`#2148`), UTF-8 multibyte SAX parsing fixes (`#1665`, `#2081`, `#2894`), `worksheet-reader` hidden property (`#2800`), missing worksheet / rels / styles ordering fixes (`#1570`, `#2671`, `#2791`, `#2852`, `#2874`), and optional constructor `options` (`#1922`).
- **CSP Compliance**: Browser bundles (`dist/exceljs.js`, `dist/exceljs.min.js`, `dist/exceljs.bare.js`, `dist/exceljs.bare.min.js`) avoid `new Function` (`unsafe-eval`) (`#2278`, `#2672`).

## 9. CSV & TypeScript
- **CSV**: Supports reading with `headers` option (`#2080`), preserves whitespace-only strings (`#2752`), and preserves large numbers that lose precision as strings (`#1743`).
- **TypeScript (`index.d.ts`)**: Comprehensive type updates covering `stylesCacheMode`, `Cell.addStyle`, `Workbook.getFirstWorksheet`, `WorkbookReader` (`Blob` input), `Worksheet.addShape`, `Worksheet.removeImage`, `ImageEditAs`, `DataValidationType`, `Worksheet.protect()`, `Media` interfaces, `Row.dimensions`, `Row.values`, `Address`, `CellFormulaValue.date1904`, `FastCsvParserOptionsArgs`, and `WorksheetReader`.
