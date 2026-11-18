# progress-handoff (v1.0.0+80) - Completed

## Status
- **Status**: Completed
- **Current Session**: `v1.0.0+80`
- **Developer**: bagus

## Recent Accomplishments
- **PR #1938 (`Fix loadin of table rows and ref from xlsx file`)**:
  - Updated [table.js](file:///d:/projects/exceljs/lib/doc/table.js) so `Table.constructor` invokes `this.load(this.worksheet)` when instantiated with `tableRef` without `ref` or `rows`, and updated `Table.prototype.load` to populate `ref`, `tl`, `headerRow`, `totalsRow`, and `rows` from the worksheet cells (alongside existing support in [worksheet.js](file:///d:/projects/exceljs/lib/doc/worksheet.js) and [table-column-xform.js](file:///d:/projects/exceljs/lib/xlsx/xform/table/table-column-xform.js)).
  - Added integration test fixture `spec/integration/data/test-pr-1938.xlsx` and spec [test-pr-1938.spec.js](file:///d:/projects/exceljs/spec/integration/pr/test-pr-1938.spec.js).
- **PR #1933 (`Add automatic size for comment box`)**:
  - Updated [vml-textbox-xform.js](file:///d:/projects/exceljs/lib/xlsx/xform/comment/vml-textbox-xform.js) to append `mso-fit-shape-to-text:t` to the `v:textbox` `style` attribute when `model.note.autoShape` is enabled.
  - Added `autoShape?: boolean` to `Comment` in [index.d.ts](file:///d:/projects/exceljs/index.d.ts) and updated [test-comments.js](file:///d:/projects/exceljs/test/test-comments.js).
  - Added unit, integration, and TypeScript tests in [vml-textbox-xform.spec.js](file:///d:/projects/exceljs/spec/unit/xlsx/xform/comment/vml-textbox-xform.spec.js), [workbook-xlsx-writer.spec.js](file:///d:/projects/exceljs/spec/integration/workbook-xlsx-writer/workbook-xlsx-writer.spec.js), and [exceljs.spec.ts](file:///d:/projects/exceljs/spec/typescript/exceljs.spec.ts).
- **PR #1929 (`Release large values early for GC to be able to do its job`)**:
  - Updated [xlsx.js](file:///d:/projects/exceljs/lib/xlsx/xlsx.js) in `read()` and `load()` to release `chunks = null`, `buffer = null`, and `zip = null` as soon as they are no longer needed so GC can reclaim memory earlier when loading large workbooks.
  - Added integration test in [workbook-xlsx-reader.spec.js](file:///d:/projects/exceljs/spec/integration/workbook-xlsx-reader.spec.js).
- Marked PRs #1938, #1933, and #1929 as `DONE` in `ai-docs/prs/`.

## Next Steps
- Research, implement, and verify **PR #1889** (`Support nested columns feature`).
- Research, implement, and verify **PR #1885** (`Add table support for streaming Mode Fixes issue #1412`).
- Research, implement, and verify **PR #1789** (`Add support image accessibilities requirements`).
- Run lint, build, unit, integration, and TypeScript test suites and update PR status documentation.
