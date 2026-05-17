# ExcelJS Open Pull Requests (Consolidated)

This file contains the full details of all **135** open pull requests from the original [exceljs/exceljs](https://github.com/exceljs/exceljs) repository. It is generated to allow rapid global searching and single-context analysis for AI agents.

---

## [DONE] [#3031] fix:  terminates early on macOS with Node.js 22, causing  to fail for…

- **GitHub URL:** [PR #3031 on GitHub](https://github.com/exceljs/exceljs/pull/3031)
- **Author:** [@tkambler](https://github.com/tkambler) (Tim Ambler)
- **Labels:** *None*
- **Created At:** 2026-03-31T17:05:24Z
- **Updated At:** 2026-03-31T17:05:24Z
- **Local Detail File:** [pr-3031.md](./pr-3031.md)

### Description

## Problem

`Excel.stream.xlsx.WorkbookReader` silently fails to parse xlsx files on macOS with Node.js 22 when worksheet ZIP entries appear before `xl/workbook.xml` in the archive. The error thrown is:

```js
TypeError: Cannot read properties of undefined (reading 'sheets') at WorkbookReader._parseWorksheet
```

This is a valid and common ZIP ordering — the spec does not mandate entry order, and files produced by openpyxl and other tools frequently have this layout.

## Root cause

`lib/utils/iterate-stream.js` calls `stream.pause()` before yielding each ZIP entry. The intent is backpressure, but it is counterproductive for the zip Transform stream.

When a worksheet entry is encountered before `workbook.xml`, `WorkbookReader` writes it to a temp file and awaits the write before continuing. During that `await`, the generator is suspended and the zip stream is paused. On macOS/ Node 22, unzipper's internal push loop does not buffer entries pushed to a paused Transform — it drops them and eventually calls `push(null)`. The stream emits `'end'` before `workbook.xml` has been yielded, `this.model` is never set, and `_parseWorksheet` crashes.

The same code works on Linux because epoll and kqueue handle backpressure on paused Transform streams differently in Node 22.

## Fix

Remove the `stream.pause()` call.

The `'data'` listener attached at the top of `iterateStream` already puts the stream into flowing mode and collects all entries into a `contents` array. There is no need to pause — allowing the zip Transform to run freely ensures all entries are buffered before `'end'` fires. The `contents` array holds lightweight ZIP entry objects (not raw file data), so buffering all of them is not a memory concern.

## Changes

- **`lib/utils/iterate-stream.js`** — remove `stream.pause()`
- **`spec/integration/issues/iterate-stream-worksheet-before-workbook.spec.js`**
— regression test: reads an xlsx fixture whose ZIP has `sheet1.xml` before
`workbook.xml`, asserts all rows are parsed
- **`test/data/simple_excel.xlsx`** — test fixture with the triggering ZIP
entry order (un-ignored in `.gitignore`)
[simple_excel.xlsx](https://github.com/user-attachments/files/26384697/simple_excel.xlsx)

---

## [DONE] [#3020] Fix #3014: Add support for HAN CELL Excel files

- **GitHub URL:** [PR #3020 on GitHub](https://github.com/exceljs/exceljs/pull/3020)
- **Author:** [@protobi-pieter](https://github.com/protobi-pieter) (Pieter Sheth-Voss)
- **Labels:** *None*
- **Created At:** 2026-01-27T05:25:25Z
- **Updated At:** 2026-01-27T05:25:25Z
- **Local Detail File:** [pr-3020.md](./pr-3020.md)

### Description

## Problem

ExcelJS crashes when reading Excel files created by HAN CELL (Korean spreadsheet software) with:
```
TypeError: Cannot read properties of undefined (reading 'company')
```

**Cause:** HAN CELL uses `x:` namespace prefix for spreadsheet XML tags (e.g., `x:worksheet`, `x:row`) instead of unprefixed tags, and code assumed certain properties would always be defined.

## Solution

**4 targeted changes to handle non-Excel spreadsheet applications:**

1. **parse-sax.js**: Strip `x:` namespace prefix (used by HAN CELL) while preserving other prefixes like `dc:`, `cp:`

2. **xlsx.js**: Add null checks before accessing `workbook`, `appProperties`, and `coreProperties` 

3. **core-xform.js & shared-strings-xform.js**: Ignore unknown XML tags instead of throwing errors

4. **Add integration test**: Verify HAN CELL files load successfully with test file

## Testing

- ✅ HAN CELL file from issue loads successfully
- ✅ All existing tests pass
- ✅ New integration test verifies worksheet name, row count, and cell values
- ✅ No regressions

Fixes #3014

---

## [#3019] Fix #3015: Add default values for data bar conditional formatting

- **GitHub URL:** [PR #3019 on GitHub](https://github.com/exceljs/exceljs/pull/3019)
- **Author:** [@protobi-pieter](https://github.com/protobi-pieter) (Pieter Sheth-Voss)
- **Labels:** *None*
- **Created At:** 2026-01-27T05:17:09Z
- **Updated At:** 2026-01-27T05:17:09Z
- **Local Detail File:** [pr-3019.md](./pr-3019.md)

### Description

## Problem

When creating data bar conditional formatting with minimal API options, ExcelJS crashes with:
```
TypeError: Cannot read properties of undefined (reading 'forEach')
```

This happens because the code expects `model.cfvo` array and `model.color` to be defined, but when using the minimal API:
```javascript
ws.addConditionalFormatting({
  ref: "A1:A10",
  rules: [{ type: "dataBar", priority: 1 }]
});
```

These properties are undefined, causing the crash.

## Solution

This PR adds sensible defaults to both `databar-xform.js` and `databar-ext-xform.js`:

**Default cfvo array:**
```javascript
[{ type: "min" }, { type: "max" }]
```

**Default color:**
```javascript
{ argb: "FF638EC6" } // Excel blue
```

These defaults match Excel's behavior when creating data bars through the UI with default settings.

## Changes

1. **lib/xlsx/xform/sheet/cf/databar-xform.js**
   - Provide default cfvo array when undefined
   - Provide default color (Excel blue) when undefined

2. **lib/xlsx/xform/sheet/cf-ext/databar-ext-xform.js**
   - Same default cfvo array logic
   - Maintains extended data bar properties

## Testing

Added comprehensive test coverage:
- Unit test verifying default rendering in `spec/unit/xlsx/xform/sheet/cf-ext/databar-ext-xform.spec.js`
- Integration test for end-to-end workflow in `spec/integration/workbook-xlsx-writer/workbook-xlsx-writer.spec.js`
- All 198 tests passing

The fix has been tested with real-world usage and the generated Excel files open correctly in Microsoft Excel with properly formatted data bars.

## Visual Verification

Created test file with data bars using minimal options - opens and displays correctly in Excel:
![image](https://github.com/user-attachments/assets/d86f284f-9f8f-4f6a-8a8b-b144d0e6b50a)

Fixes #3015

---

## [#3011] README.md: Formulas: Add note about not including '='

- **GitHub URL:** [PR #3011 on GitHub](https://github.com/exceljs/exceljs/pull/3011)
- **Author:** [@moshekaplan](https://github.com/moshekaplan) (Moshe Kaplan)
- **Labels:** *None*
- **Created At:** 2025-12-25T16:35:01Z
- **Updated At:** 2025-12-25T16:35:01Z
- **Local Detail File:** [pr-3011.md](./pr-3011.md)

### Description

## Summary

Add note about not including '=' in formulas. If an `=` is provided, Microsoft Excel will still calculate the formula, but Google Sheets will have an error when opening the document.

## Test plan

N/A

## Related to source code (for typings update)
N/A

---

## [#3003] fix typo in comment

- **GitHub URL:** [PR #3003 on GitHub](https://github.com/exceljs/exceljs/pull/3003)
- **Author:** [@divingbeetle](https://github.com/divingbeetle) (LEE,SEUNGMIN)
- **Labels:** *None*
- **Created At:** 2025-11-13T07:29:15Z
- **Updated At:** 2025-11-13T07:29:15Z
- **Local Detail File:** [pr-3003.md](./pr-3003.md)

### Description

fix typo: definde -> defined

---

## [#3002] Under stream processing, the information of the merged cells in the table cannot be obtained

- **GitHub URL:** [PR #3002 on GitHub](https://github.com/exceljs/exceljs/pull/3002)
- **Author:** [@halvee-tech](https://github.com/halvee-tech) (halvee)
- **Labels:** *None*
- **Created At:** 2025-11-10T09:51:04Z
- **Updated At:** 2025-11-10T09:59:11Z
- **Local Detail File:** [pr-3002.md](./pr-3002.md)

### Description

## Summary
Under stream processing, the information of the merged cells in the table cannot be obtained
https://github.com/exceljs/exceljs/issues/3000
## Test plan
<img width="564" height="76" alt="image" src="https://github.com/user-attachments/assets/d9c1cba9-cbfb-42a6-9075-e7dd5db4c41a" />


## Related to source code (for typings update)
https://github.com/exceljs/exceljs/pull/3002

---

## [#2999] Removed critical vulnerabilities from the package.

- **GitHub URL:** [PR #2999 on GitHub](https://github.com/exceljs/exceljs/pull/2999)
- **Author:** [@peterv959](https://github.com/peterv959) (Peter R. Vermilye)
- **Labels:** *None*
- **Created At:** 2025-11-08T11:53:57Z
- **Updated At:** 2025-11-08T11:53:57Z
- **Local Detail File:** [pr-2999.md](./pr-2999.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

There were quite a few critical vulnerabilities which make me nervous. Granted, they were in the devDependencies, but I still get nervous. This reduced the vulnerabilities from 37 to 19. All tests pass with three exceptions. These three failing tests pre-existed.

## Test plan
The output from the `npm run test:full`

[test-results.txt](https://github.com/user-attachments/files/23431624/test-results.txt)



## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->

---

## [#2998] Fix getTable().addRow() workflow for loaded tables

- **GitHub URL:** [PR #2998 on GitHub](https://github.com/exceljs/exceljs/pull/2998)
- **Author:** [@protobi-pieter](https://github.com/protobi-pieter) (Pieter Sheth-Voss)
- **Labels:** *None*
- **Created At:** 2025-11-07T16:49:29Z
- **Updated At:** 2025-11-07T16:49:29Z
- **Local Detail File:** [pr-2998.md](./pr-2998.md)

### Description

## Problem

The `getTable().addRow()` workflow fails when working with tables loaded from Excel files, throwing:

```
Cannot read properties of undefined (reading 'length')
```

This prevents a common use case: loading an Excel template with existing tables and adding rows to them programmatically.

Additionally, even when the error doesn't occur:
- Table references don't expand dynamically when rows are added
- Excel filter buttons disappear after save/load cycle
- Missing worksheet references cause inconsistent behavior

## Solution

This PR fixes the table loading and addRow workflow with comprehensive changes to `lib/doc/table.js` and `lib/doc/worksheet.js`.

### Key Changes

**lib/doc/table.js:**
- Fixed `autoFilterRef` to target header row only (e.g., `A1:C1`) instead of all filter rows
- Added `_updateTableRef()` method to dynamically update table ranges when rows change
- Modified `addRow()` to update table references and call `commit()` to re-render properly
- Modified `removeRows()` to update table references after removal
- Added `_writeRowToWorksheet()` helper for targeted row writes
- Added `autoFilterRef` getter/setter

**lib/doc/worksheet.js:**
- Map `tableRef` to `ref` for Excel format compatibility when loading
- Add empty `rows` array for loaded tables (Excel doesn't store row data in definitions)
- Auto-detect `headerRow` when columns have names
- Enable `filterButton: true` on columns when `autoFilterRef` exists

**test/test-table-addrow.js:**
- Comprehensive test suite for the `getTable().addRow()` workflow
- Tests both creating new tables and loading existing tables
- Verifies table references update correctly
- Verifies filter buttons are preserved

## Example Usage

```javascript
// Common template-based workflow - now works!
const Excel = require('exceljs');
const workbook = new Excel.Workbook();
await workbook.xlsx.readFile('template.xlsx');

const worksheet = workbook.getWorksheet('Data');
const table = worksheet.getTable('MyTable');

// Add rows to the loaded table
table.addRow(['Alice', 30, 'alice@example.com']);
table.addRow(['Bob', 25, 'bob@example.com']);

// Save with updated table
await workbook.xlsx.writeFile('output.xlsx');
// Filter buttons preserved ✅
// Table reference expanded correctly ✅
```

## Test Results

```bash
$ node test/test-table-addrow.js /tmp/test.xlsx
Initial table created with 3 rows
Table retrieved: MyTable
Initial table ref: A1
Initial table rows: 3
Initial autoFilterRef: A1:C1

Adding new row with addRow()...
After addRow:
Table ref: A1:C5          # ✅ Expanded correctly
Table rows: 4
AutoFilterRef: A1:C1      # ✅ Header row only

=== Test 2: Load and modify table ===
Workbook loaded successfully
Loaded table: LoadTestTable
Adding row to loaded table...
After addRow to loaded table:
Table ref: B2:D3          # ✅ Expanded correctly
AutoFilterRef: B2:D2      # ✅ Preserved

SUCCESS: All table addRow tests passed!
```

## Credits

Original implementation by **Ryan Martin** (@rmartin93)
- Source: https://github.com/rmartin93/exceljs-fork (commit 6b77cea)
- Discussion: https://github.com/exceljs/exceljs/discussions/2987

This PR adopts and submits Ryan's excellent work to upstream with comprehensive testing.

## Related Issues

- #2987 - Discussion about table functionality issues
- Fixes the core issue preventing template-based Excel workflows

## Checklist

- [x] Code changes implement the fix
- [x] Comprehensive test coverage added
- [x] Tests pass locally
- [x] Existing tests still pass
- [x] Original author credited

## Impact

This fix enables:
- ✅ Template-based Excel workflows (load + modify + save)
- ✅ Dynamic table population from databases
- ✅ Preserving Excel table features (filters, formatting)
- ✅ Professional data reporting pipelines

This is a critical fix for enterprise/production use cases where Excel templates are common.

---

## [#2997] feat: Add applyWidthHeightFormats option for pivot table column widths

- **GitHub URL:** [PR #2997 on GitHub](https://github.com/exceljs/exceljs/pull/2997)
- **Author:** [@protobi-pieter](https://github.com/protobi-pieter) (Pieter Sheth-Voss)
- **Labels:** *None*
- **Created At:** 2025-11-07T16:33:15Z
- **Updated At:** 2025-11-07T16:33:15Z
- **Local Detail File:** [pr-2997.md](./pr-2997.md)

### Description

## Summary

Adds optional `applyWidthHeightFormats` parameter to pivot tables, allowing users to preserve worksheet column widths instead of using Excel's default pivot table style widths.

## Problem

By default, Excel pivot table styles control column widths, overriding any custom column widths set on the worksheet. This is Excel's standard behavior (`applyWidthHeightFormats='1'`), but users often want to preserve their carefully crafted column widths.

**Current behavior:**
```javascript
worksheet.getColumn(1).width = 30;  // Set custom width
worksheet.addPivotTable({...});     // Custom width ignored! 
```

The pivot table style resets all column widths, making custom sizing impossible.

## Solution

Add optional `applyWidthHeightFormats` parameter (default: `'1'` for backwards compatibility):

```javascript
worksheet.getColumn(1).width = 30;  // Set custom width
worksheet.addPivotTable({
  sourceSheet: dataSheet,
  rows: ['Region'],
  columns: ['Quarter'],
  values: ['Amount'],
  applyWidthHeightFormats: '0'  // ✅ Preserve custom widths
});
```

## Implementation

### 1. **API Change** (`lib/doc/pivot-table.js`)

Added parameter to pivot table model with sensible default:

```javascript
applyWidthHeightFormats: model.applyWidthHeightFormats !== undefined 
  ? model.applyWidthHeightFormats 
  : '1'  // Default to standard Excel behavior
```

### 2. **XML Generation** (`lib/xlsx/xform/pivot-table/pivot-table-xform.js`)

Pass the setting to Excel via OOXML attribute:

```xml
<pivotTableDefinition 
  ... 
  applyWidthHeightFormats="0">
```

Per [OOXML spec](http://www.datypic.com/sc/ooxml/e-ssml_pivotTableDefinition.html):
- `'1'` (default) - Apply pivot table style widths/heights
- `'0'` - Preserve worksheet widths/heights

### 3. **Test Case** (`test/test-pivot-table.js`)

Added test demonstrating custom width preservation:

```javascript
worksheet.getColumn(1).width = 30;
worksheet.getColumn(2).width = 15;

worksheet.addPivotTable({
  ...
  applyWidthHeightFormats: '0'
});
```

## Use Cases

**1. Custom Dashboard Layouts**
```javascript
// Wide label column, narrow data columns
worksheet.getColumn(1).width = 40;
worksheet.getColumn(2).width = 12;
worksheet.addPivotTable({..., applyWidthHeightFormats: '0'});
```

**2. Print-Optimized Reports**
```javascript
// Precise column widths for PDF export
worksheet.columns = [
  { width: 25 },
  { width: 15 },
  { width: 15 },
];
worksheet.addPivotTable({..., applyWidthHeightFormats: '0'});
```

**3. Responsive Layouts**
```javascript
// Adapt to different screen sizes
const isWideScreen = true;
worksheet.getColumn(1).width = isWideScreen ? 50 : 30;
worksheet.addPivotTable({..., applyWidthHeightFormats: '0'});
```

## Backwards Compatibility

✅ **100% backwards compatible**
- Default value `'1'` maintains existing behavior
- Existing code works identically
- Opt-in feature - only affects users who explicitly set it

```javascript
// Before (still works exactly the same)
worksheet.addPivotTable({...});

// After (new optional feature)
worksheet.addPivotTable({..., applyWidthHeightFormats: '0'});
```

## Standards Compliance

Follows [Office Open XML Part 1 Section 18.10](http://www.datypic.com/sc/ooxml/e-ssml_pivotTableDefinition.html):

> **applyWidthHeightFormats** (Apply Width and Height Formats)  
> Specifies a boolean value that indicates whether to apply width and height formatting from the PivotTable style.

This is a standard Excel feature exposed through the OOXML format.

## Files Changed

- `lib/doc/pivot-table.js` - Accept parameter, set default
- `lib/xlsx/xform/pivot-table/pivot-table-xform.js` - Pass to XML
- `test/test-pivot-table.js` - Test case demonstrating feature

## Checklist

- [x] Includes test case
- [x] All existing tests pass
- [x] No breaking changes
- [x] Backwards compatible (opt-in)
- [x] Follows OOXML specification
- [x] Tested manually with Excel

---

**Fork Context:** This PR originates from [@protobi/exceljs](https://www.npmjs.com/package/@protobi/exceljs), a temporary fork with pivot table enhancements. We're submitting all improvements back to upstream.

---

## [#2996] fix: Handle XML special characters and null values in pivot tables

- **GitHub URL:** [PR #2996 on GitHub](https://github.com/exceljs/exceljs/pull/2996)
- **Author:** [@protobi-pieter](https://github.com/protobi-pieter) (Pieter Sheth-Voss)
- **Labels:** *None*
- **Created At:** 2025-11-07T16:31:15Z
- **Updated At:** 2025-11-07T16:31:15Z
- **Local Detail File:** [pr-2996.md](./pr-2996.md)

### Description

## Summary

Fixes two critical issues with pivot table data handling:
1. **XML special character escaping** - Prevents Excel corruption errors when data contains `&`, `<`, `>`, `"`, `'`
2. **Null/undefined value handling** - Prevents crashes when source data contains missing values

Both issues cause Excel to display "We found a problem with some content" or crash when opening files generated by ExcelJS.

## Problem

### Issue 1: XML Special Characters Not Escaped

When pivot table source data contains XML special characters (e.g., company names like "Smith & Co"), ExcelJS generates invalid XML:

```xml
<s v="Smith & Co"/>  ❌ Invalid XML - unescaped ampersand
```

Excel rejects the file with: "We found a problem with some content in 'file.xlsx'"

### Issue 2: Null/Undefined Values Cause Crashes

When source data contains `null` or `undefined`:

```javascript
['Widget', null, 100],  // Missing category
```

ExcelJS throws:
```
Error: undefined not in sharedItems
```

## Solution

### 1. XML Escaping (`lib/xlsx/xform/pivot-table/cache-field.js`)

Added `escapeXml()` method to properly escape special characters in cache field values:

```javascript
escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
```

Now generates valid XML:
```xml
<s v="Smith &amp; Co"/>  ✅ Valid XML
```

### 2. Null/Undefined Handling (`lib/xlsx/xform/pivot-table/pivot-cache-records-xform.js`)

Added check before sharedItems lookup:

```javascript
if (cellValue === null || cellValue === undefined) {
  return '<m />';  // Excel's standard for missing values
}
```

Follows [OOXML standard](http://www.datypic.com/sc/ooxml/e-ssml_m-2.html) for representing missing data in PivotCacheRecords.

## Test Plan

### XML Escaping Test (`test/test-pivot-xml-escape.js`)

Tests data containing all XML special characters:
```javascript
['Smith & Co', 'Price < $100', 'Size > 10"', "It's quoted", '<tag>']
```

Verifies:
- ✅ File generates without errors
- ✅ Excel opens file successfully
- ✅ All characters display correctly

### Null Values Test (`test/test-pivot-null-values.js`)

Tests data with missing values:
```javascript
['Widget', null, 100],
['Gadget', undefined, 200]
```

Verifies:
- ✅ No crash during generation
- ✅ Excel opens file successfully
- ✅ Missing values handled per OOXML spec

## Backwards Compatibility

✅ **Fully backwards compatible**
✅ **No breaking changes**
✅ **All existing tests pass**
✅ **Handles edge cases that previously crashed**

## Real-World Impact

These fixes address common production scenarios:

**Before:** ❌ Crashes with data like:
- Company names: "AT&T", "Ben & Jerry's"
- Comparisons: "Price < $50", "Size > 10 inches"
- Quoted text: "The 'best' option"
- Missing data: null, undefined

**After:** ✅ Works perfectly with all real-world data

## Files Changed

- `lib/xlsx/xform/pivot-table/cache-field.js` - XML escaping
- `lib/xlsx/xform/pivot-table/pivot-cache-records-xform.js` - Null handling
- `test/test-pivot-xml-escape.js` - XML escaping tests
- `test/test-pivot-null-values.js` - Null handling tests

## Standards Compliance

- Follows [OOXML Part 1 Section 18.10](http://www.datypic.com/sc/ooxml/) for PivotCache format
- Uses standard `<m />` tag for missing values (per OOXML spec)
- XML escaping follows [XML 1.0 specification](https://www.w3.org/TR/xml/)

## Checklist

- [x] Includes unit/integration tests
- [x] All existing tests pass
- [x] No breaking changes
- [x] Tested manually with Excel
- [x] Follows OOXML standards

---

**Fork Context:** This PR originates from [@protobi/exceljs](https://www.npmjs.com/package/@protobi/exceljs), a temporary fork with pivot table enhancements. We're submitting all improvements back to upstream.

---

## [#2995] feat: Support multiple pivot tables from same source data

- **GitHub URL:** [PR #2995 on GitHub](https://github.com/exceljs/exceljs/pull/2995)
- **Author:** [@protobi-pieter](https://github.com/protobi-pieter) (Pieter Sheth-Voss)
- **Labels:** *None*
- **Created At:** 2025-11-07T16:29:55Z
- **Updated At:** 2025-11-07T16:29:55Z
- **Local Detail File:** [pr-2995.md](./pr-2995.md)

### Description

## Summary

Adds support for multiple pivot tables per workbook. Previously limited to one pivot table per file, users can now create multiple pivot tables from the same or different source worksheets.

This resolves a fundamental limitation mentioned in the original pivot table PR (#2551) and addresses user requests for multi-table support.

## Motivation

The current implementation throws an error when attempting to create more than one pivot table:
```
Error: A pivot table was already added. At this time, ExcelJS supports at most one pivot table per file.
```

However, Excel natively supports multiple pivot tables, and users frequently need to create different views of the same data source.

## Changes

### 1. **Unique Cache IDs** (`lib/doc/pivot-table.js`)
- Changed from hardcoded `cacheId: '10'` to dynamic `cacheId: String(10 + worksheet.workbook.pivotTables.length)`
- Each pivot table now gets its own cache ID (10, 11, 12, etc.)

### 2. **Unique Pivot Table UIDs** (`lib/xlsx/xform/pivot-table/pivot-table-xform.js`)
- Replaced hardcoded UUID with `uuidv4()` for each pivot table
- Prevents Excel from treating all pivot tables as identical

### 3. **Complete Cache Field Data** (`lib/doc/pivot-table.js`)
- Changed from generating sharedItems only for fields used by that pivot table
- Now generates sharedItems for ALL fields in source worksheet
- Allows any field to be used in any pivot table configuration

### 4. **Correct Worksheet Relationships** (`lib/doc/worksheet.js`, `lib/xlsx/xform/sheet/worksheet-xform.js`)
- Added `tableNumber` property to track correct pivot table file references
- Changed from `pivotTable1.xml` (hardcoded) to `pivotTable${tableNumber}.xml`
- Fixed worksheet relationship XML to reference correct files

### 5. **Fixed State Mutation Bug** (`lib/doc/pivot-table.js`)
- Changed `splice()` to `slice()` in `makeCacheFields()`
- Prevents corrupting source worksheet column data on subsequent pivot table creation

### 6. **Remove One-Table Limit** (`lib/doc/pivot-table.js`)
- Removed validation check that enforced single pivot table limit

## Test Plan

Added comprehensive test case `test/test-pivot-multiple-from-same-source.js`:
- Creates 3 pivot tables from the same source worksheet
- Each with completely different field configurations
- Verifies Excel can open file and display all tables correctly
- All existing tests continue to pass

## Example Usage

```javascript
const workbook = new Excel.Workbook();

// Source data
const dataSheet = workbook.addWorksheet('Sales Data');
dataSheet.addRows([
  ['Region', 'Quarter', 'Product', 'Amount'],
  ['East', 'Q1', 'Widget', 1000],
  ['West', 'Q2', 'Gadget', 2000],
  // ... more data
]);

// Pivot Table 1: By Region
const pivot1 = workbook.addWorksheet('By Region');
pivot1.addPivotTable({
  sourceSheet: dataSheet,
  rows: ['Region'],
  columns: ['Quarter'],
  values: ['Amount']
});

// Pivot Table 2: By Product (different configuration)
const pivot2 = workbook.addWorksheet('By Product');
pivot2.addPivotTable({
  sourceSheet: dataSheet,
  rows: ['Product'],
  columns: ['Quarter'],
  values: ['Amount']
});

// Both pivot tables work correctly!
await workbook.xlsx.writeFile('multiple-pivots.xlsx');
```

## Backwards Compatibility

✅ **Fully backwards compatible** - Existing code with single pivot tables works identically
✅ **No breaking changes** - All existing tests pass
✅ **Opt-in feature** - Multiple tables only if user creates them

## Files Changed

- `lib/doc/pivot-table.js` - Core pivot table generation logic
- `lib/doc/worksheet.js` - Track table numbers
- `lib/xlsx/xform/pivot-table/pivot-table-xform.js` - Unique UIDs
- `lib/xlsx/xform/sheet/worksheet-xform.js` - Correct file references
- `test/test-pivot-multiple-from-same-source.js` - Test case

## Related Issues

- #2551 - Original pivot table PR (mentioned limitation)
- Addresses user requests for multi-table support

## Checklist

- [x] Includes unit/integration tests
- [x] All existing tests pass
- [x] No breaking changes
- [x] Tested manually with Excel
- [x] Backwards compatible

---

**Fork Context:** This PR originates from [@protobi/exceljs](https://www.npmjs.com/package/@protobi/exceljs), a temporary fork with pivot table enhancements. We're submitting all improvements back to upstream.

---

## [#2991] feat: add getFirstWorksheet() method to safely get first existing worksheet 

- **GitHub URL:** [PR #2991 on GitHub](https://github.com/exceljs/exceljs/pull/2991)
- **Author:** [@freepad](https://github.com/freepad) (Damir)
- **Labels:** *None*
- **Created At:** 2025-11-03T10:21:03Z
- **Updated At:** 2025-11-27T08:04:03Z
- **Local Detail File:** [pr-2991.md](./pr-2991.md)

### Description

## Summary

  This method finds and returns the first worksheet that exists (not deleted), regardless of its id. Resolves the issue where getWorksheet(1) would fail after deleting the first worksheet.

  Problem: When users delete worksheets, the IDs don't get reassigned. So after deleting worksheet with id=1, calling getWorksheet(1) returns undefined even though other worksheets exist.

  Solution: The new getFirstWorksheet() method finds the first existing worksheet in the internal array, providing a reliable way to get the first worksheet regardless of deletions.

##  Test plan

  I wrote unit-tests covering all scenarios:
  - Returns first worksheet normally
  - Returns correct worksheet after single/multiple deletions
  - Returns undefined when no worksheets exist

  Run with: 
  ```
  npm run test:unit -- spec/unit/doc/workbook.spec.js --grep "getFirstWorksheet"
  ```

  All tests pass (5/5).

---

## [#2989] Fix transitive dependencies issues in Snyk for outdated version of archiver

- **GitHub URL:** [PR #2989 on GitHub](https://github.com/exceljs/exceljs/pull/2989)
- **Author:** [@nickiannone-fis](https://github.com/nickiannone-fis)
- **Labels:** *None*
- **Created At:** 2025-10-28T14:15:29Z
- **Updated At:** 2026-03-21T21:23:36Z
- **Local Detail File:** [pr-2989.md](./pr-2989.md)

### Description

Testing fix for transitive dependency issue in Snyk

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->
Addresses https://github.com/exceljs/exceljs/issues/2984

## Test plan

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->
Allow automated checks to compile code, see if any builds or automated tests break.

## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->
* https://github.com/exceljs/exceljs/pull/2989/commits/f7b6092aa498c1c0a19700f31969c3348f6619d4

---

## [#2983] Add ImageEditAs type and update addImage method to support 'twoCell' option

- **GitHub URL:** [PR #2983 on GitHub](https://github.com/exceljs/exceljs/pull/2983)
- **Author:** [@hshoja](https://github.com/hshoja) (Hamid Shoja)
- **Labels:** *None*
- **Created At:** 2025-10-08T20:51:35Z
- **Updated At:** 2025-12-03T09:59:59Z
- **Local Detail File:** [pr-2983.md](./pr-2983.md)

### Description

## Summary

This PR adds support for the `twoCell` `editAs` option when adding images to Excel worksheets. This feature allows images to be moved and sized with cells, providing better integration with Excel's filtering and row manipulation features.

This addresses the issue discussed in [GitHub Discussion #2648](https://github.com/exceljs/exceljs/discussions/2648#discussioncomment-8133150) where the images remain visible when rows containing them are filtered or removed. The current library only supports `oneCell` (default) and `absolute` positioning, but Excel's native `twoCell` option provides the expected behavior for images that should move and resize with their containing cells.

- [x] All existing tests pass
- [x] Added new integration test for `twoCell` functionality
- [x] Manual testing completed with example code

## Test plan

See working example demonstrating the `twoCell` functionality: [ExcelJS twoCell Example](https://gist.github.com/hshoja/dd5f9ab63ce60a9b94646150b831d37f)

```javascript
worksheet.addImage(imageId, {
  tl: { col: 1, row: 1 },
  br: { col: 2, row: 2 },
  editAs: "twoCell",
});
```

---

## [#2978] Fix undefined column assignment autofilter

- **GitHub URL:** [PR #2978 on GitHub](https://github.com/exceljs/exceljs/pull/2978)
- **Author:** [@hypesystem](https://github.com/hypesystem) (Niels Abildgaard)
- **Labels:** *None*
- **Created At:** 2025-09-25T14:04:20Z
- **Updated At:** 2025-09-25T14:04:20Z
- **Local Detail File:** [pr-2978.md](./pr-2978.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->

In some cases the autofilter column index refers to an index not defined in the model.
This adds a guard against the case, so the xlsx parser does not crash.

## Test plan

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->

Don't know, guidance appreciated. Tests pass locally.

## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->

N/A

---

## [#2977] Fix large validation ranges by clamping range to highest row in actual data

- **GitHub URL:** [PR #2977 on GitHub](https://github.com/exceljs/exceljs/pull/2977)
- **Author:** [@hypesystem](https://github.com/hypesystem) (Niels Abildgaard)
- **Labels:** *None*
- **Created At:** 2025-09-25T13:39:12Z
- **Updated At:** 2025-09-25T13:39:34Z
- **Local Detail File:** [pr-2977.md](./pr-2977.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->

Fixes #1842

Some validation rules in Excel result in the sheet taking a very long time to load, because the validation loops over all numbers in the range without checking if anything might be in the targeted fields.

This fix looks at the model to find the highest actual row in use, and clamps the range to that row, before running the Range on it.

## Test plan

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->

I don't know. Guidance appreciated.

## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->

N/A

---

## [#2973] Fix parsing error for dynamicFilter nodes in Excel tables

- **GitHub URL:** [PR #2973 on GitHub](https://github.com/exceljs/exceljs/pull/2973)
- **Author:** [@johnnyoshika](https://github.com/johnnyoshika) (Johnny Oshika)
- **Labels:** *None*
- **Created At:** 2025-09-22T22:22:35Z
- **Updated At:** 2025-09-22T22:22:35Z
- **Local Detail File:** [pr-2973.md](./pr-2973.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

Prevent `Unexpected xml node in parseOpen` exception when loading an Excel file with dynamic filters in tables. See related issue: https://github.com/exceljs/exceljs/issues/2972

Demo to reproduce error here: https://github.com/examind-ai/exceljs-dynamicfilter-bug

<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->

## Test plan

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->

This is a very minor change. There is no attempt to add dynamic filter support in this PR. Only to prevent exception when loading Excel files with dynamic filters in tables.

## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->

---

## [DONE] [#2962] fix: handle missing r attribute in row and cell elements (#2961)

- **GitHub URL:** [PR #2962 on GitHub](https://github.com/exceljs/exceljs/pull/2962)
- **Author:** [@Diluka](https://github.com/Diluka) (Diluka)
- **Labels:** *None*
- **Created At:** 2025-08-25T15:17:18Z
- **Updated At:** 2025-08-25T18:19:11Z
- **Local Detail File:** [pr-2962.md](./pr-2962.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough
  information so that others can review your pull request. The two
  fields below are mandatory. -->

  ## Summary

  <!-- Explain the **motivation** for making this change. What
  existing problem does the pull request solve? -->

  This PR fixes issue #2961 where Excel files generated by tools
  like DataGrip/IDEA fail to load due to missing `r` attributes on
  `<row>` and `<cell>` elements.

  **Problem**: When parsing Excel files without `r` attributes, the
   library throws "Invalid row number in model" error because the
  parser expects explicit row and cell references.

  **Solution**:
  - Added `currentAddress` tracking system to `RowXform` class
  - Automatically generate missing `r` attributes based on
  sequential position
  - Reset column counter at the start of each row
  - Maintain full backward compatibility with existing files

  **Changes**:
  - **lib/xlsx/xform/sheet/row-xform.js**: Added address tracking
  logic and automatic `r` attribute generation
  - **spec/integration/issues/issue-2961-missing-r-attribute.spec.j
  s**: Added comprehensive test case
  - **spec/integration/data/test-issue-2961.xlsx**: Added test data
   file from DataGrip

  ## Test plan

  <!-- Demonstrate the code is solid. Example: The exact commands
  you ran and their output, screenshots / videos if the pull
  request changes UI. -->

  **Test Results**:
  ```bash
  # Run specific test for this issue
  $ npx mocha --require spec/config/setup
  spec/integration/issues/issue-2961-missing-r-attribute.spec.js
    github issues
      ✓ issue 2961 - Invalid row number in model when r attribute
  missing

    1 passing (17ms)

  # Run all integration tests
  $ npm run test:integration
    195 passing (2s)
    1 failing  # Pre-existing issue #1328, unrelated to this change
```

  Backward Compatibility Test:
  - All existing integration tests continue to pass (no
  regressions)
  - Files with existing r attributes work unchanged
  - Files missing r attributes now parse correctly

  Manual Testing:
  - ✅ DataGrip-generated Excel file now loads successfully
  - ✅ Cells are parsed in correct positions (A1, B1, C1, A2, B2,
  C2)
  - ✅ Cell values and types are preserved correctly

  Related to source code (for typings update)

  Core Implementation:
  - https://github.com/exceljs/exceljs/blob/master/lib/xlsx/xform/s
  heet/row-xform.js#L86-L100 - Added automatic r attribute
  generation
  - https://github.com/exceljs/exceljs/blob/master/lib/xlsx/xform/s
  heet/row-xform.js#L64-L84 - Added address tracking logic

  Test Coverage:
  - https://github.com/exceljs/exceljs/blob/master/spec/integration
  /issues/issue-2961-missing-r-attribute.spec.js - Verifies fix
  works correctly

  Closes #2961,#2075

---

## [#2956] Fix the return value from dateToExcel() when it's passed a non-numeric value.

- **GitHub URL:** [PR #2956 on GitHub](https://github.com/exceljs/exceljs/pull/2956)
- **Author:** [@davepuchyr](https://github.com/davepuchyr)
- **Labels:** *None*
- **Created At:** 2025-08-12T11:24:05Z
- **Updated At:** 2025-08-12T11:24:05Z
- **Local Detail File:** [pr-2956.md](./pr-2956.md)

### Description

If a non-numeric value is passed to dateToExcel(), like when it's called because the cell style is a date format, the result is "Invalid Date", which gets converted to NaN when the sheet is persisted, which causes Excel to pop-up extremely annoying warnings the next time that the sheet is opened.  This 1-liner fixes that.

<img width="1920" height="1080" alt="damage" src="https://github.com/user-attachments/assets/10137d76-48df-48a7-ac7b-04894ce01107" />

---

## [#2930] Update content-types.01.xml

- **GitHub URL:** [PR #2930 on GitHub](https://github.com/exceljs/exceljs/pull/2930)
- **Author:** [@MatheusdeArmas](https://github.com/MatheusdeArmas)
- **Labels:** *None*
- **Created At:** 2025-05-20T09:06:16Z
- **Updated At:** 2025-05-20T09:06:16Z
- **Local Detail File:** [pr-2930.md](./pr-2930.md)

### Description

[f.txt](https://github.com/user-attachments/files/20336935/f.txt)
<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->

## Test plan

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->

## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->

---

## [DONE] [#2924] Fix Anchor Column and Row Positioning by Adjusting Scaling for Excel Defaults

- **GitHub URL:** [PR #2924 on GitHub](https://github.com/exceljs/exceljs/pull/2924)
- **Author:** [@stany-bns](https://github.com/stany-bns) (Stany Bibwangu)
- **Labels:** *None*
- **Created At:** 2025-04-27T10:06:26Z
- **Updated At:** 2025-04-27T10:06:26Z
- **Local Detail File:** [pr-2924.md](./pr-2924.md)

### Description

…faults

Previously colWidth and rowHeight assumed a simplistic scaling factor, causing incorrect image and object positioning when custom widths/heights were set.

This update uses accurate scaling:
- 8.43 width = 640000 EMUs
- 15 height = 180000 EMUs
This pull request includes several changes aimed at improving code readability and accuracy in calculations, as well as adding a new test for image positioning with custom column widths. The most important changes include refactoring calculation logic in the `Anchor` class, simplifying test assertions, and introducing a new integration test for image positioning.

### Codebase Improvements

* **Refactored calculation logic in `Anchor` class**: Updated column width and row height calculations to use more precise scaling factors for better accuracy. (`lib/doc/anchor.js`: [[1]](diffhunk://#diff-1c3ce3ac271afeea72ebab9674115404b58dc983b2bb4253e5a845137926ea83L41-R42) [[2]](diffhunk://#diff-1c3ce3ac271afeea72ebab9674115404b58dc983b2bb4253e5a845137926ea83L50-R52) [[3]](diffhunk://#diff-1c3ce3ac271afeea72ebab9674115404b58dc983b2bb4253e5a845137926ea83L62-R72)

* **Simplified test assertions**: Replaced multiline assertions with single-line equivalents for better readability in the test suite. (`spec/integration/workbook-xlsx-reader.spec.js`: [[1]](diffhunk://#diff-b824b4bf046576a4d5e4d93830ab2c02fc485a009ea4190758cb0af2d3934092L153-R144) [[2]](diffhunk://#diff-b824b4bf046576a4d5e4d93830ab2c02fc485a009ea4190758cb0af2d3934092L202-R173) [[3]](diffhunk://#diff-b824b4bf046576a4d5e4d93830ab2c02fc485a009ea4190758cb0af2d3934092L314-R276)

### Testing Enhancements

* **New integration test for image positioning**: Added a test to verify that images are positioned correctly when custom column widths are set. (`spec/integration/workbook/images.spec.js`: [spec/integration/workbook/images.spec.jsR292-R338](diffhunk://#diff-f489e39c3772da7d48003e508038c91c33424c3510daef01fdaeb56ccf168835R292-R338))

* **Updated unit tests for `Anchor` class**: Adjusted tests to reflect the new scaling factors in column width and row height calculations. (`spec/unit/doc/anchor.spec.js`: [[1]](diffhunk://#diff-e6b9354d7b4c834ef6ee0461942b72cca0580b828f1856a5cedab217918313b5L22-R22) [[2]](diffhunk://#diff-e6b9354d7b4c834ef6ee0461942b72cca0580b828f1856a5cedab217918313b5L40-R40) [[3]](diffhunk://#diff-e6b9354d7b4c834ef6ee0461942b72cca0580b828f1856a5cedab217918313b5L57-R57)

These changes collectively improve the maintainability and accuracy of the codebase while enhancing test coverage.

Improves placement precision for images and anchored objects.

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->

## Test plan

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->

## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->

---

## [DONE] [#2920] fix: inefficient merge check for large amount of merged cells

- **GitHub URL:** [PR #2920 on GitHub](https://github.com/exceljs/exceljs/pull/2920)
- **Author:** [@3ximus](https://github.com/3ximus) (Fabio)
- **Labels:** *None*
- **Created At:** 2025-04-17T14:25:52Z
- **Updated At:** 2025-04-17T14:25:52Z
- **Local Detail File:** [pr-2920.md](./pr-2920.md)

### Description

This pull request is the same as this stale one https://github.com/exceljs/exceljs/pull/2691 with the comments applied to it. I would really like to see this merge.
Thank you

---

## [DONE] [#2915] Resolved the issue in WorkbookReader where cell values were being interpreted as sharedString instead of the actual value.

- **GitHub URL:** [PR #2915 on GitHub](https://github.com/exceljs/exceljs/pull/2915)
- **Author:** [@AnechaS](https://github.com/AnechaS) (Anecha Kuekharem)
- **Labels:** *None*
- **Created At:** 2025-04-08T18:00:59Z
- **Updated At:** 2025-09-24T17:48:21Z
- **Local Detail File:** [pr-2915.md](./pr-2915.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

Fixed an issue [#683](https://github.com/exceljs/exceljs/issues/683)
 where WorkbookReader sometimes returned actual values and sometimes returned sharedString.

<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->

## Test plan

Execute the process to parse Excel files at frequent intervals.

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->

## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->

---

## [#2912] Fix a constant identifier naming error in the Chinese documentation

- **GitHub URL:** [PR #2912 on GitHub](https://github.com/exceljs/exceljs/pull/2912)
- **Author:** [@yusn](https://github.com/yusn) (余森)
- **Labels:** *None*
- **Created At:** 2025-04-02T08:01:34Z
- **Updated At:** 2025-11-08T06:34:52Z
- **Local Detail File:** [pr-2912.md](./pr-2912.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary
Fix a constant identifier naming error in the Chinese documentation。
<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->

## Test plan

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->

## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->

---

## [DONE] [#2903] Add support for removing images from Worksheet

- **GitHub URL:** [PR #2903 on GitHub](https://github.com/exceljs/exceljs/pull/2903)
- **Author:** [@wwwxy80s](https://github.com/wwwxy80s) (wwwxy)
- **Labels:** *None*
- **Created At:** 2025-03-20T11:54:02Z
- **Updated At:** 2025-03-20T11:55:11Z
- **Local Detail File:** [pr-2903.md](./pr-2903.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

I want remove some image in worksheet
solve https://github.com/exceljs/exceljs/issues/1533

<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->

## Test plan

![image](https://github.com/user-attachments/assets/eda56bc7-0e3b-4a3d-8a56-20889d9f827c)


<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->

## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->

---

## [DONE] [#2894] Fix parse-sax.js broke utf8 string bug

- **GitHub URL:** [PR #2894 on GitHub](https://github.com/exceljs/exceljs/pull/2894)
- **Author:** [@maoxian-1](https://github.com/maoxian-1) (毛线)
- **Labels:** *None*
- **Created At:** 2025-03-03T02:05:03Z
- **Updated At:** 2025-03-03T02:05:03Z
- **Local Detail File:** [pr-2894.md](./pr-2894.md)

### Description

## Summary

Fix #2084 split Chinese or other Unicode String bug.

## Test plan
Before the modification, BufferToString would cause the processed stream to be truncated. After the modification, the stream data following the > symbol will be cached until the next > symbol appears. The > symbol will always be the end of the XML file, so all streams will be processed.

---

## [#2891] #2878: dependencies bump and code fix

- **GitHub URL:** [PR #2891 on GitHub](https://github.com/exceljs/exceljs/pull/2891)
- **Author:** [@rengare](https://github.com/rengare) (Gracjan Górecki)
- **Labels:** *None*
- **Created At:** 2025-02-18T19:50:03Z
- **Updated At:** 2025-03-05T06:28:35Z
- **Local Detail File:** [pr-2891.md](./pr-2891.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->

## Test plan

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->

## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->

---

## [#2885] feat: add 'count' metric for pivot table

- **GitHub URL:** [PR #2885 on GitHub](https://github.com/exceljs/exceljs/pull/2885)
- **Author:** [@dsilva01](https://github.com/dsilva01) (Desiderio Silva)
- **Labels:** *None*
- **Created At:** 2025-02-06T16:01:46Z
- **Updated At:** 2025-02-10T14:54:04Z
- **Local Detail File:** [pr-2885.md](./pr-2885.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

This PR adds support for the **Count** metric in `PivotTable`, allowing users to aggregate data based on the number of occurrences in a given field.  
Currently, `exceljs` supports `sum` metric , but `count` is a widely used aggregation method in Excel that was missing.  
This enhancement aligns PivotTable functionality more closely with native Excel behavior.

## Test plan

- Added unit tests to validate the correct behavior of the Count metric in different scenarios.  
- Manually tested by generating an Excel file and verifying the PivotTable results in Excel.  
- Ensured backward compatibility with existing metric calculations.  

The PR includes a new unit test file, [pivot-tables-with-count.spec.js](https://github.com/dsilva01/exceljs/blob/master/spec/integration/workbook/pivot-tables-with-count.spec.js), with tests for valid and invalid the count metric. All unit tests, including the new tests and all existing tests, pass when running "npm run test:unit".

## Related to source code (for typings update)

👉 Feedback and discussion https://github.com/exceljs/exceljs/discussions/2575.

---

## [#2883] Make to work with expressions with no formulae

- **GitHub URL:** [PR #2883 on GitHub](https://github.com/exceljs/exceljs/pull/2883)
- **Author:** [@AndresDSoto](https://github.com/AndresDSoto) (Andres)
- **Labels:** *None*
- **Created At:** 2025-01-29T16:09:55Z
- **Updated At:** 2025-01-29T16:09:55Z
- **Local Detail File:** [pr-2883.md](./pr-2883.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->
#2311 ran into this issue this other person had. I could not modify the sheet that I was working with so I had to modify the code to fix it. Issue is with expressions that have no fromulae.

Simple change that avoids calling render on a non existent formulae.

## Test plan

No tests as it is trying to avoid the error: TypeError: Cannot read properties of undefined (reading '0')

## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->

---

## [#2876] Fix error of adding image in certain situations

- **GitHub URL:** [PR #2876 on GitHub](https://github.com/exceljs/exceljs/pull/2876)
- **Author:** [@wwwxy80s](https://github.com/wwwxy80s) (wwwxy)
- **Labels:** *None*
- **Created At:** 2025-01-08T11:43:45Z
- **Updated At:** 2025-11-07T17:06:21Z
- **Local Detail File:** [pr-2876.md](./pr-2876.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->
When adding images in a specific order, the wrong images are added

fix https://github.com/exceljs/exceljs/issues/1804

## Test plan

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->
before
![image](https://github.com/user-attachments/assets/fe374aa9-61f7-4b20-b25b-210d4bed5b51)

after 
all case passed

## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->

---

## [#2874] Fix: Changed error-prone race conditions

- **GitHub URL:** [PR #2874 on GitHub](https://github.com/exceljs/exceljs/pull/2874)
- **Author:** [@StevenGee3398](https://github.com/StevenGee3398) (Steven)
- **Labels:** *None*
- **Created At:** 2025-01-03T10:05:17Z
- **Updated At:** 2025-01-03T10:05:17Z
- **Local Detail File:** [pr-2874.md](./pr-2874.md)

### Description

## Summary

When dealing with import/export streams, different errors occured under certain circumstances. For example sharedStrings could sometimes not be resolved after editing the exported .xlsx file with excel, even though the inputOptions are set appropiately. More over there were also cases where the sheetnames could not be read after an export, due to the race conditions in the old iterate-stream method. The workbook was not properly initialized in time. There are surely more edge cases in which the current iterate-stream implementation would lead to unexpected behavior.

Unfortunately, I cannot offer sample files since it is somewhat flaky to reproduce and my own data include client information.

The new implementation utilizes Nodes built-in .once method and removes the race conditions that lead to the problems above.

## Test plan

None.

## Related to source code (for typings update)

---

## [#2869] Bumping unzipper (DUPLICATED #2744)

- **GitHub URL:** [PR #2869 on GitHub](https://github.com/exceljs/exceljs/pull/2869)
- **Author:** [@Siemienik](https://github.com/Siemienik) (Siemienik Pawel)
- **Labels:** *None*
- **Created At:** 2024-12-21T11:46:41Z
- **Updated At:** 2025-01-21T16:00:00Z
- **Local Detail File:** [pr-2869.md](./pr-2869.md)

### Description

Duplicate #2744 due to run pipeline.

---

## [#2867] Introducing styleCacheMode. Up to 3x performance improvements on xlsx…

- **GitHub URL:** [PR #2867 on GitHub](https://github.com/exceljs/exceljs/pull/2867)
- **Author:** [@brunoargolo](https://github.com/brunoargolo)
- **Labels:** *None*
- **Created At:** 2024-12-19T19:33:24Z
- **Updated At:** 2024-12-19T19:41:17Z
- **Local Detail File:** [pr-2867.md](./pr-2867.md)

### Description

Currently useStyles can have a dramatic impact on xlsx write performance, both on stream and non stream writer.

A large part of the problem is how WeakMap is used in conjunction with style object handling on cells. While this can be worked around as evidenced here: https://github.com/exceljs/exceljs/issues/2041 its an external workaround and does not give users that much flexibility.

Most of the times style objects are either cloned or created anew, so the same style configuration are actually distinct objects and the WeakMap in styles-xform.js does not recognize them as the same style config. This causes the WeakMap to grow very large and have few hits per key, in some cases actually hindering performance compared to not cacheing. While its possible to have good performance with WeakMap the developer needs to be very aware of object re-use and its not obvious for most.

A great example of poor WeakMap performance is when there is a Colum/Row style combination or a style is set inside a loop with a cell.style={..} notation. An example of when is has good performance is when a style is created outside a loop and assigned to many cells via cell.style = myStyleRef; But this also causes issues if a style is modified indirectly impacting all other cells (addressing this is not in scope for this change).

This PR introduces an option when creating a workbook styleCacheMode. 
If not specified it behaves just like today using WeakMap so this feature is 100% backwards compatible.
```javascript
const options = {
  filename: './streamed-workbook.xlsx',
  useStyles: true,
  styleCacheMode: 'FAST_MAP,
  useSharedStrings: true
};
const workbook = new Excel.stream.xlsx.WorkbookWriter(options);
``` 

WEAK_MAP: has poor performance if the style objects are not re-used. When you mix Col, row and cell styles a different style object is created per cell and performance deteriorates to being worse then with No Cache.
JSON_MAP: uses JSON.stringify as the key for a style map. The perfromance can be similar to WeakMap or up to 2.5x faster.
FAST_MAP: uses a custom function to encode a style to use it as a key on cache. Should be preferred over JSON_MAP. The encoded style is much smaller and faster to generate then a JSON. The encoding function is designed so two distinct styles can never be encoded to the same key, but if this happens use JSON_MAP instead.
NO_CACHE: In some cases NO_CACHE can be faster than WEAK_MAP. In rare cases it maybe faster than JSON_MAP.

Beanchmark on t3.large for 200k rows with 7 columns:

Mode|AVG (seconds)|x slower than useStyles:false
NO_STYLES|4.16|1.00
WEAK_MAP|21.58|5.19
JSON_MAP|9.24|2.22
FAST_MAP|7.56|1.82
NO_CACHE|19.97|4.81

I have also introduced a convenience method on cell.js called addStyle(style). This is for when you want to add a style to a cell but still respect inheritance of the Col and Row styles.

I'd be happy to make adjustments as needed.

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

Improve performance on xlsx writer when useStyles: true. 
Cases like and similar for both stream and non stream API: https://github.com/exceljs/exceljs/issues/2041

## Test plan

I have added a new unit test file to test FAST_MAP serialization and a new bench mark testing the different cache modes.
to run the benchmark 
```shell
npm run benchmark:styles
``` 

## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->

---

## [#2852] fix: add check for empty target on worksheet-xform reconcile

- **GitHub URL:** [PR #2852 on GitHub](https://github.com/exceljs/exceljs/pull/2852)
- **Author:** [@kyleamazza-fq](https://github.com/kyleamazza-fq)
- **Labels:** *None*
- **Created At:** 2024-11-27T19:46:33Z
- **Updated At:** 2024-11-27T20:18:34Z
- **Local Detail File:** [pr-2852.md](./pr-2852.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary
Adds a conditional check for comments in the model.relationships of worksheet-xform `reconcile`

<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->

## Test plan

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->

## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->

---

## [#2851] fix boolean read val error like as ：<strike val="0"/>

- **GitHub URL:** [PR #2851 on GitHub](https://github.com/exceljs/exceljs/pull/2851)
- **Author:** [@Jason33Wang](https://github.com/Jason33Wang) (Jason233Wang)
- **Labels:** *None*
- **Created At:** 2024-11-26T03:06:56Z
- **Updated At:** 2024-11-26T03:06:56Z
- **Local Detail File:** [pr-2851.md](./pr-2851.md)

### Description

Fix strike tag parsing

The current code doesn't handle <strike val="0"/> correctly. This PR fixes it by:
- Adding support for val attribute in strike tag
- Setting model to false when val="0"
- Setting model to true for <strike/> and other cases

---

## [#2849] feat: support web-native streams for read/write methods

- **GitHub URL:** [PR #2849 on GitHub](https://github.com/exceljs/exceljs/pull/2849)
- **Author:** [@lionel-rowe](https://github.com/lionel-rowe)
- **Labels:** *None*
- **Created At:** 2024-11-21T09:45:18Z
- **Updated At:** 2026-02-09T08:24:12Z
- **Local Detail File:** [pr-2849.md](./pr-2849.md)

### Description

Fixes https://github.com/exceljs/exceljs/issues/1228
Fixes https://github.com/exceljs/exceljs/issues/2753

## Summary

Add support for `read(<web-native ReadableStream instance>)` and `write(<web-native WritableStream instance>)`. Both have excellent support in modern browsers and are also implemented in NodeJS, Deno, and Bun.

## Test plan

See `spec/unit/xlsx/write-writable-stream.spec.js` and changes to `spec/typescript/exceljs.spec.ts`.

## Related to source code (for typings update)

N/A (updated typings are reflected in diffs to runtime code + tests).

---

## [#2847] Shuntagami patch 1

- **GitHub URL:** [PR #2847 on GitHub](https://github.com/exceljs/exceljs/pull/2847)
- **Author:** [@shuntagami](https://github.com/shuntagami)
- **Labels:** *None*
- **Created At:** 2024-11-20T08:04:27Z
- **Updated At:** 2024-11-20T08:04:27Z
- **Local Detail File:** [pr-2847.md](./pr-2847.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->

## Test plan

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->

## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->

---

## [#2846] Update xlsx.js to allow compat with non office generated files.

- **GitHub URL:** [PR #2846 on GitHub](https://github.com/exceljs/exceljs/pull/2846)
- **Author:** [@TheMrDec](https://github.com/TheMrDec) (The Mr Dec)
- **Labels:** *None*
- **Created At:** 2024-11-11T23:47:23Z
- **Updated At:** 2024-11-11T23:49:37Z
- **Local Detail File:** [pr-2846.md](./pr-2846.md)

### Description

## Summary

Some xlsx files generated by 3rd party applications do not come with valid property data in the document formatting. The changes to xlsx.js in this patch seek to allow compatibility with these out of spec files while informing the user of the invalid data.

A simple 'fix' to a problem that shouldn't exist but for some reason 3rd party applications prefer to discard design specifications.

## Test plan

I tested this on one machine running Ubuntu 24.04. I would love to test it more but I have one laptop. I did test against files from 3 3rd party clients (fortiEDR collector export, apache openoffice calc, and libreoffice calc) and 1 file made in excel.

---

## [#2812] update-dependency-version

- **GitHub URL:** [PR #2812 on GitHub](https://github.com/exceljs/exceljs/pull/2812)
- **Author:** [@Diego-18](https://github.com/Diego-18) (Diego Jose Chavez Chirinos)
- **Labels:** *None*
- **Created At:** 2024-08-27T00:54:53Z
- **Updated At:** 2024-08-27T00:54:53Z
- **Local Detail File:** [pr-2812.md](./pr-2812.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->

## Test plan

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->

## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->

---

## [#2809] Added quote prefix feature

- **GitHub URL:** [PR #2809 on GitHub](https://github.com/exceljs/exceljs/pull/2809)
- **Author:** [@ldefelici-mitobit](https://github.com/ldefelici-mitobit)
- **Labels:** *None*
- **Created At:** 2024-08-14T15:36:13Z
- **Updated At:** 2024-08-14T15:40:18Z
- **Local Detail File:** [pr-2809.md](./pr-2809.md)

### Description

## Summary

The pull request add the feature to quote cell content, using the 'quote prefix' style of the xlsx file format.
Using this feature we have the same behavior of the cell A2 in the following image.
  
![image](https://github.com/user-attachments/assets/5a909e6c-8477-4412-abbc-36cad55c759c)

## Test plan

To test the new feature we added a new test 'spec/escape/escape.js' that creates 2 files and into the second one the cell 'A1' use the new feature and escape correctly the cell content (that contains a formula)

## Related to source code (for typings update)

[Feature changes](https://github.com/exceljs/exceljs/commit/9e2b0882c43b491ce9c170c808b6ce8e30360c3f)

---

## [#2807] place pageSetUpPr in the end of sheetPr to fix getting broken xlsx do…

- **GitHub URL:** [PR #2807 on GitHub](https://github.com/exceljs/exceljs/pull/2807)
- **Author:** [@strelok372](https://github.com/strelok372) (v.doz)
- **Labels:** *None*
- **Created At:** 2024-08-12T17:01:41Z
- **Updated At:** 2024-08-12T17:04:11Z
- **Local Detail File:** [pr-2807.md](./pr-2807.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->



## Summary

Fix for this bug
https://github.com/exceljs/exceljs/issues/1348

## Test plan


    const workbook = new ExcelJS.Workbook();

    workbook.creator = 'Me';

    const worksheet = workbook.addWorksheet('My Sheet', {
        pageSetup: {paperSize: 9, orientation: 'landscape', fitToPage: true, fitToHeight: 0}
    });

    const filename = "result.xlsx"
    workbook.xlsx.writeFile(filename);

This code won't work in the 4.4.0 version, you will get an error while opening xlsx file
The problem code is **fitToPage: true**

## Related to source code (for typings update)

https://github.com/exceljs/exceljs/blob/5bed18b45e824f409b08456b59b87430ded023ab/lib/xlsx/xform/sheet/sheet-properties-xform.js#L28

---

## [#2803] Fix corrupted file with conditional formatting and hyperlinks

- **GitHub URL:** [PR #2803 on GitHub](https://github.com/exceljs/exceljs/pull/2803)
- **Author:** [@TheAsda](https://github.com/TheAsda) (Andrey Kiselev)
- **Labels:** *None*
- **Created At:** 2024-08-01T09:57:19Z
- **Updated At:** 2025-11-07T19:05:28Z
- **Local Detail File:** [pr-2803.md](./pr-2803.md)

### Description

## Summary

I faced the issue with stream writer creating corrupted file. Through some experiments and inspecting differences between the file created by the library and handmade file using Microsoft Excel I found out that the corruption appears when you use conditional formatting together with hyperlinks. The issue is that the order of blocks in the worksheet is wrong. This pull request solves this issue.

## Test plan

First we create file using Microsoft Excel with links and some conditional formatting eg. `=MOD(ROW();2)=0` to color every odd row:
![image](https://github.com/user-attachments/assets/d6e0138d-21a5-4d6d-8d1c-5a8ea2b713b3)
Then we inspect the file and see that the order in sheet is: first conditional formatting, second hyperlinks
![image](https://github.com/user-attachments/assets/f9eab3d3-07a8-4bfe-a1b3-1cfc5c470e1e)
After that we create similar file using the library:
```js
const ExcelJS = require("exceljs");
const fs = require("fs");

const fileStream = fs.createWriteStream("output.xlsx");

const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
  stream: fileStream,
  useSharedStrings: false,
  useStyles: true,
});
const worksheet = workbook.addWorksheet("Sheet1");
for (let index = 0; index < 4; index++) {
  worksheet.addRow([
    "test",
    {
      text: "Link",
      hyperlink: "https://google.com",
      tooltip: "https://google.com",
    },
  ]);
}

worksheet.addConditionalFormatting({
  ref: `A1:B4`,
  rules: [
    {
      priority: 1,
      type: "expression",
      formulae: ["MOD(ROW(),2)=0"],
      style: {
        fill: {
          type: "pattern",
          pattern: "solid",
          bgColor: "FFEDEDED",
        },
      },
    },
  ],
});

worksheet.commit();
workbook.commit();

```

If we open the resulting file with Excel we see the error:

![image](https://github.com/user-attachments/assets/2d54f3d4-a2ed-4e2a-9890-ebc55ff36b85)

If we inspect the underlying xml file we see that the order is different:

![image](https://github.com/user-attachments/assets/32b444c3-34cd-4cc9-a2cd-84e4e9a9316c)

So then we can change the order in `worksheet-writer.js` and try the script again:

![image](https://github.com/user-attachments/assets/1980bdd5-2b71-4739-ad92-4017e54b7f14)

The file generates successfully and opens in Excel:

![image](https://github.com/user-attachments/assets/403672bc-46d8-40a6-b1db-d8c781714e0e)

---

## [#2800] fix: worksheet-reader hidden prop

- **GitHub URL:** [PR #2800 on GitHub](https://github.com/exceljs/exceljs/pull/2800)
- **Author:** [@babu-ch](https://github.com/babu-ch) (bab)
- **Labels:** *None*
- **Created At:** 2024-07-27T13:08:04Z
- **Updated At:** 2024-07-27T13:08:04Z
- **Local Detail File:** [pr-2800.md](./pr-2800.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->

fix https://github.com/exceljs/exceljs/issues/2789

## Test plan

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->

test code

The test content is the same as workshee.spec

https://github.com/exceljs/exceljs/blob/5bed18b45e824f409b08456b59b87430ded023ab/spec/integration/worksheet.spec.js#L1190

## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->

---

## [#2791] Issue 2790/xlsx stream missing worksheets

- **GitHub URL:** [PR #2791 on GitHub](https://github.com/exceljs/exceljs/pull/2791)
- **Author:** [@LarryKen](https://github.com/LarryKen) (Larry Burrows)
- **Labels:** *None*
- **Created At:** 2024-07-07T21:13:07Z
- **Updated At:** 2024-09-27T17:01:52Z
- **Local Detail File:** [pr-2791.md](./pr-2791.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->
Provides a integration test case for [issue 2790](https://github.com/exceljs/exceljs/issues/2790) as well as a possible solution.

The stream namespace for xlsx workbook reader does not correctly parse large numbers of worksheets > 100. This is due to the way it is unzipping the file, it is reading the entries from the unzipper parse however it is not correctly draining each entry resulting in the stream halting [node-unzipper](https://github.com/ZJONSSON/node-unzipper?tab=readme-ov-file#parse-zip-file-contents:~:text=If%20you%20do%20not%20intend%20to%20consume%20an%20entry%20stream%27s%20raw%20data%2C%20call%20autodrain()%20to%20dispose%20of%20the%20entry%27s%20contents.%20Otherwise%20the%20stream%20will%20halt.). The iterateStream util does not call autodrain for each data when reading the unzipper stream.

## Test plan

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->

This is the test xlsx file that has 188 worksheets.
[WORKBOOK_WITH_188_SHEETS.xlsx](https://github.com/LarryKen/exceljs-fork/blob/issue-2790/xlsx-stream-missing-worksheets/spec/integration/data/WORKBOOK_WITH_188_SHEETS.xlsx)

I've created a [test case](https://github.com/LarryKen/exceljs-fork/blob/issue-2790/xlsx-stream-missing-worksheets/spec/integration/issues/issue-2790-xlsx-stream-read-large-worksheet-count.spec.js) that will read the file and check whether the count of worksheets emitted is equal to the count of worksheets in the file.

Running `npm run test:integration` get 194 tests passing 2 failing (The 2 failing tests are also failing on master).

![image](https://github.com/exceljs/exceljs/assets/58814227/949f60cf-81b5-4d67-9174-ae514fb4ac36)


## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->

---

## [#2783] :memo: Fix errors in document about image embedding

- **GitHub URL:** [PR #2783 on GitHub](https://github.com/exceljs/exceljs/pull/2783)
- **Author:** [@Cat7373](https://github.com/Cat7373) (Cat73)
- **Labels:** *None*
- **Created At:** 2024-06-26T04:30:48Z
- **Updated At:** 2025-11-08T06:31:50Z
- **Local Detail File:** [pr-2783.md](./pr-2783.md)

### Description

## Summary

In the current documentation, the Chinese and English documents are inconsistent. One uses oneCell, the other uses oneCells. One says absolute is the default value, the other says oneCell is the default value. In addition, passing undefined in the English document is invalid because it will match the default value oneCell.

Fixed the inconsistency between the image embedding part in the document and the actual code. Please refer to the following Issue:

https://github.com/exceljs/exceljs/issues/2730

https://github.com/exceljs/exceljs/issues/1747

Please also refer to the documentation from Microsoft:

https://learn.microsoft.com/en-us/dotnet/api/documentformat.openxml.drawing.spreadsheet.editasvalues?view=openxml-3.0.1

## Test plan
From my project code, it works correctly:

![image](https://github.com/exceljs/exceljs/assets/9296576/583fcc0b-d283-41dc-a3e8-b88e46043455)

---

## [#2781] fix: setting cell style attribute clones style object

- **GitHub URL:** [PR #2781 on GitHub](https://github.com/exceljs/exceljs/pull/2781)
- **Author:** [@gmahomarf](https://github.com/gmahomarf) (Gazy Mahomar)
- **Labels:** *None*
- **Created At:** 2024-06-24T11:25:06Z
- **Updated At:** 2024-06-24T11:25:06Z
- **Local Detail File:** [pr-2781.md](./pr-2781.md)

### Description

## Summary
Fixes #2055.

When setting a style attribute using the setters defined in `Cell` (e.g., `cell.fill = {...}`), the `style` property is edited in place. This creates issues in cells which share the same style as other cells, because each of those cell's `style` properties are the same style object. This fix works around that by cloning a cell's `style` property any time one of the attributes is changed using its setter. This affects the following setters in `Cell`:

- `numFmt`
- `alignment`
- `border`
- `fill`
- `font`
- `protection`

## Test plan
See integration and unit tests in this PR

## Related to source code (for typings update)
N/A

---

## [#2779] improve: add logs to help developers troubleshoot issues

- **GitHub URL:** [PR #2779 on GitHub](https://github.com/exceljs/exceljs/pull/2779)
- **Author:** [@gweesin](https://github.com/gweesin) (gweesin)
- **Labels:** *None*
- **Created At:** 2024-06-15T07:13:33Z
- **Updated At:** 2024-06-15T07:15:55Z
- **Local Detail File:** [pr-2779.md](./pr-2779.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

When we impose restrictions, we should only parse `.xlsx` files, not `.xls` files. Some users might rename `.xls` files to `.xlsx`, making them appear as `.xlsx` files. Although these files can still be parsed by Microsoft Excel, they are not genuine `.xlsx` files.

As a result, users may report that the program cannot handle their `.xlsx` files, which is not actually the case.

I spent a lot of time reviewing the exceljs code and discovered that both `.xls` and `.xlsx` files are essentially zip files, but with different structures. Therefore, if a worksheet is not found in an `.xlsx` file, it might not be a genuine `.xlsx` file or could be another type of zip file. We can provide a message to help developers troubleshoot this issue.

- [real-xlsx.xlsx](https://github.com/user-attachments/files/15846016/real-xlsx.xlsx)
- [real-xls.xlsx](https://github.com/user-attachments/files/15846018/real-xls.xlsx)



## Test plan

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->

None.

## Related to source code (for typings update)

https://github.com/exceljs/exceljs/blob/5bed18b45e824f409b08456b59b87430ded023ab/lib/xlsx/xlsx.js#L414

---

## [#2767] Bug2675 table creation accepts invalid names

- **GitHub URL:** [PR #2767 on GitHub](https://github.com/exceljs/exceljs/pull/2767)
- **Author:** [@georgbuehler](https://github.com/georgbuehler)
- **Labels:** *None*
- **Created At:** 2024-05-24T20:21:24Z
- **Updated At:** 2024-05-24T20:21:24Z
- **Local Detail File:** [pr-2767.md](./pr-2767.md)

### Description

## Summary

This PR fixes [Bug 2675](https://github.com/exceljs/exceljs/issues/2675). It provides validation for the name of the Table being created, and throws an error if an invalid Table name is used (e.g. a name that contains a space or a special character, or that begins with a numeric digit).

## Test plan

The PR includes a new unit test file, [worksheet-table-error-name.spec.js](https://github.com/georgbuehler/exceljs/blob/Bug2675_TableCreationAcceptsInvalidNames/spec/unit/doc/worksheet-table-error-name.spec.js), with tests for valid and invalid Table names. All unit tests, including the new tests and all existing tests, pass when running "npm run test:unit".

## Related to source code (for typings update)

New assertion and supporting function in [table.js](https://github.com/georgbuehler/exceljs/blob/Bug2675_TableCreationAcceptsInvalidNames/lib/doc/table.js)

---

## [#2752] fix #2751 - Csv reading - cells filled with spaces only are converted to 0 

- **GitHub URL:** [PR #2752 on GitHub](https://github.com/exceljs/exceljs/pull/2752)
- **Author:** [@tlgman](https://github.com/tlgman) (Sylvio Menubarbe)
- **Labels:** *None*
- **Created At:** 2024-04-23T08:09:29Z
- **Updated At:** 2024-04-23T08:09:29Z
- **Local Detail File:** [pr-2752.md](./pr-2752.md)

### Description

## Summary

Fix #2751 

## Test plan

```javascript
const wb = new ExcelJS.Workbook();
wb.csv.read(Stream.Readable.from('firstValue;    ;secondValue', { parserOptions: { delimiter: ';' } })
const ws = wb.worksheets[templateInfo.worksheet];

const row1 = ws.getRow(1);
const cell12 = row1.getCell(2);
console.log('cell: 1,2: ', cell12.value); // Displays:  '    ' 
```

## Related to source code (for typings update)

(https://github.com/exceljs/exceljs/blob/master/lib/csv/csv.js#L58)

---

## [#2744] bump: Bumping unzipper to mitigate license issue

- **GitHub URL:** [PR #2744 on GitHub](https://github.com/exceljs/exceljs/pull/2744)
- **Author:** [@dubzzz](https://github.com/dubzzz) (Nicolas DUBIEN)
- **Labels:** `prerelesed`
- **Created At:** 2024-04-15T14:22:07Z
- **Updated At:** 2025-09-17T11:55:22Z
- **Local Detail File:** [pr-2744.md](./pr-2744.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

Unzipper patched a license issue in the 0.11.x version (related issue: https://github.com/ZJONSSON/node-unzipper/issues/293). The full diff of this new minor is avilable at: https://app.renovatebot.com/package-diff?name=unzipper&from=0.10.14&to=0.11.2.

With that PR, I only make sure that exceljs will pull or at least allow users to pull the patched version of unzipper.

Fixes https://github.com/exceljs/exceljs/issues/2743

<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->

## Test plan

Not applicable

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->

## Related to source code (for typings update)

Not applicable

<!-- List with permalink into source code to prove that changes are true -->

---

## [#2737] Don't render empty rich text substrings

- **GitHub URL:** [PR #2737 on GitHub](https://github.com/exceljs/exceljs/pull/2737)
- **Author:** [@Blackhol3](https://github.com/Blackhol3) (Amaury Dalla Monta)
- **Labels:** *None*
- **Created At:** 2024-04-07T15:32:12Z
- **Updated At:** 2024-04-07T15:32:12Z
- **Local Detail File:** [pr-2737.md](./pr-2737.md)

### Description

Excel can't open file with empty rich text substrings. For instance, this code:

```
const workbook = new Workbook();
const worksheet = workbook.addWorksheet('Test');

worksheet.getCell('C1').value = {
	richText: [
		{font: {size: 10, color: {argb: 'ffff0000'}}, text: 'Test 1'},
		{font: {size: 10, color: {argb: 'ff00ff00'}}, text: ''},       // Empty string
		{font: {size: 10, color: {argb: 'ff0000ff'}}, text: 'Test 2'},
	],
};

workbook.xlsx.writeFile('test.xlsx');
```

creates a file for which Excel will throw the following error:

> We found a problem with some content in 'test.xlsx'. Do you want us to try to recover as much as we can? If you trust the source of this workbook, click Yes.

Not rendering the empty substring in the XML solves the problem, without changing the appearance of the resulting rich text.

---

## [#2736] Improve conditional formatting settings

- **GitHub URL:** [PR #2736 on GitHub](https://github.com/exceljs/exceljs/pull/2736)
- **Author:** [@Blackhol3](https://github.com/Blackhol3) (Amaury Dalla Monta)
- **Labels:** *None*
- **Created At:** 2024-04-07T15:21:40Z
- **Updated At:** 2025-12-19T02:40:33Z
- **Local Detail File:** [pr-2736.md](./pr-2736.md)

### Description

Fix #2233 by allowing the `stopIfTrue` setting, and improve the TypeScript definitions and the associated part of the documentation.

---

## [#2720] Fix type mismatch in Address interface

- **GitHub URL:** [PR #2720 on GitHub](https://github.com/exceljs/exceljs/pull/2720)
- **Author:** [@ashc0](https://github.com/ashc0) (Ersola)
- **Labels:** *None*
- **Created At:** 2024-03-05T08:11:48Z
- **Updated At:** 2024-03-13T03:29:42Z
- **Local Detail File:** [pr-2720.md](./pr-2720.md)

### Description

## Summary

Fix [#2719](https://github.com/exceljs/exceljs/issues/2719)

## Test plan

## Related to source code (for typings update)
https://github.com/exceljs/exceljs/blob/master/index.d.ts#L1625C2-L1626C14

---

## [#2710] fix: add proper version control to deps

- **GitHub URL:** [PR #2710 on GitHub](https://github.com/exceljs/exceljs/pull/2710)
- **Author:** [@haikal-handamara-x150s](https://github.com/haikal-handamara-x150s) (Haikal Handamara)
- **Labels:** *None*
- **Created At:** 2024-02-28T06:43:13Z
- **Updated At:** 2024-02-29T23:22:04Z
- **Local Detail File:** [pr-2710.md](./pr-2710.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->
Package `tmp` release new version [0.2.2](https://github.com/raszi/node-tmp/compare/v0.2.1...v0.2.2) which changes the minimum node version from `>=8.17.0` to `>=14` which caused any packages that dependent to `tmp` may broken. This commit lock the `tmp` version to safe version which would not break any application that depends to `exceljs@4.4.0` but running in older NodeJS version (<14).

## Test plan

Normal CI/CD test, but on NodeJS <14

## Related to source code (for typings update)

Nothing

---

## [#2702] Fix date parsing for Strict OpenXML spreadsheets

- **GitHub URL:** [PR #2702 on GitHub](https://github.com/exceljs/exceljs/pull/2702)
- **Author:** [@jec006](https://github.com/jec006) (Josh Caldwell)
- **Labels:** *None*
- **Created At:** 2024-02-21T20:59:36Z
- **Updated At:** 2025-05-15T09:42:11Z
- **Local Detail File:** [pr-2702.md](./pr-2702.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->

This fixes the issue https://github.com/exceljs/exceljs/issues/2695, the parsing of dates in Strict mode isn't working (the dates are stored as strings in this mode - see https://www.loc.gov/preservation/digital/formats/fdd/fdd000401.shtml).

## Test plan

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->

```
> const ExcelJS = require('./excel')
> const fs = require('fs/promises')

> const fh = await fs.open('/Users/joshuacaldwell/Downloads/DateFormatStrict.xlsx')
> const bufferData = await fh.readFile()

> const workbook = new ExcelJS.Workbook();
> await workbook.xlsx.load(bufferData)
<ref *1> Workbook {
  category: undefined,
  company: '',
  created: 2024-02-16T21:36:25.000Z,
  description: undefined,
  keywords: undefined,
  manager: undefined,
  modified: 2024-02-16T21:37:00.000Z,
  properties: { date1904: false },
  calcProperties: {},
  _worksheets: [
    <1 empty item>,
    Worksheet {
      _workbook: [Circular *1],
      id: 1,
      orderNo: 0,
      _name: 'Sheet1',
      state: 'visible',
      _rows: [Array],
      _columns: [Array],
      _keys: {},
      _merges: {},
      rowBreaks: [],
      properties: [Object],
      pageSetup: [Object],
      headerFooter: null,
      dataValidations: [DataValidations],
      views: [Array],
      autoFilter: undefined,
      _media: [],
      sheetProtection: undefined,
      tables: {},
      pivotTables: undefined,
      conditionalFormattings: []
    }
  ],
  subject: undefined,
  title: undefined,
  views: [
    {
      x: 47440,
      y: -2080,
      width: 27640,
      height: 16440,
      visibility: 'visible'
    }
  ],
  media: [],
  pivotTables: [],
  _definedNames: DefinedNames { matrixMap: {} },
  _xlsx: XLSX { workbook: [Circular *1] },
  creator: 'Josh Caldwell',
  lastModifiedBy: 'Josh Caldwell',
  lastPrinted: undefined,
  language: undefined,
  revision: undefined,
  contentStatus: undefined,
  _themes: {
    theme1: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n' +
      '<a:theme xmlns:a="http://purl.oclc.org/ooxml/drawingml/main" name="Office Theme"><a:themeElements><a:clrScheme name="Office"><a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1><a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="44546A"/></a:dk2><a:lt2><a:srgbClr val="E7E6E6"/></a:lt2><a:accent1><a:srgbClr val="4472C4"/></a:accent1><a:accent2><a:srgbClr val="ED7D31"/></a:accent2><a:accent3><a:srgbClr val="A5A5A5"/></a:accent3><a:accent4><a:srgbClr val="FFC000"/></a:accent4><a:accent5><a:srgbClr val="5B9BD5"/></a:accent5><a:accent6><a:srgbClr val="70AD47"/></a:accent6><a:hlink><a:srgbClr val="0563C1"/></a:hlink><a:folHlink><a:srgbClr val="954F72"/></a:folHlink></a:clrScheme><a:fontScheme name="Office"><a:majorFont><a:latin typeface="Calibri Light" panose="020F0302020204030204"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="游ゴシック Light"/><a:font script="Hang" typeface="맑은 고딕"/><a:font script="Hans" typeface="等线 Light"/><a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Times New Roman"/><a:font script="Hebr" typeface="Times New Roman"/><a:font script="Thai" typeface="Tahoma"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="MoolBoran"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Times New Roman"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/><a:font script="Armn" typeface="Arial"/><a:font script="Bugi" typeface="Leelawadee UI"/><a:font script="Bopo" typeface="Microsoft JhengHei"/><a:font script="Java" typeface="Javanese Text"/><a:font script="Lisu" typeface="Segoe UI"/><a:font script="Mymr" typeface="Myanmar Text"/><a:font script="Nkoo" typeface="Ebrima"/><a:font script="Olck" typeface="Nirmala UI"/><a:font script="Osma" typeface="Ebrima"/><a:font script="Phag" typeface="Phagspa"/><a:font script="Syrn" typeface="Estrangelo Edessa"/><a:font script="Syrj" typeface="Estrangelo Edessa"/><a:font script="Syre" typeface="Estrangelo Edessa"/><a:font script="Sora" typeface="Nirmala UI"/><a:font script="Tale" typeface="Microsoft Tai Le"/><a:font script="Talu" typeface="Microsoft New Tai Lue"/><a:font script="Tfng" typeface="Ebrima"/></a:majorFont><a:minorFont><a:latin typeface="Calibri" panose="020F0502020204030204"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="游ゴシック"/><a:font script="Hang" typeface="맑은 고딕"/><a:font script="Hans" typeface="等线"/><a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Arial"/><a:font script="Hebr" typeface="Arial"/><a:font script="Thai" typeface="Tahoma"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="DaunPenh"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Arial"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/><a:font script="Armn" typeface="Arial"/><a:font script="Bugi" typeface="Leelawadee UI"/><a:font script="Bopo" typeface="Microsoft JhengHei"/><a:font script="Java" typeface="Javanese Text"/><a:font script="Lisu" typeface="Segoe UI"/><a:font script="Mymr" typeface="Myanmar Text"/><a:font script="Nkoo" typeface="Ebrima"/><a:font script="Olck" typeface="Nirmala UI"/><a:font script="Osma" typeface="Ebrima"/><a:font script="Phag" typeface="Phagspa"/><a:font script="Syrn" typeface="Estrangelo Edessa"/><a:font script="Syrj" typeface="Estrangelo Edessa"/><a:font script="Syre" typeface="Estrangelo Edessa"/><a:font script="Sora" typeface="Nirmala UI"/><a:font script="Tale" typeface="Microsoft Tai Le"/><a:font script="Talu" typeface="Microsoft New Tai Lue"/><a:font script="Tfng" typeface="Ebrima"/></a:minorFont></a:fontScheme><a:fmtScheme name="Office"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0%"><a:schemeClr val="phClr"><a:lumMod val="110%"/><a:satMod val="105%"/><a:tint val="67%"/></a:schemeClr></a:gs><a:gs pos="50%"><a:schemeClr val="phClr"><a:lumMod val="105%"/><a:satMod val="103%"/><a:tint val="73%"/></a:schemeClr></a:gs><a:gs pos="100%"><a:schemeClr val="phClr"><a:lumMod val="105%"/><a:satMod val="109%"/><a:tint val="81%"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0%"><a:schemeClr val="phClr"><a:satMod val="103%"/><a:lumMod val="102%"/><a:tint val="94%"/></a:schemeClr></a:gs><a:gs pos="50%"><a:schemeClr val="phClr"><a:satMod val="110%"/><a:lumMod val="100%"/><a:shade val="100%"/></a:schemeClr></a:gs><a:gs pos="100%"><a:schemeClr val="phClr"><a:lumMod val="99%"/><a:satMod val="120%"/><a:shade val="78%"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill></a:fillStyleLst><a:lnStyleLst><a:ln w="6350" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800%"/></a:ln><a:ln w="12700" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800%"/></a:ln><a:ln w="19050" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800%"/></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad="57150" dist="19050" dir="5400000" algn="ctr" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="63%"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"><a:tint val="95%"/><a:satMod val="170%"/></a:schemeClr></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0%"><a:schemeClr val="phClr"><a:tint val="93%"/><a:satMod val="150%"/><a:shade val="98%"/><a:lumMod val="102%"/></a:schemeClr></a:gs><a:gs pos="50%"><a:schemeClr val="phClr"><a:tint val="98%"/><a:satMod val="130%"/><a:shade val="90%"/><a:lumMod val="103%"/></a:schemeClr></a:gs><a:gs pos="100%"><a:schemeClr val="phClr"><a:shade val="63%"/><a:satMod val="120%"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/><a:extLst><a:ext uri="{05A4C25C-085E-4340-85A3-A5531E510DB2}"><thm15:themeFamily xmlns:thm15="http://schemas.microsoft.com/office/thememl/2012/main" name="Office Theme" id="{62F939B6-93AF-4DB8-9C6B-D6C7DFDC589F}" vid="{4A3C46E8-61CC-4603-A589-7422A47A8E4A}"/></a:ext></a:extLst></a:theme>'
  }
}

> workbook.worksheets[0].getCell('A2')
<ref *1> Cell {
  _row: Row {
    _worksheet: Worksheet {
      _workbook: [Workbook],
      id: 1,
      orderNo: 0,
      _name: 'Sheet1',
      state: 'visible',
      _rows: [Array],
      _columns: [Array],
      _keys: {},
      _merges: {},
      rowBreaks: [],
      properties: [Object],
      pageSetup: [Object],
      headerFooter: null,
      dataValidations: [DataValidations],
      views: [Array],
      autoFilter: undefined,
      _media: [],
      sheetProtection: undefined,
      tables: {},
      pivotTables: undefined,
      conditionalFormattings: []
    },
    _number: 2,
    _cells: [ [Circular *1] ],
    style: {},
    _outlineLevel: 0,
    _hidden: undefined
  },
  _column: Column {
    _worksheet: Worksheet {
      _workbook: [Workbook],
      id: 1,
      orderNo: 0,
      _name: 'Sheet1',
      state: 'visible',
      _rows: [Array],
      _columns: [Array],
      _keys: {},
      _merges: {},
      rowBreaks: [],
      properties: [Object],
      pageSetup: [Object],
      headerFooter: null,
      dataValidations: [DataValidations],
      views: [Array],
      autoFilter: undefined,
      _media: [],
      sheetProtection: undefined,
      tables: {},
      pivotTables: undefined,
      conditionalFormattings: []
    },
    _number: 1,
    style: {},
    _outlineLevel: 0
  },
  _address: 'A2',
  _value: DateValue {
    model: {
      address: 'A2',
      styleId: undefined,
      value: 2024-02-09T00:00:00.000Z,
      type: 4,
      style: [Object]
    }
  },
  style: {
    numFmt: 'mm-dd-yy',
    font: {
      size: 12,
      color: [Object],
      name: 'Calibri',
      family: 2,
      scheme: 'minor'
    },
    fill: { type: 'pattern', pattern: 'none' }
  },
  _mergeCount: 0
}
> workbook.worksheets[0].getCell('A2').value 
2024-02-09T00:00:00.000Z
```


## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->

---

## [#2698] Issue: style.xml has [Object object] as formatCode

- **GitHub URL:** [PR #2698 on GitHub](https://github.com/exceljs/exceljs/pull/2698)
- **Author:** [@jmatth11](https://github.com/jmatth11) (Joshua Matthews)
- **Labels:** *None*
- **Created At:** 2024-02-20T21:15:11Z
- **Updated At:** 2024-03-04T13:45:18Z
- **Local Detail File:** [pr-2698.md](./pr-2698.md)

### Description

## Summary

Somehow the excel file is in a state where exceljs does not handle extracting the numFmt of a DXF conditional format properly and instead has it set to an object.

This results in the generate style.xml file to have a formatCode of `[Object object]` inside which corrupts the file.

This fix is to check if the numFmt is of the appropriate string type and if not, corrects it by extracting the formatCode before moving forward on the prepare step of writing.

## Test plan

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->

This is the test Excel file I used which has a conditional format on A1:C1 which conditional changes the fill color to yellow and the format to be a custom number format if A1 equals "NO".

[CF1.xlsx](https://github.com/exceljs/exceljs/files/14351092/CF1.xlsx)

I setup a simple `main.js` to read in the test Excel file and write a new file `temp.xlsx`.

```
const ExcelJS = require("exceljs");
const workbook = new ExcelJS.Workbook();
workbook.xlsx.readFile("CF1.xlsx").then(() => {
  workbook.xlsx.writeFile("temp.xlsx");
});
```

With current master branch the result of opening the generated file is this:

<img width="605" alt="original_error" src="https://github.com/exceljs/exceljs/assets/5776125/0e4bbd66-2740-4b79-b3a7-230d75ad88da">
<img width="377" alt="original_error_repair_report" src="https://github.com/exceljs/exceljs/assets/5776125/8b7e47b1-3ac4-4631-9644-e7bdab80eecc">

After repair conditional formatting is removed.

<img width="418" alt="original_error_cf_removed" src="https://github.com/exceljs/exceljs/assets/5776125/97ef75a5-542a-4b55-a2aa-acaf0d584101">

Screenshot of xl/style.xml file with the error:

<img width="398" alt="original_xml_file" src="https://github.com/exceljs/exceljs/assets/5776125/b0835d47-67ad-4e91-b72d-0f03f4e95058">


After the fix the file is generated properly and conditional formatting works as expected.

<img width="448" alt="after_fix" src="https://github.com/exceljs/exceljs/assets/5776125/eb8226b6-4b4c-46eb-b15e-b45f377454c5">

Screenshot of xl/style.xml with fixed format code:

<img width="654" alt="after_fix_xml_file" src="https://github.com/exceljs/exceljs/assets/5776125/d724c554-3dac-41e1-b85d-a41e0fc184d9">


## Related to source code (for typings update)

I'm not really sure what is supposed to go here.

---

## [#2697] Add type DataValidationType

- **GitHub URL:** [PR #2697 on GitHub](https://github.com/exceljs/exceljs/pull/2697)
- **Author:** [@gregfenton](https://github.com/gregfenton) (Greg Fenton)
- **Labels:** *None*
- **Created At:** 2024-02-19T18:28:18Z
- **Updated At:** 2024-08-17T01:35:52Z
- **Local Detail File:** [pr-2697.md](./pr-2697.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

Being able to use `as DataValidationType` is cleaner than having to use `as 'list' | 'whole' | 'decimal' | 'date' | 'textLength' | 'custom'` everywhere.

This new type also makes the pattern consistent with the `DataValidationOperator` type also used in `DataValidation`.

## Test plan

No functional code changes.

## Related to source code (for typings update)

Added a new type (DataValidationType) and used it in one other type definition (DataValidation).

<!-- List with permalink into source code to prove that changes are true -->

---

## [#2691] fix: inefficient merge check for large amount of merged cells within …

- **GitHub URL:** [PR #2691 on GitHub](https://github.com/exceljs/exceljs/pull/2691)
- **Author:** [@aorsten](https://github.com/aorsten)
- **Labels:** *None*
- **Created At:** 2024-02-15T11:38:29Z
- **Updated At:** 2025-04-17T14:27:22Z
- **Local Detail File:** [pr-2691.md](./pr-2691.md)

### Description

When there are a lot of merged cells within a worksheet, e.g. 30.000 merged cells (e.g. the same 2 cells are merged in every row in a 30.000 row table), parsing mergeCells is increasingly slow. This is due to the inefficient conflict check within `_mergeCellsInternal(dimensions, ignoreStyle)` in worksheet.js.

## Summary

My motivation is to let these big files function, rather than load forever. I believe the massive check is unnecessary. Rather than check every other merged range, can't you just see if any of the cells in the new range are merged, and then throw an error?

I do not know the original motivation for the `throw new Error('Cannot merge already merged cells');` error, and whether it always breaks the program, or if the error is caught somewhere. Hopefully the new implementation is much more efficient without breaking anything.

## Test plan

See the issue https://github.com/exceljs/exceljs/issues/2689
I have attached a file there. Loading that file goes from 1.5 minutes in node JS to only seconds. In the browser that file just will not load.

## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->

---

## [#2688] update package name

- **GitHub URL:** [PR #2688 on GitHub](https://github.com/exceljs/exceljs/pull/2688)
- **Author:** [@SahilTamboli7194](https://github.com/SahilTamboli7194) (Sahil Tamboli)
- **Labels:** *None*
- **Created At:** 2024-02-13T09:03:03Z
- **Updated At:** 2024-02-13T09:10:21Z
- **Local Detail File:** [pr-2688.md](./pr-2688.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->

## Test plan

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->

## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->

---

## [#2687] [Breaking] Replace unzipper with yauzl-promise

- **GitHub URL:** [PR #2687 on GitHub](https://github.com/exceljs/exceljs/pull/2687)
- **Author:** [@pnappa](https://github.com/pnappa) (Patrick Nappa)
- **Labels:** *None*
- **Created At:** 2024-02-13T02:44:58Z
- **Updated At:** 2024-12-20T09:59:52Z
- **Local Detail File:** [pr-2687.md](./pr-2687.md)

### Description

## Summary

Unzipper had a transitive dependency on a package that does not have a license. This means that every user is potentially violating the law in using it. Personally, I think it's better to stick to following it, so I've replaced the root dependency with a modern (and updated) alternative.

However, yauzl-promise requires node v16 and above! I think there's some bikeshedding to be done for whether this is worthwhile or not.

This is a breaking change, as the minimum node engine has been bumped from v10 to v16. Note that the engines before this claimed v8 was supported, but the transitive dependencies required >=10. I believe this is an okay change to merge, as anything older than v18 is not supported anymore. https://endoflife.date/nodejs

## Test plan

The test suite passes locally (on my machine).

Resolves https://github.com/exceljs/exceljs/issues/2686

---

## [#2685] Fix error saving files when streaming using autofilter and sheet protection

- **GitHub URL:** [PR #2685 on GitHub](https://github.com/exceljs/exceljs/pull/2685)
- **Author:** [@Dokril](https://github.com/Dokril) (Dmitriy Petrov)
- **Labels:** *None*
- **Created At:** 2024-02-11T10:23:21Z
- **Updated At:** 2024-09-30T08:17:40Z
- **Local Detail File:** [pr-2685.md](./pr-2685.md)

### Description

## Summary
Hello. Recently I came across a problem when, when recording a file in a stream, you set a password and autofilter, the file breaks and cannot be opened. Having slightly changed the source code, I was able to solve this problem by changing the order in which data was written to the file.
## Test plan
The code below on the current version of the library creates a file that does not open and causes an error
![image](https://github.com/exceljs/exceljs/assets/14010816/a5637509-dbd7-4651-8280-27562583bee7)

After commenting 
```ts
worksheet.autoFilter = { from: 'A1', to: 'C1' };
```
or
```ts
await worksheet.protect('test', { formatColumns: true, formatRows: true, autoFilter: true, pivotTables: true });
```
out the error disappears

```ts
import { stream } from 'exceljs';

async function main() {
    const workbook = new stream.xlsx.WorkbookWriter({ filename: './test.xlsx', useStyles: true });

    const worksheet = workbook.addWorksheet('test');
    worksheet.addRow([3, 'Sam', new Date()]).commit();
    worksheet.autoFilter = { from: 'A1', to: 'C1' };
    await worksheet.protect('test', { formatColumns: true, formatRows: true, autoFilter: true, pivotTables: true });
    worksheet.commit();
    await workbook.commit();
}
main();

```
Changes to the pull request correct this error.

---

## [#2680] Fix for Bug 2678: Table creation allows empty array of rows

- **GitHub URL:** [PR #2680 on GitHub](https://github.com/exceljs/exceljs/pull/2680)
- **Author:** [@georgbuehler](https://github.com/georgbuehler)
- **Labels:** *None*
- **Created At:** 2024-02-06T23:08:59Z
- **Updated At:** 2024-05-16T12:01:45Z
- **Local Detail File:** [pr-2680.md](./pr-2680.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary
This is a fix for Bug #2678. It adds an additional test condition to the validate() method on the Table class, to ensure that the rows array is actually populated.

## Test plan

The PR includes a unit test file with the appropriate tests to confirm a complete set of table options works fine, while not populating the rows array results in a run-time error. I've run the full set of Mocha unit tests in my local system and all tests passed.

## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->
One line of code changed in [Table.js](https://github.com/exceljs/exceljs/blob/master/lib/doc/table.js)

---

## [#2672] Fix 'unsafe-eval' CSP issue

- **GitHub URL:** [PR #2672 on GitHub](https://github.com/exceljs/exceljs/pull/2672)
- **Author:** [@cherniavskii](https://github.com/cherniavskii) (Andrew Cherniavskii)
- **Labels:** *None*
- **Created At:** 2024-01-26T13:24:05Z
- **Updated At:** 2024-01-26T13:26:50Z
- **Local Detail File:** [pr-2672.md](./pr-2672.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

Fixes https://github.com/exceljs/exceljs/issues/713
See https://github.com/exceljs/exceljs/issues/713#issuecomment-1828759610 for explanation.
I've used `patch-package` to patch the `jszip` dependency that is using `new Function()` that violates CSP rules.
The new build of exceljs doesn't include the `new Function()` anymore.

## Test plan

I'll prepare before/after demos later as it's tricky to do with Codesandbox/Stackblitz

## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->

---

## [#2671] fix: make iterate-stream more resilient

- **GitHub URL:** [PR #2671 on GitHub](https://github.com/exceljs/exceljs/pull/2671)
- **Author:** [@Kkoile](https://github.com/Kkoile) (Nils Hirsekorn)
- **Labels:** *None*
- **Created At:** 2024-01-25T10:31:30Z
- **Updated At:** 2024-01-25T10:31:30Z
- **Local Detail File:** [pr-2671.md](./pr-2671.md)

### Description

fixes #2663

## Summary
When trying to stream an excel generated by openpyxl the sheet names were not included correctly. This is due to the change in `workbook-reader.js`.  
Further, streaming excel was non deterministic due to `iterate-stream` not being resilient enough. It happened that the stream has ended although more data was about to come. Due to race conditions the behavior was not deterministic.

## Test plan

See integration test and excel provided in the test resources / issue

## Related to source code (for typings update)

n/a

---

## [#2664] Worksheet protect(): fix types

- **GitHub URL:** [PR #2664 on GitHub](https://github.com/exceljs/exceljs/pull/2664)
- **Author:** [@nuragic](https://github.com/nuragic) (Andrea Puddu)
- **Labels:** *None*
- **Created At:** 2024-01-19T08:46:40Z
- **Updated At:** 2024-01-19T08:46:58Z
- **Local Detail File:** [pr-2664.md](./pr-2664.md)

### Description

## Summary

Calling `worksheet.protect()` without arguments works just fine ([code checks the existence of both password and options](https://github.com/exceljs/exceljs/blob/master/lib/doc/worksheet.js#L756-L786)); fixing types so TS won't complain :)

## Test plan

I added a basic test, let me know if you would like to make any change.

---

## [#2655] add: add color field in data bar cf in typescript

- **GitHub URL:** [PR #2655 on GitHub](https://github.com/exceljs/exceljs/pull/2655)
- **Author:** [@krhambaliyaavesta](https://github.com/krhambaliyaavesta) (Krunal Ambaliya)
- **Labels:** *None*
- **Created At:** 2024-01-13T06:43:13Z
- **Updated At:** 2024-04-27T03:56:00Z
- **Local Detail File:** [pr-2655.md](./pr-2655.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

While working with the Databar feature in Conditional formating (cf), I encountered an issue related to the color property in TypeScript typings.

## Purpose of Change

I identified a deficiency in the existing TypeScript typings for the Databar feature in conditional formatting. The current Databar interface lacks a 'color' type, which is essential for specifying colors within the Databar. This gap in the typings prevents developers from accurately representing and utilizing color settings in Databar conditions.

## Changes Made

I have made a targeted change to the TypeScript type file associated with the Databar interface. Specifically, I introduced the 'color' type, which aligns with the functionality of assigning colors in Databar conditions.

## Details

- **Issue Faced:** The absence of the 'color' type in the Databar interface impairs the ability to set colors for Databar conditions in conditional formatting.

- **Solution Proposed:** Addition of the 'color' type to the Databar interface in the TypeScript type file.

## Testing

I have conducted thorough testing to ensure that the introduced 'color' type integrates seamlessly with the Databar feature and does not introduce any regressions.

## Related to Source Code (for typings update)

I made a change in the TypeScript type file, specifically in the Databar interface, to address the color property's absence, enabling developers to utilize color settings in Databar conditions effectively.

<!-- Feel free to connect me. -->

---

## [#2651] Fix issue #2547

- **GitHub URL:** [PR #2651 on GitHub](https://github.com/exceljs/exceljs/pull/2651)
- **Author:** [@darkag](https://github.com/darkag)
- **Labels:** *None*
- **Created At:** 2024-01-05T10:54:13Z
- **Updated At:** 2024-02-23T17:51:42Z
- **Local Detail File:** [pr-2651.md](./pr-2651.md)

### Description

invert order of negativeFillColor and negativeBorderColor

## Summary

Fix the issue #2547

## Test plan

add the following conditionalFormatting rule
the exported file will open with this fix but won't without.

```javascript
 worksheet.addConditionalFormatting({
    ref: "A1:A1"
    rules: [
        {
            type: "dataBar",
            cfvo: [{ type: "min" }, { type: "max" }],
            color: { argb: "FF50FF50" },
            negativeFillColor: { argb: 'FFFF5050' },
            border: true,
            negativeBarBorderColorSameAsPositive: false,
            borderColor: { argb: "FF50FF50" },
            negativeBorderColor: { argb: 'FFFF5050' },
            axisColor: { auto: "1"},
        }
    ]
});
```

---

## [#2633] WorksheetWriter.addImage

- **GitHub URL:** [PR #2633 on GitHub](https://github.com/exceljs/exceljs/pull/2633)
- **Author:** [@shuntagami](https://github.com/shuntagami)
- **Labels:** *None*
- **Created At:** 2023-12-18T06:39:33Z
- **Updated At:** 2024-10-17T07:27:45Z
- **Local Detail File:** [pr-2633.md](./pr-2633.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->

add a bug fix on https://github.com/exceljs/exceljs/pull/2201, resolved conflict

## Test plan

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->

## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->

---

## [#2630] Add additional Media types for worksheet and workbook (Improves type of Media interface)

- **GitHub URL:** [PR #2630 on GitHub](https://github.com/exceljs/exceljs/pull/2630)
- **Author:** [@devcomfort](https://github.com/devcomfort) (devcomfort)
- **Labels:** *None*
- **Created At:** 2023-12-15T13:49:10Z
- **Updated At:** 2023-12-15T13:49:10Z
- **Local Detail File:** [pr-2630.md](./pr-2630.md)

### Description

## Summary

This change adds additional Media types for worksheet and workbook, in order to better reflect the actual object types that are used in these contexts.

## Test plan

The following tests have been added to verify the changes:

- Test that the new Media types can be created and used correctly.
- Test that the new Media types are compatible with the existing Media type.

## Related to source code (for typings update)

The following files have been changed:

- [index.d.ts](https://github.com/devcomfort/exceljs/blob/master/index.d.ts)

## Other changes

Improved type of Media interface.
Changed type of type property from `string` to `"image" | "background"`.

---

## [#2625] Fix splicecolumn mergedcells

- **GitHub URL:** [PR #2625 on GitHub](https://github.com/exceljs/exceljs/pull/2625)
- **Author:** [@roshanreacts](https://github.com/roshanreacts) (Roshan K Gujarathi)
- **Labels:** *None*
- **Created At:** 2023-12-09T06:04:44Z
- **Updated At:** 2024-01-16T14:22:02Z
- **Local Detail File:** [pr-2625.md](./pr-2625.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary
I was facing an issue when we use spliceColumns when there are merged cells in the sliced column range. Which resulted in breaking the excel output as the row.slice was deleting the values of the merged cells and wasn't moving the other merged cells position as per the deleted columns.
<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->

## Test plan
Create a sheet with 2 different merged cells in a row then try to add a spliceColumns line after that with out any insert. Let's say if the spliceColumn is in first merged range it will delete the merged cell and doesn't move the other merged cell range, as per the old code. This fix is applied at row.splice as this method is responsible for moving the cells when we call spliceColumns.
<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->

## Related to source code (for typings update)
To fix the above issue I have filtered all the merged cells which start before the spliceColumn range and end after and also the merged cells which starts are ends after the column range (ignored the merged cells which starts and ends before the splice range as they don't get effected).

```
const mergeItems = this.worksheet._merges.filter(
      merge => merge.model.left > start || (merge.model.left < start && merge.model.right > start)
    );
```
The above code will pull the mergedCells from the sheet. Then only in case of remove cells we iterate through the merged Cells and move them count range. When there is no insert I have added a logic to move the merged cells.
```
mergeItems.forEach(mergeItem => {
        const {model, range} = mergeItem;
        const leftCol = model.left < start ? model.left : model.left - count;
        const rightCol = model.right - count;
        const topRow = model.top;
        const bottomRow = model.bottom;
        const newMergeRange = `${this.getColumn(leftCol).letter}${topRow}:${
          this.getColumn(rightCol).letter
        }${bottomRow}`;
        this.unMergeCells(range);
        if (model.left > start) {
          // Move cell value in the top left corner before merging
          const sourceCell = this.getCell(topRow, model.left);
          const targetCell = this.getCell(topRow, leftCol);
          targetCell.value = sourceCell.value;
          sourceCell.value = null;
          targetCell.style = sourceCell.style;
          sourceCell.style = {};
        }

        this.mergeCells(newMergeRange);
      });
```
Also ignored the row.splice if the dest cell is merged with the following code
```
if (cDst.isMerged) {
            return;
          }
```

Other than the above rest of all are the format changes from prettier
<!-- List with permalink into source code to prove that changes are true -->

---

## [#2614] fix: addImage position is wrong

- **GitHub URL:** [PR #2614 on GitHub](https://github.com/exceljs/exceljs/pull/2614)
- **Author:** [@newbeea](https://github.com/newbeea) (Phil Xu)
- **Labels:** *None*
- **Created At:** 2023-12-05T11:29:12Z
- **Updated At:** 2024-02-28T13:45:34Z
- **Local Detail File:** [pr-2614.md](./pr-2614.md)

### Description

## Summary

This code covers fix for https://github.com/exceljs/exceljs/issues/1820  https://github.com/exceljs/exceljs/issues/894
The image's position is wrong when set range with float numbers and change ws.properties.defaultRowHeight or defaultColWidth.
The position is also wrong when set column's width or row's height 


## Test plan
Change defaultRowHeight defaultColWidth:
```
const fs = require("fs");
const path = require("path");

const HrStopwatch = require("./utils/hr-stopwatch");

const { Workbook } = require("../lib/exceljs.nodejs");

const filename = process.argv[2];

const wb = new Workbook();
const ws = wb.addWorksheet("blort");
ws.properties.defaultRowHeight = 100;
ws.properties.defaultColWidth = 20;

const imageId = wb.addImage({
  filename: path.join(__dirname, "data/image2.png"),
  extension: "png",
});

// ws.getRow(1).height = 100;
// ws.getColumn(1).width = 20;

ws.addImage(imageId, {
  tl: { col: 0.5, row: 0.5 },
  ext: { width: 100, height: 100 },
});


const stopwatch = new HrStopwatch();
stopwatch.start();
wb.xlsx
  .writeFile(filename)
  .then(() => {
    const micros = stopwatch.microseconds;
    console.log("Done.");
    console.log("Time taken:", micros);
  })
  .catch((error) => {
    console.error(error.stack);
  });
```
Bug: image lefttop does not at center of cell
![default-height100-width20](https://github.com/exceljs/exceljs/assets/1249059/16a99e9d-b535-4aec-b962-d03f7f70c45c)
[default-height100-width20.xlsx](https://github.com/exceljs/exceljs/files/13559364/default-height100-width20.xlsx)

After this PR:
![default-height100-width20-fixed](https://github.com/exceljs/exceljs/assets/1249059/006231e6-1fc2-48d9-bba3-3d066fedf133)
[default-height100-width20-fixed.xlsx](https://github.com/exceljs/exceljs/files/13559396/default-height100-width20-fixed.xlsx)


Change colWidth rowHeight
```
const fs = require("fs");
const path = require("path");

const HrStopwatch = require("./utils/hr-stopwatch");

const { Workbook } = require("../lib/exceljs.nodejs");

const filename = process.argv[2];

const wb = new Workbook();
const ws = wb.addWorksheet("blort");
// ws.properties.defaultRowHeight = 100;
// ws.properties.defaultColWidth = 20;

const imageId = wb.addImage({
  filename: path.join(__dirname, "data/image2.png"),
  extension: "png",
});

ws.getRow(1).height = 100;
ws.getColumn(1).width = 20;

ws.addImage(imageId, {
  tl: { col: 0.5, row: 0.5 },
  ext: { width: 100, height: 100 },
});


const stopwatch = new HrStopwatch();
stopwatch.start();
wb.xlsx
  .writeFile(filename)
  .then(() => {
    const micros = stopwatch.microseconds;
    console.log("Done.");
    console.log("Time taken:", micros);
  })
  .catch((error) => {
    console.error(error.stack);
  });
```
Bug: image lefttop does not at center of cell
![custom-height100-width20](https://github.com/exceljs/exceljs/assets/1249059/230b8708-1d62-41ed-9599-e853e9370fb9)
[custom-height100-width20.xlsx](https://github.com/exceljs/exceljs/files/13559385/custom-height100-width20.xlsx)

After this PR:
![custom-height100-width20-fixed](https://github.com/exceljs/exceljs/assets/1249059/aea5c189-8bf1-4511-8893-296871de1506)
[custom-height100-width20-fixed.xlsx](https://github.com/exceljs/exceljs/files/13559400/custom-height100-width20-fixed.xlsx)


## Related to source code (for typings update)

Typings update is not required.

---

## [#2602] Parse page breaks

- **GitHub URL:** [PR #2602 on GitHub](https://github.com/exceljs/exceljs/pull/2602)
- **Author:** [@kigh-ota](https://github.com/kigh-ota) (Kaiichiro Ota)
- **Labels:** *None*
- **Created At:** 2023-11-26T11:32:54Z
- **Updated At:** 2023-11-26T11:32:54Z
- **Local Detail File:** [pr-2602.md](./pr-2602.md)

### Description

## Summary

Reads and parses page breaks into the model.
Previously #1257 added support for writing page breaks, but not for reading/parsing.

Fixes #2249.

## Test plan

```js
// Create 1.xlsx that contains a page break
const wb1 = new Excel.Workbook();
const ws1 = wb1.addWorksheet('row-breaks');
ws1.getCell('A1').value = 'A1';
ws1.getCell('A2').value = 'A2';
ws1.getCell('A3').value = 'A3';
ws1.getCell('A4').value = 'A4';
ws1.getRow(2).addPageBreak();
await wb1.xlsx.writeFile('./1.xlsx');

// Read 1.xlsx and write to 2.xlsx
const wb2 = new Excel.Workbook();
await wb2.xlsx.readFile('./1.xlsx');
console.log(wb2.getWorksheet('row-breaks').rowBreaks); // returns an array of length 1
await wb2.xlsx.writeFile('./2.xlsx');
```

Page Break Preview of 2.xlsx:
![Screenshot 2023-11-26 at 20 15 32](https://github.com/exceljs/exceljs/assets/459628/8998fe0d-96b6-423c-bd47-cd9115765460)

I also added unit tests in `worksheet-xform.spec.js`.

---

## [#2601] feat: Support shapes and text boxes

- **GitHub URL:** [PR #2601 on GitHub](https://github.com/exceljs/exceljs/pull/2601)
- **Author:** [@kigh-ota](https://github.com/kigh-ota) (Kaiichiro Ota)
- **Labels:** *None*
- **Created At:** 2023-11-24T19:33:19Z
- **Updated At:** 2025-09-17T03:24:10Z
- **Local Detail File:** [pr-2601.md](./pr-2601.md)

### Description

## Summary

I created this PR based on DantSu's https://github.com/exceljs/exceljs/pull/2077, which I think is a great work and highly appreciate.

This PR add basic support of reading/writing shapes and textboxes.
This can broaden the use cases of the library, for example, we can load, modify and save existing Excel files including shapes and textboxes without losing them (related issues: #1147, #2086).

To help making the PR closer to merge, compared to the DantSu's PR, I did:
- add some unit/integration tests
- add type definitions (index.d.ts)
- change the structure of some models
- resolve conflicts with the current HEAD
- add some functionalities like inner texts, line dashes and alignments

Note that some common functionalities, e.g. scRGB colors, font types and strikethrough styles, are still lacked in this PR.
I'm also willing to add a part to README document.

## Test plan

```js
ws.addShape({
  type: 'roundRect',
  rotation: 15,
  fill: { type: 'solid', color: { rgb: '4499FF' } },
  outline: { weight: 2, color: { rgb: '446699' }, dash: 'sysDash' },
  textBody: {
    vertAlign: 'ctr',
    paragraphs: [
      { alignment: 'l', runs: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit."] },
      { alignment: 'r', runs: [
        { text: "Nulla eget odio sed libero ultrices vehicula.", font: { bold: true, color: { rgb: 'FF0000' } } },
      ] },
    ],
  },
}, 'B2:H8', {
  hyperlink: 'https://www.example.com',
  tooltip: 'Example Link',
});
```

![285531607-506e7f43-9694-44b9-863d-0627e3c3ea63](https://github.com/exceljs/exceljs/assets/459628/38a99534-2232-435a-ad01-72362b0c93f3)

## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->

---

## [#2596] fix: updated dimensions type

- **GitHub URL:** [PR #2596 on GitHub](https://github.com/exceljs/exceljs/pull/2596)
- **Author:** [@sr-26](https://github.com/sr-26) (Weasely)
- **Labels:** *None*
- **Created At:** 2023-11-18T18:02:43Z
- **Updated At:** 2023-11-18T18:05:29Z
- **Local Detail File:** [pr-2596.md](./pr-2596.md)

### Description

Hello, this pull request introduces an update to the type definition for the dimensions property.

https://github.com/exceljs/exceljs/blob/ddab279a882aba8f18fc5127c6d59e3aa9f596c7/lib/doc/row.js#L229

Closes  #2592

---

## [#2588] Fix shared strings and richText

- **GitHub URL:** [PR #2588 on GitHub](https://github.com/exceljs/exceljs/pull/2588)
- **Author:** [@PetrChalov](https://github.com/PetrChalov) (Petr Chalov)
- **Labels:** *None*
- **Created At:** 2023-11-13T13:20:11Z
- **Updated At:** 2026-05-07T03:28:18Z
- **Local Detail File:** [pr-2588.md](./pr-2588.md)

### Description

## Summary

Corrects the behavior of richText in SharedStrings

See https://github.com/exceljs/exceljs/issues/2267

## Test plan

Create a workbook with multiple richText values and enabled useSharedStrings.

---

## [#2587] Fix types of Row and Column values

- **GitHub URL:** [PR #2587 on GitHub](https://github.com/exceljs/exceljs/pull/2587)
- **Author:** [@pex](https://github.com/pex) (Roman Ernst)
- **Labels:** *None*
- **Created At:** 2023-11-13T12:07:27Z
- **Updated At:** 2023-11-13T12:10:41Z
- **Local Detail File:** [pr-2587.md](./pr-2587.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

- https://github.com/exceljs/exceljs/commit/2225238343151f0c81035aa4a99895a5425d47a2 was supposed to only remove the readonly modifier on `values` of `Column` but accidentally defined it as `string` while it actually remains an `Array`
- Afaik `values` of `Row` will always be an array – thus the obsolete union type was also removed

---

## [#2578] PivotTable: Support multiple values

- **GitHub URL:** [PR #2578 on GitHub](https://github.com/exceljs/exceljs/pull/2578)
- **Author:** [@Rablet](https://github.com/Rablet) (Robin Edrenius)
- **Labels:** *None*
- **Created At:** 2023-11-01T12:46:39Z
- **Updated At:** 2024-03-27T17:03:53Z
- **Local Detail File:** [pr-2578.md](./pr-2578.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

This adds support for multiple values in pivot tables.
It also allows not supplying any columns. This mimics the built-in Excel functionality where it populates the columns field with "Values".

**Limitation:** It is not currently possible to provide multiple values AND any columns.

<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->

With the first implementation checked in yesterday it is not possible to use multiple values. This PR removes that limitation (as long as custom columns are not used)

## Test plan

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->

I created a PivotTable with multiple values and no columns without problems.
I crated a PivotTable with one value and multiple columns without problems

---

## [#2577] Fixed tabColor example and documented hexadecimal format

- **GitHub URL:** [PR #2577 on GitHub](https://github.com/exceljs/exceljs/pull/2577)
- **Author:** [@Mike-Dax](https://github.com/Mike-Dax) (Michael)
- **Labels:** *None*
- **Created At:** 2023-10-31T23:58:38Z
- **Updated At:** 2025-11-08T06:34:08Z
- **Local Detail File:** [pr-2577.md](./pr-2577.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->

The README had an incorrect example for `tabColor`. I've also specified the alpha-red-green-blue format used (since it's different to the expected rgba used across the web).

---

## [#2563] feat: header and footer support image

- **GitHub URL:** [PR #2563 on GitHub](https://github.com/exceljs/exceljs/pull/2563)
- **Author:** [@baian1](https://github.com/baian1)
- **Labels:** `hacktoberfest-accepted`
- **Created At:** 2023-10-20T08:23:27Z
- **Updated At:** 2025-01-12T08:39:47Z
- **Local Detail File:** [pr-2563.md](./pr-2563.md)

### Description

Introduce additional functionalities to enable the use of images in headers and footers.

example code:
```ts
  const workbook = new Excel.Workbook()
  await workbook.xlsx.readFile('./example.xlsx')
  const sheet = workbook.getWorksheet(1)
  sheet.headerFooter.oddHeader = '&R&G image';
  const imageId = workbook.addImage({
    filename: './test.jpeg',
    extension: 'jpeg',
  })
  sheet.addHFImage(imageId, { id: 'HF', width: '15pt', height: '15pt' })
```

---
TODO：
- [x] fix: miss comment legacyDrawing (need help)

---
test xlsx compatibility 
- [x] wps
- [x] office excel
- [ ] ~~libre office~~ not support

---

## [#2562] fix: fixes typescript and intellisense

- **GitHub URL:** [PR #2562 on GitHub](https://github.com/exceljs/exceljs/pull/2562)
- **Author:** [@groozin](https://github.com/groozin) (Tomasz Mikos)
- **Labels:** *None*
- **Created At:** 2023-10-19T08:01:04Z
- **Updated At:** 2024-03-25T12:08:23Z
- **Local Detail File:** [pr-2562.md](./pr-2562.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->
Fixes #2548 

Both intellisense and typescript tests were broken on `master`. Though the issue mentions webstorm as the editor I had the same with vscode. 

Converted the `index.ts` into `index.js` with CJS syntax as per `eslint` requirement. Also fixed the typescript tests and added them to `npm run test:full` script - now that they are working.

## Test plan

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->

For testing I ran `npm run build`
```bash
 ~/r/exceljs | fix/2548/fix..intellisense                                                                                                                51s | 20.8.0 node | 2.7.5 rb
> npm run build

> exceljs@4.3.0 build
> grunt build

Running "babel:dist" (babel) task

Running "browserify:bare" (browserify) task
>> Bundle ./dist/exceljs.bare.js created.

Running "browserify:bundle" (browserify) task
>> Bundle ./dist/exceljs.js created.

Running "browserify:spec" (browserify) task
>> Bundle ./build/web/exceljs.spec.js created.

Running "terser:dist" (terser) task
>> 1 grunt.util.pluralize(createdFiles, 'file/files') created.

Running "terser:bare" (terser) task
>> 1 grunt.util.pluralize(createdFiles, 'file/files') created.

Running "exorcise:bundle" (exorcise) task
Exorcising source map from ./dist/exceljs.js
Exorcising source map from ./dist/exceljs.bare.js

Running "copy:dist" (copy) task
Created 20 directories, copied 332 files

Done.
```

Then `npm run test` (the output is really big so I omit it here).

Also to check intellisense working and to make sure that different module approaches are still working I created 3 files: one `ESM`, one `CJS` and one `TS`. I then use `npm install` from the local source code of my branch to have the changes in. And both checked the intellisens and ran the code in the files to see if the lib is working.

See below:
![image](https://github.com/exceljs/exceljs/assets/3785575/f4379bc5-7bd7-4fbb-9f1b-66dfd04bd2d8)


## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->

---

## [#2558] Fix the problem with writing a file using streams and not using RAM

- **GitHub URL:** [PR #2558 on GitHub](https://github.com/exceljs/exceljs/pull/2558)
- **Author:** [@zlooun](https://github.com/zlooun) (Shabanov Ivan)
- **Labels:** `hacktoberfest-accepted`
- **Created At:** 2023-10-17T09:03:15Z
- **Updated At:** 2025-02-10T17:08:46Z
- **Local Detail File:** [pr-2558.md](./pr-2558.md)

### Description

## Summary

 This PR fixes the problem with writing a file using streams and not using RAM. It solves the problem of writing large excel files.

## Test plan

```
import * as fs from 'fs';
import { stream } from 'exceljs';

const output_file_name = "/test.xlsx";

const writeStream = fs.createWriteStream(output_file_name, { flags: 'w' });
const wb = new stream.xlsx.WorkbookWriter({ stream: writeStream });
const worksheet = wb.addWorksheet("test");

const headers = Array.from({length: 256}, (_, i) => i + 1).map((i) => 'test' + i);

for (let i = 0; i < 100000; i++) {
  const row = headers.map((header) => header + '|' + i);
  await worksheet.addRow(row).commit(); // This raw will be immediately written to disk and will not clog RAM.
}

await worksheet.commit(); // This is not necessary because await wb.commit() is used, but you can also write to disk not raw by raw, but worksheet by worksheet.
await wb.commit();
```

## Related to source code (for typings update)

https://github.com/zlooun/exceljs
https://www.npmjs.com/package/@zlooun/exceljs

---

## [#2341] tests: Add test with a third party exported excel file

- **GitHub URL:** [PR #2341 on GitHub](https://github.com/exceljs/exceljs/pull/2341)
- **Author:** [@Amund211](https://github.com/Amund211) (Amund Eggen Svandal)
- **Labels:** *None*
- **Created At:** 2023-08-28T08:35:29Z
- **Updated At:** 2023-09-23T16:40:16Z
- **Local Detail File:** [pr-2341.md](./pr-2341.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->
This pr adds an excel file to test for regressions.
This file breaks the streaming workbook reader on version 4.3.0, but works with readFile. Both versions work on the current master branch.

## Test plan

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->
No code changes - only added tests

## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->
No code changes - only added tests

---

## [#2278] Downgrade regenerator runtime dependency to be CSP strict-src compliant

- **GitHub URL:** [PR #2278 on GitHub](https://github.com/exceljs/exceljs/pull/2278)
- **Author:** [@lakshit-dua](https://github.com/lakshit-dua)
- **Labels:** *None*
- **Created At:** 2023-05-25T05:07:01Z
- **Updated At:** 2023-09-23T16:40:14Z
- **Local Detail File:** [pr-2278.md](./pr-2278.md)

### Description

## Summary
Exceljs is not CSP strict-src compliant. As per discoveries listed in issue - https://github.com/exceljs/exceljs/issues/713
a Function constructor is invoked by regenerator-runtime dependency (primarily used for polyfilling async/promises through generators). 

Exceljs is compiled in strict mode by default, causing the Function constructor call in the regenerator-runtime script. 
A possible solution listed is to simply use the bare version of exceljs and include this regenerator-runtime lib separately (causing it to not be run in strict mode and hence not invoke the Function constructor).


## Test plan

A simple fix is to downgrade to regenrator-runtime to 0.13.1, which doesn't have the forbidden Function constructor call.

---

## [#2264] fix：Fix the problem of displaying more than 255 characters in formula…

- **GitHub URL:** [PR #2264 on GitHub](https://github.com/exceljs/exceljs/pull/2264)
- **Author:** [@zurmokeeper](https://github.com/zurmokeeper) (zurmokeeper)
- **Labels:** *None*
- **Created At:** 2023-05-07T05:39:14Z
- **Updated At:** 2023-09-23T16:40:14Z
- **Local Detail File:** [pr-2264.md](./pr-2264.md)

### Description

(#2256) #1736
Fix the problem that the exported excel dataValidation drop-down list cannot be displayed normally when the content of formulae exceeds 255 characters when dataValidation type=list

When dataValidation formulae exceed 255 characters，
```
throw new Error('The input cannot be larger than 255 characters. Please check the value of dataValidation.formulae');
```

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->

## Test plan

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->

## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->

---

## [#2201] WorksheetWriter.addImage

- **GitHub URL:** [PR #2201 on GitHub](https://github.com/exceljs/exceljs/pull/2201)
- **Author:** [@yapus](https://github.com/yapus) (Iakov Pustilnik)
- **Labels:** *None*
- **Created At:** 2023-01-23T12:18:47Z
- **Updated At:** 2026-02-20T12:16:18Z
- **Local Detail File:** [pr-2201.md](./pr-2201.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

implement `WorksheetWriter.addImage` for streaming mode

## Test plan

```
node ./test/test-stream-addImage.js test.xlsx
Done.
Time taken: 87586
```
Result (`text.xml`):

![excel-js-stream-addImage](https://user-images.githubusercontent.com/640352/214037798-78521302-6322-483b-af6d-8a4f8b9199d2.png)

## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->

---

## [#2185] fix file not opening because of wrong defaults

- **GitHub URL:** [PR #2185 on GitHub](https://github.com/exceljs/exceljs/pull/2185)
- **Author:** [@nbelyh](https://github.com/nbelyh) (Nikolay Belykh)
- **Labels:** *None*
- **Created At:** 2022-12-26T12:34:12Z
- **Updated At:** 2023-04-27T23:55:33Z
- **Local Detail File:** [pr-2185.md](./pr-2185.md)

### Description

Fixes reading the default values #2184

## Summary

This fixes a bug with Excel showing an error when reading the generated file.

## Test plan

Please refer to the linked issue #2184

---

## [#2148] Issue 2147: stream.xlsx.WorkbookReader.parse() doesn't cleanup temporary files if not fully iterated

- **GitHub URL:** [PR #2148 on GitHub](https://github.com/exceljs/exceljs/pull/2148)
- **Author:** [@Turtlefight](https://github.com/Turtlefight) (Sven Fisch)
- **Labels:** *None*
- **Created At:** 2022-10-05T23:07:02Z
- **Updated At:** 2023-11-20T15:44:09Z
- **Local Detail File:** [pr-2148.md](./pr-2148.md)

### Description

fixes #2147 

## Summary

This pull request provides a fix for the problem described in [Issue 2147: stream.xlsx.WorkbookReader.parse() doesn't cleanup temporary files if not fully iterated](https://github.com/exceljs/exceljs/issues/2147)

It ensures that the temporary xml files get deleted, even if iteration of the async iterable returned from `.parse()` doesn't run to completion.

## Test plan

mocha test for this issue is included in the pull request.

---

## [#2127] Fixed error in FastCsvParserOptionsArgs

- **GitHub URL:** [PR #2127 on GitHub](https://github.com/exceljs/exceljs/pull/2127)
- **Author:** [@andrewasd](https://github.com/andrewasd)
- **Labels:** *None*
- **Created At:** 2022-08-31T06:48:27Z
- **Updated At:** 2023-09-22T17:29:55Z
- **Local Detail File:** [pr-2127.md](./pr-2127.md)

### Description

following the instructions on the ReadMe.md using typescript returns typeError when trying to instatiate options to read csv. I fixed the issue.
![image](https://user-images.githubusercontent.com/44606697/187611961-f310a417-40f8-4013-80a2-139bc6f0e8b6.png)

---

## [#2116] Add duplicate multiple rows feature

- **GitHub URL:** [PR #2116 on GitHub](https://github.com/exceljs/exceljs/pull/2116)
- **Author:** [@joaojhgs](https://github.com/joaojhgs) (JoãoHGS)
- **Labels:** *None*
- **Created At:** 2022-08-19T14:43:50Z
- **Updated At:** 2023-04-06T01:37:22Z
- **Local Detail File:** [pr-2116.md](./pr-2116.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

The current duplicateRow functions does not work with multiple rows as it's supposed, it seems too functionally specific and allows little flexibility towards where to paste the duplicates.

This new implementation can duplicate single rows just like before, but it also allows to duplicate multiple rows as a group, and the new/generic parameters gives it more usage flexibility.

The user will be able to control which rows to duplicate, how much duplicates will be generated and where to paste them, the copies will be pasted in sequence, but the function could also be used multiple times pasting duplicates in different locations.

## Test plan

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->

Initial Template:
![image](https://user-images.githubusercontent.com/74212278/185643916-a79e99be-489f-402a-b5a1-4acc256bb690.png)

Usage example:
`sheet.duplicateRows(
            {
                initialRow: 14,
                length: 4,
                firstRowToPaste: 17,
                copiesAmount: 2,
            },
        );`

Result:

![image](https://user-images.githubusercontent.com/74212278/185644281-cba546ff-b0f6-4fad-866d-922b4e66fcca.png)


## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->

---

## [#2102] Fixed issue 1351 - "worksheet.properties.outlineProperties does not exist"

- **GitHub URL:** [PR #2102 on GitHub](https://github.com/exceljs/exceljs/pull/2102)
- **Author:** [@ksiegel1923](https://github.com/ksiegel1923) (Kara Siegel)
- **Labels:** *None*
- **Created At:** 2022-08-03T14:57:57Z
- **Updated At:** 2023-04-06T01:37:21Z
- **Local Detail File:** [pr-2102.md](./pr-2102.md)

### Description

## Summary

I was using exceljs and wanted to group rows using outline level. I noticed that the elements were grouped with a summary below but I wanted it to be summary above. In the readME it states that I could use worksheet.properties.outlineProperties to set summaryBelow to false but whenever I tried to do this I received an error that outlineProperties did not exist on type worksheet.properties. After doing some research I noticed that there was a bug reported (issue 1351) with the same problem. My pull request addes the outlineProperties to worksheet properties so that summary below and summary right can be set.

---

## [#2095] fix: saving a worksheet with conditional formatting breaks the font styles

- **GitHub URL:** [PR #2095 on GitHub](https://github.com/exceljs/exceljs/pull/2095)
- **Author:** [@Codeneos](https://github.com/Codeneos) (Peter van Gulik)
- **Labels:** *None*
- **Created At:** 2022-07-15T15:51:03Z
- **Updated At:** 2023-04-06T01:37:20Z
- **Local Detail File:** [pr-2095.md](./pr-2095.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary
When opening a workbook with conditional formatting rules and saving it back font style applied by when the conditional formatting rule is true can change. 

To reproduce the issue create workbook using Excel (latest version) with a conditional formatting rule that enables all font styles (italic, bold, strikethrough, etc). The condition of the rule is not relevant just make sure it applies to some rows in the sheet. Save the workbook, close it and reopen it in Excel. Now disable some of the font styles that are applied through the conditional formatting rule. Save the workbook and close it.

Now open the workbook using exceljs and save it without making any changes.

Expected behavior should be that the conditional formatting is exactly the same, observed behavior is that the cells to which conditional formatting is applied will have **all** font styles (italic, bold, strikethrough, etc) applied.

After analysis I found that the dfxs tag in styles.xml containing conditional styles was not getting parsed properly. Each font style is parsed as Boolean tag. When a font should be **bold** the `b` tag is present with no value or attributes: `<b/>`. When the bold is unchecked a `val` attribute is added and set to 0 making the tag look as follows: `<b val="0"/>`.

Looking at the font xform parser the configuration on first inspection looks correct, i.e:
```js
this.map = {
      b: {prop: 'bold', xform: new BooleanXform({tag: 'b', attr: 'val'})},
      i: {prop: 'italic', xform: new BooleanXform({tag: 'i', attr: 'val'})}
      ...
```

Looking a bit deeper in the `BooleanXform` class the `attr` property is being set but completely ignored during the actual parsing of the tag and always returns true. And that is correct when the value is actually true but incorrect when there is an `val` attribute on the tag. In which case `BooleanXform` should honor the value in `val` instead of just checking if the 

```js
class BooleanXform extends BaseXform {
  constructor(options) {
    super();

    this.tag = options.tag;
    this.attr = options.attr;
  }
  
  ...

  parseOpen(node) {
    if (node.name === this.tag) {
      this.model = true;
    }
  }
```

This also fixes issue #1732

## Test plan
We use exceljs to generate a workbook from a database using an excel file as template that defines which columns to export. The template excel file as conditional formattings that makes certain rows as italic. The formatting is copied from the template sheet to the new sheet. The proposed fix has been tested and is confirmed to work for our application.

The spec file that tests the Boolean parser is also updated to test `val='0'` is parsed as false.

The `BooleanXform`-class which is changed in the PR is only used in `FontXform` therefore I expect this change will not have any side effects. Apart from that these changes are backward compatible and only when there is an attribute will the attribute value be honored instead of just checking if the tag exists.

---

## [#2090] Tables and media update functions when inserting or deleting rows/columns in a worksheet

- **GitHub URL:** [PR #2090 on GitHub](https://github.com/exceljs/exceljs/pull/2090)
- **Author:** [@MatthisClavijo](https://github.com/MatthisClavijo)
- **Labels:** *None*
- **Created At:** 2022-07-04T09:56:04Z
- **Updated At:** 2024-01-25T08:10:30Z
- **Local Detail File:** [pr-2090.md](./pr-2090.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary
This PR aims at updating tables and media when a row or a column is inserted or removed in a worksheet. This PR also adds a check for table column name uniqueness. This PR depends on precedent PR #2089.

### - Check for table column name uniqueness

### - Behaviour when inserting or deleting a row/column
#### Table update:
- Reference
- Rows addition or deletion
- Columns addition or deletion

#### Medium update:
- Reference

<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->

## Test plan

***(Reading the xlsx file)***

I have written an integration test that loads an xlsx file containing 2 sheets with 2 tables each, 1 sheet with 3 images and 1 sheet with a chart.

<br><ins>Tables</ins>
It checks if the tables in the first sheet have correct references, adds and deletes rows and checks if the table's reference and rows are correctly updated.
It then adds and removes columns and checks if the table's reference and columns are correctly updated.

<br><ins>Media</ins>
It checks if the second sheet's media have correct references (anchor points), adds and deletes rows and checks if media's references are correctly updated.
It then adds and removes columns and checks if media's references are correctly updated.

No modification is done to the third and fourth sheet. Note that if you generate the output file, the chart doesn't appear as it is not yet supported in exceljs.

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->

## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->

---

## [#2089] Fix #1959 Corrupted file generating by reading and modifing an existing XLSX file with tables

- **GitHub URL:** [PR #2089 on GitHub](https://github.com/exceljs/exceljs/pull/2089)
- **Author:** [@MatthisClavijo](https://github.com/MatthisClavijo)
- **Labels:** *None*
- **Created At:** 2022-06-28T11:37:10Z
- **Updated At:** 2023-04-06T01:37:19Z
- **Local Detail File:** [pr-2089.md](./pr-2089.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary
When reading and modifying an xlsx file containing a table, the generated xlsx file is corrupted.
This is due to the table not complying with the validation() process when parsing (reading) the xlsx file. 
This PR aims to comply with the validation() process.

<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->

## Test plan
#### *(Reading the xlsx file)*
I have written an integration test that loads an xlsx file containing 2 sheets with 2 tables each.
It then checks if the tables in the first sheet have correct references, modifies the reference of the first table and checks if the reference is correctly updated after commit.
No modification is done to the second sheet.
#### *(Generating the modified xlsx file)*
It then writes the new xlsx file.
#### *(Reading the generated xlsx file)*
It loads the newly written file and checks if the tables in the first sheet have correct references to determine if the file is corrupted.

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->

## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->

---

## [#2081] fix utf-8 multibyte  character garbled problem

- **GitHub URL:** [PR #2081 on GitHub](https://github.com/exceljs/exceljs/pull/2081)
- **Author:** [@ligolas](https://github.com/ligolas) (ligolas)
- **Labels:** *None*
- **Created At:** 2022-06-21T15:44:00Z
- **Updated At:** 2023-06-14T08:56:25Z
- **Local Detail File:** [pr-2081.md](./pr-2081.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary
fix bug #2063,  handle data chunk  properly to avoid multibyte character incomplete between chunks 
<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->

## Test plan

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->

## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->

---

## [#2080] fix issue #1695, #1130 reading csv files with headers

- **GitHub URL:** [PR #2080 on GitHub](https://github.com/exceljs/exceljs/pull/2080)
- **Author:** [@consatan](https://github.com/consatan) (Chopin Ngo)
- **Labels:** *None*
- **Created At:** 2022-06-17T14:08:41Z
- **Updated At:** 2024-03-19T09:06:30Z
- **Local Detail File:** [pr-2080.md](./pr-2080.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

Fixed #1695, #1130, reading csv files with `parserOptions.headers` option not `false`, will be throw `data.map is not a function` error. Because the data is an `object`.

Add `headers` envent listener on `fast-csv` to get the header columns, then set to `Worksheet.columns`


## Test plan

See the integration test

---

## [#2079] Fix Unable to specify a note in a cell within a table

- **GitHub URL:** [PR #2079 on GitHub](https://github.com/exceljs/exceljs/pull/2079)
- **Author:** [@rheidari](https://github.com/rheidari) (Reza Heidari)
- **Labels:** *None*
- **Created At:** 2022-06-15T16:33:04Z
- **Updated At:** 2025-01-17T10:56:32Z
- **Local Detail File:** [pr-2079.md](./pr-2079.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->
Fixes #1369 

Moved legacyDrawing to be directly after drawing to match the order specified in https://docs.microsoft.com/en-us/dotnet/api/documentformat.openxml.spreadsheet.worksheet?view=openxml-2.8.1

## Test plan

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->
Make spreadsheet with a note in a cell within a table. Note that the spreadsheet is valid and properly opens with table and note in tact.

## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->

---

## [#2077] Basic shape support added

- **GitHub URL:** [PR #2077 on GitHub](https://github.com/exceljs/exceljs/pull/2077)
- **Author:** [@DantSu](https://github.com/DantSu) (Franck Alary)
- **Labels:** *None*
- **Created At:** 2022-06-14T13:29:24Z
- **Updated At:** 2025-09-17T03:27:52Z
- **Local Detail File:** [pr-2077.md](./pr-2077.md)

### Description

## Summary

This PR adds basic shapes support.

- Parse existing shapes in XLSX file
- Methods in worksheet to list existing shapes and add new one
- Save it in XLSX file.

## Test plan

### Adding a new shape in a Worksheet

```javascript
      ws.addShape(
          {
            shape: Shape.DOWN_ARROW,
            rotation: 45,
            fill : {color: '4499FF', opacity: 0.6},
            stroke: {color: '88AAFF', opacity: 1, weight: 2}
          },
          {
            tl: {col: 19, row: 31},
            ext: {width: 120, height: 50}
          }
        )
```

will result to : 

![arrow_down](https://user-images.githubusercontent.com/4188774/173587684-a2cbaf6a-828d-47ba-9885-a8d77eab7a67.png)

Below a list of tested shapes : 

```javascript
Shape.LINE = 'line';
Shape.RECTANGLE = 'rect';
Shape.ROUND_RECTANGLE = 'roundRect';
Shape.ELLIPSE = 'ellipse';
Shape.TRIANGLE = 'triangle';
Shape.RIGHT_ARROW = 'rightArrow';
Shape.DOWN_ARROW = 'downArrow';
Shape.LEFT_BRACE = 'leftBrace';
Shape.RIGHT_BRACE = 'rightBrace';
```

---

## [#2061] 'None' is another theme style for a table

- **GitHub URL:** [PR #2061 on GitHub](https://github.com/exceljs/exceljs/pull/2061)
- **Author:** [@gocs](https://github.com/gocs) (gocs)
- **Labels:** *None*
- **Created At:** 2022-05-18T01:49:42Z
- **Updated At:** 2024-06-06T01:51:21Z
- **Local Detail File:** [pr-2061.md](./pr-2061.md)

### Description

## Summary

There is another table theme.
Works best when customizing.

## Test plan

excel table styles:

![image](https://user-images.githubusercontent.com/27877342/168939790-b06efe38-5ba1-493b-bfda-6c77fa64fe01.png)


sample js with vscode typescript type checker:

```js
// @ts-check

worksheet.addTable({
    name: 'MyTable',
    ref: 'J3',
    headerRow: true,
    totalsRow: true,
    style: {
      theme: 'None'
      showRowStripes: true,
    },
    columns: [
      {name: 'Date', totalsRowLabel: 'Totals:', filterButton: true},
      {name: 'Amount', totalsRowFunction: 'sum', filterButton: false},
    ],
    rows: [
      [new Date('2019-07-20'), 70.10],
      [new Date('2019-07-21'), 70.60],
      [new Date('2019-07-22'), 70.10],
    ],
  });
```

what it renders:

![image](https://user-images.githubusercontent.com/27877342/168939881-eadf5e7e-cd9f-4fb6-b430-2493a4879f40.png)

---

## [#2049] improved media properties with rotation, extent, offset

- **GitHub URL:** [PR #2049 on GitHub](https://github.com/exceljs/exceljs/pull/2049)
- **Author:** [@GitSamson](https://github.com/GitSamson) (SamsonSun)
- **Labels:** *None*
- **Created At:** 2022-04-30T14:50:46Z
- **Updated At:** 2023-04-06T01:37:46Z
- **Local Detail File:** [pr-2049.md](./pr-2049.md)

### Description

add media rotation, extent, offset property

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

add more properties for media object, such as rotation. 
now can define image rotation in addImage()

## Test plan
Sheet with images to duplicate (test location and rotation, etc..)
![Screenshot 2022-04-30 224542](https://user-images.githubusercontent.com/19159941/166110310-26a4592c-095d-4fb3-b92b-ca66c2400322.jpeg)
duplicated sheet, (using addImage(), not duplicate model directly)
![Screenshot 2022-04-30 224555](https://user-images.githubusercontent.com/19159941/166110333-ecbf4530-5c76-4bea-8edf-735cf50a78a8.jpeg)
Now the media can be exactly the same as provided properties

## Related to source code (for typings update)
xfrm-xform.js:

  parseOpen(node) {
    if (this.parser) {
      this.parser.parseOpen(node);
      return true;
    }
    switch (node.name) {
      case this.tag:
        this.reset();
        this.model = {
          rot: parseInt(node.attributes['rot']) / 60000,
        };
        break;
      default:
        this.parser = this.map[node.name];
        if (this.parser) {
          this.parser.parseOpen(node);
        }
        break;
    }
    return true;
  }

<!-- List with permalink into source code to prove that changes are true -->
https://github.com/GitSamson/FFE_Database_Builder

---

## [#2009] Fix addThemes

- **GitHub URL:** [PR #2009 on GitHub](https://github.com/exceljs/exceljs/pull/2009)
- **Author:** [@bno1](https://github.com/bno1)
- **Labels:** *None*
- **Created At:** 2022-03-15T13:09:04Z
- **Updated At:** 2023-07-21T10:33:35Z
- **Local Detail File:** [pr-2009.md](./pr-2009.md)

### Description

## Summary

This function would not insert the default theme if model.themes is an empty object. This causes errors when opening the spreadsheet in Excel.

---

## [#2002] fix hyperlink hash

- **GitHub URL:** [PR #2002 on GitHub](https://github.com/exceljs/exceljs/pull/2002)
- **Author:** [@nwind](https://github.com/nwind) (吴多益)
- **Labels:** *None*
- **Created At:** 2022-03-14T08:39:24Z
- **Updated At:** 2024-03-14T08:08:12Z
- **Local Detail File:** [pr-2002.md](./pr-2002.md)

### Description

## Summary

lost hash value in hyperlink

## test 

Example file:
[linkhash.xlsx](https://github.com/exceljs/exceljs/files/8243080/linkhash.xlsx)

A1 is hyperlink with hash

<img width="653" alt="image" src="https://user-images.githubusercontent.com/6889/158135106-bb11eebc-7116-4f12-b5c1-5147ad831a31.png">

test source:

```javascript
const Excel = require('exceljs');

const workbook = new Excel.Workbook();

(async function () {
  await workbook.xlsx.readFile('linkhash.xlsx');
  const worksheet = workbook.getWorksheet('Sheet1');
  const cell = worksheet.getCell('A1');
  console.log(cell.value);
})();
```

Result before this pr 

```js
{ text: 'link', hyperlink: 'http://localhost/' }
```

Result after this pr 

```js
{ text: 'link', hyperlink: 'http://localhost/#myhash' }
```

---

## [#2001] fix xlsx parser can not compatible with rich text tags that are not closed

- **GitHub URL:** [PR #2001 on GitHub](https://github.com/exceljs/exceljs/pull/2001)
- **Author:** [@WingMrL](https://github.com/WingMrL) (WingUNO)
- **Labels:** *None*
- **Created At:** 2022-03-11T16:08:32Z
- **Updated At:** 2023-08-01T07:34:16Z
- **Local Detail File:** [pr-2001.md](./pr-2001.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary
Fix xlsx parser can not compatible with rich text tags that are not closed.

<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->

## Test plan
Unable to read an xlsx containing a hyperlink described in rich text. Here's the error infos:
```
error:  TypeError: Cannot create property 'richText' on string ''
    at SharedStringXform.parseClose (/Users/wingmrl/Code/exceljs-demo/node_modules/exceljs/lib/xlsx/xform/strings/shared-string-xform.js:81:40)
    at SharedStringsXform.parseClose (/Users/wingmrl/Code/exceljs-demo/node_modules/exceljs/lib/xlsx/xform/strings/shared-strings-xform.js:111:24)
    at SharedStringsXform.parse (/Users/wingmrl/Code/exceljs-demo/node_modules/exceljs/lib/xlsx/xform/base-xform.js:67:21)
```

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->

## Related to source code (for typings update)

```javascript
'use strict';

/**
 * Minimum reproducible program
 */

const fs = require('fs');
const stream = require('stream');

const Excel = require('../excel');

const filename = process.argv[2];
const buffer = fs.readFileSync(filename);
const workbook = new Excel.Workbook();

const streamReadable = new stream.Readable();
streamReadable.push(buffer);
streamReadable.push(null);

workbook.xlsx
  .read(streamReadable)
  .then(allWorksheet => {
    console.log('allWorksheet: ', allWorksheet);
  })
  .catch(error => {
    console.error('something went wrong', error.stack);
  });

```

<!-- List with permalink into source code to prove that changes are true -->

---

## [#1971] Fixed set multiple print area functionality.

- **GitHub URL:** [PR #1971 on GitHub](https://github.com/exceljs/exceljs/pull/1971)
- **Author:** [@hovikkhachatryan](https://github.com/hovikkhachatryan) (Hovik Khachatryan)
- **Labels:** *None*
- **Created At:** 2022-02-10T19:45:48Z
- **Updated At:** 2023-07-21T10:38:05Z
- **Local Detail File:** [pr-1971.md](./pr-1971.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

BUGFIX for multiple print area functionality. Please check and merge. And thanks for the good library.

## Test plan

test file is already merged with this PR https://github.com/exceljs/exceljs/pull/1042/files

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->

## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->

---

## [#1938] Fix loadin of table rows and ref from xlsx file

- **GitHub URL:** [PR #1938 on GitHub](https://github.com/exceljs/exceljs/pull/1938)
- **Author:** [@antoineacy](https://github.com/antoineacy) (Antoine)
- **Labels:** *None*
- **Created At:** 2021-12-20T16:37:46Z
- **Updated At:** 2023-08-01T07:50:41Z
- **Local Detail File:** [pr-1938.md](./pr-1938.md)

### Description

## Summary

Only structure (columns) of tables are loaded when reading a xlsx file. The data is missing : rows and ref properties remain undefined.

## Test plan

A test file is commited. It tests that table data is properly loaded.

## Related to source code (for typings update)

---

## [#1936] Fix loading of tables with calculated columns.

- **GitHub URL:** [PR #1936 on GitHub](https://github.com/exceljs/exceljs/pull/1936)
- **Author:** [@antoineacy](https://github.com/antoineacy) (Antoine)
- **Labels:** *None*
- **Created At:** 2021-12-20T14:02:34Z
- **Updated At:** 2023-04-06T01:37:41Z
- **Local Detail File:** [pr-1936.md](./pr-1936.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

Loading a table with calculated columns fails. It stops loading columns after the first calculated one, resulting in a wrong column number.

## Test plan

See the test provided. Columns number should be 3, and it is only 2 because column 2 contains a formula.

## Related to source code (for typings update)

https://github.com/antoineacy/exceljs/blob/antoine-patch-1/lib/xlsx/xform/table/table-column-xform.js

---

## [#1933] Add automatic size for comment box

- **GitHub URL:** [PR #1933 on GitHub](https://github.com/exceljs/exceljs/pull/1933)
- **Author:** [@csgka1](https://github.com/csgka1) (hlink)
- **Labels:** *None*
- **Created At:** 2021-12-18T04:16:55Z
- **Updated At:** 2024-04-21T10:48:14Z
- **Local Detail File:** [pr-1933.md](./pr-1933.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

Add a feature to solve issue #981 (#1493 ).

This PR add a option for comment. With that option the comment can be set `Automatic Size` property.
usage:

```js
sheet.getCell('C3').comment = {
    texts: ['This\nIs\nA\nComment\nThat\nNeed\nA\nLarge\nBox'],
    autoShape: true,  // with this option the size of comment box will be adjusted automatically
 };
```

The corresponding setting in excel is in the screenshot below:

<img width="355" alt="image" src="https://user-images.githubusercontent.com/16380986/146628424-f1327c40-7f9c-438c-923a-d7b69df72c08.png">


## Test plan

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->

`npm i && npm run test:all`

All test cases has passed.

## Questions

Should I update `README.MD` at the same time?

---

## [#1929] Release large values early for GC to be able to do its job

- **GitHub URL:** [PR #1929 on GitHub](https://github.com/exceljs/exceljs/pull/1929)
- **Author:** [@kibertoad](https://github.com/kibertoad) (Igor Savin)
- **Labels:** *None*
- **Created At:** 2021-12-14T01:31:43Z
- **Updated At:** 2023-04-14T13:14:26Z
- **Local Detail File:** [pr-1929.md](./pr-1929.md)

### Description

## Summary

Currently we are observing that when importing 19 MB large file, CI eats 2 GB of memory and dies. This is not ideal.

## Test plan

There is a test, showing that loading 19 MB large file does not fail GA CI.

---

## [#1922] Options for WorkbookReader should have an optional type

- **GitHub URL:** [PR #1922 on GitHub](https://github.com/exceljs/exceljs/pull/1922)
- **Author:** [@vicary](https://github.com/vicary) (Vicary)
- **Labels:** *None*
- **Created At:** 2021-12-03T09:20:37Z
- **Updated At:** 2023-04-06T01:37:37Z
- **Local Detail File:** [pr-1922.md](./pr-1922.md)

### Description

*No description provided.*

---

## [#1907] FIX assignStyle on Table.store

- **GitHub URL:** [PR #1907 on GitHub](https://github.com/exceljs/exceljs/pull/1907)
- **Author:** [@o100ja](https://github.com/o100ja) (Aleksandar Ostojić)
- **Labels:** *None*
- **Created At:** 2021-11-17T11:15:01Z
- **Updated At:** 2024-01-04T17:27:57Z
- **Local Detail File:** [pr-1907.md](./pr-1907.md)

### Description

The current implementation sets any style properties directly to the cell instead of merging into the existing cell style.

The result is that if you set a style in a column of a Table model it will break the resulting `xlsx`

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

I need to be able to set the `numFmt` style on a Worksheet table. If I do it direct as in this example:
```javascript
  ws.addTable({
    name     : "FlexReport",
    ref      : "A1",
    headerRow: true,
    totalsRow: true,
    style    : {
      theme         : "TableStyleMedium9",
      showRowStripes: true,
    },
    columns  : [{
      key         : "id",
      name        : "ID",
      filterButton: true,
    }, {
      key         : "name",
      name        : "Name",
      filterButton: true,
    }, {
      key         : "value",
      name        : "value",
      filterButton: true,
      style       : {numFmt: "#,#00.00"},
    }],
    rows,
  });
```
the exported `xlsx` file is broke with the following error: 
![image](https://user-images.githubusercontent.com/1793873/142189773-0ec98e05-0300-45e3-8cc1-fe65164b51d8.png)

## Test plan

After reviewing the source code I've tried to do the same export with the following change, which produced the correct format:
```javascript
  ws.addTable({
    name     : "FlexReport",
    ref      : "A1",
    headerRow: true,
    totalsRow: true,
    style    : {
      theme         : "TableStyleMedium9",
      showRowStripes: true,
    },
    columns  : [{
      key         : "id",
      name        : "ID",
      filterButton: true,
    }, {
      key         : "name",
      name        : "Name",
      filterButton: true,
    }, {
      key         : "value",
      name        : "value",
      filterButton: true,
      style       : {style:{numFmt: "#,#00.00"}}, // <-- Note the change which works but will overwrite any existing cell.style
    }],
    rows,
  });
```

## Related to source code (for typings update)

- https://github.com/o100ja/exceljs/blob/5b41d7ac608ceaf8b0f8df389d8c7398ee68fdbd/lib/doc/table.js#L186

---

## [#1901] Fix worksheet reader type definitions

- **GitHub URL:** [PR #1901 on GitHub](https://github.com/exceljs/exceljs/pull/1901)
- **Author:** [@SpudNyk](https://github.com/SpudNyk)
- **Labels:** *None*
- **Created At:** 2021-11-10T16:09:57Z
- **Updated At:** 2023-09-22T17:32:46Z
- **Local Detail File:** [pr-1901.md](./pr-1901.md)

### Description

Update to match implementation and allow usage of id, name
and state properties.

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->

Allows accessing the worksheet id name and state when using the stream reading in Typescript

## Test plan

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->
N/A

## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->

Matches implementation:
https://github.com/exceljs/exceljs/blob/0f6d7657e71f1de3c1fc2a2a75776b7766f0576a/lib/stream/xlsx/worksheet-reader.js#L12-L49

Properties are assigned by workbook reader here:
https://github.com/exceljs/exceljs/blob/0f6d7657e71f1de3c1fc2a2a75776b7766f0576a/lib/stream/xlsx/workbook-reader.js#L292-L314

---

## [#1889] Support nested columns feature

- **GitHub URL:** [PR #1889 on GitHub](https://github.com/exceljs/exceljs/pull/1889)
- **Author:** [@jeka1985](https://github.com/jeka1985) (Eugene Yemelin)
- **Labels:** *None*
- **Created At:** 2021-11-03T16:18:41Z
- **Updated At:** 2025-04-14T06:29:29Z
- **Local Detail File:** [pr-1889.md](./pr-1889.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

Thanks for a great lib!

Used it for generating styled dynamic reports and found generating dynamic nested headers pretty complicated because of low-level methods for adding rows and manual cell merging.

It would be great to have some declarative way for such tasks. Imho nested JSON tree looks like a solution.

In a nutshell, recursive walk the tree, collect items meta (such as cell size, including aggregated size of all children). Build flat list, use it for generating header rows and columns.

<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->

## Test plan
Backward compatibility is not affected, added new worksheet method `makeColumns` for building flat columns from nested json tree

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->

```
worksheet.makeColumns([
  {
    id: 1, 
    title: 'Some', 
  },
  {id: 2, title: 'Qwe'},
  {id: 3, title: 'Foo'},
  {
    id: 4,
    title: 'Zoo',
    child: [
      { id: 41, title: 'Zoo 1' },
      { id: 42, title: 'Zoo 2' },
      { id: 44, title: 'Zoo 3' },
      { id: 45, title: 'Zoo 4' },
    ]
  }
]);
```
Also you can pass column props such as `width` ad `style` to "leaf" tree items.
This input will be converted into 3 native entity groups

- Columns 
- Rows
- Merge rules

```
makeColumns(input) {
    const flatter = new ColumnFlatter(input);
    const merges = flatter.getMerges();
    this.columns = flatter.getCoumns();

    this.views.push({state: 'frozen', ySplit: flatter.getRows().length});
    
    this.addRows(flatter.getRows().map(row => row.map(item => item?.title || item?.id || null)));

    merges.forEach(item => {
      this.mergeCells(item);
    });
} 
```

## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->

---

## [#1886] Fix Row.values type definition

- **GitHub URL:** [PR #1886 on GitHub](https://github.com/exceljs/exceljs/pull/1886)
- **Author:** [@sergejostir](https://github.com/sergejostir) (Sergej Oštir)
- **Labels:** *None*
- **Created At:** 2021-11-01T16:50:58Z
- **Updated At:** 2023-04-06T01:37:34Z
- **Local Detail File:** [pr-1886.md](./pr-1886.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

Considering the source code, the Row.values can only be an array, therefore the current type definition is not correct.

## Test plan

N/A

## Related to source code (for typings update)

https://github.com/exceljs/exceljs/blob/1d5e5ac02d836f02f2d8b6282b3e1e327f0403b6/lib/doc/row.js#L165-L174

---

## [#1885] Add table support for streaming Mode Fixes issue #1412

- **GitHub URL:** [PR #1885 on GitHub](https://github.com/exceljs/exceljs/pull/1885)
- **Author:** [@mrawdon](https://github.com/mrawdon)
- **Labels:** *None*
- **Created At:** 2021-11-01T14:13:32Z
- **Updated At:** 2023-04-06T01:37:33Z
- **Local Detail File:** [pr-1885.md](./pr-1885.md)

### Description

## Summary

Excel tables were not previously supported in streaming mode. This adds support for tables when using streaming mode.  This fixes the error from #1412 where the addTable method was undefined. 

## Test plan

Added a streaming table test in workbook-xlsx-writer.spec.js I exported the table testing functions(addTable,checktable) from worksheet-table.spec.js

---

## [#1869] Lint fixes

- **GitHub URL:** [PR #1869 on GitHub](https://github.com/exceljs/exceljs/pull/1869)
- **Author:** [@bno1](https://github.com/bno1)
- **Labels:** *None*
- **Created At:** 2021-10-18T18:40:55Z
- **Updated At:** 2023-04-06T01:37:33Z
- **Local Detail File:** [pr-1869.md](./pr-1869.md)

### Description

## Summary

The project has multiple lint and formatting errors. This pull request fixes them.

There is a problem related to the eslint `no-mixed-operators` rule. It enforces expressions such as `1 + 2 * 3` to be parenthesized as `1 + (2 * 3)`. However, prettier removes the parentheses. This issue is tracked at https://github.com/prettier/prettier/issues/187. I disabled the eslint rule to fix this issue.

The alternative solution is to split the expression like eslint-config-prettier recommends: https://github.com/prettier/eslint-config-prettier#no-mixed-operators. However, this will be a bump in the road for developers who are not aware of this issue, so I believe disabling the eslint rule is easier for everyone in the long term.

---

## [#1796] resolves #1033 - Make date1904 property on CellFormulaValue interface optional

- **GitHub URL:** [PR #1796 on GitHub](https://github.com/exceljs/exceljs/pull/1796)
- **Author:** [@Barobi](https://github.com/Barobi)
- **Labels:** *None*
- **Created At:** 2021-07-22T08:37:06Z
- **Updated At:** 2023-12-29T23:35:40Z
- **Local Detail File:** [pr-1796.md](./pr-1796.md)

### Description

See https://github.com/exceljs/exceljs/issues/1033

---

## [#1789] Add support image accessibilities requirements

- **GitHub URL:** [PR #1789 on GitHub](https://github.com/exceljs/exceljs/pull/1789)
- **Author:** [@samuraitruong](https://github.com/samuraitruong) (Truong Nguyen)
- **Labels:** *None*
- **Created At:** 2021-07-19T04:48:22Z
- **Updated At:** 2023-07-25T05:57:04Z
- **Local Detail File:** [pr-1789.md](./pr-1789.md)

### Description

## Summary

- adding support title/description (alt-text) for image - this is required for some level of accessibilities requirements
- add support mark as decorative for the image 

## Test plan
- I updated the test to generate the excel file with image and validate it again  MS Excel
 
## Related to source code (for typings update)

---

## [#1767] Add expression support for x14:cfRule

- **GitHub URL:** [PR #1767 on GitHub](https://github.com/exceljs/exceljs/pull/1767)
- **Author:** [@bno1](https://github.com/bno1)
- **Labels:** *None*
- **Created At:** 2021-07-14T19:24:49Z
- **Updated At:** 2025-01-09T22:00:30Z
- **Local Detail File:** [pr-1767.md](./pr-1767.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

Adds expression support for `x14:cfRule` nodes. The formula is handled similarly to `cfRule` nodes because the conditional formattings rules are merged together.

Closes #1751 

<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->

## Test plan

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->

I tested the spreadsheet I was having problems with in #1751 and everything works fine now.

---

## [#1746] Add removeNote method

- **GitHub URL:** [PR #1746 on GitHub](https://github.com/exceljs/exceljs/pull/1746)
- **Author:** [@dolbyzerr](https://github.com/dolbyzerr) (Andrei)
- **Labels:** *None*
- **Created At:** 2021-06-12T12:39:30Z
- **Updated At:** 2023-04-06T01:37:27Z
- **Local Detail File:** [pr-1746.md](./pr-1746.md)

### Description

## Summary
There is no way to remove a note currently. I found related question: https://github.com/exceljs/exceljs/issues/1153 

According to @Siemienik's comment
```
ws.getCell('A1').note = {};
```
should work. But it just sets the empty comment and not removing it, which can be seen in excel.

<img width="260" alt="Screenshot 2021-06-12 at 20 26 55" src="https://user-images.githubusercontent.com/664335/121775887-a5bf4d00-cbbc-11eb-887a-d2e788d21c91.png">


## Test plan

I've added some unit tests to test that `_comment` property is removed from the Cell class.
I've added a `test-comment-remove.js` script that gets `comments.xlsx` file with comments and generates `test.xlsx` file without comments to check that it's working properly.

<img width="214" alt="Screenshot 2021-06-12 at 20 29 10" src="https://user-images.githubusercontent.com/664335/121775985-23835880-cbbd-11eb-842d-47ec9ad4c113.png">

---

## [#1743] fix CSV reading large number

- **GitHub URL:** [PR #1743 on GitHub](https://github.com/exceljs/exceljs/pull/1743)
- **Author:** [@Harmonickey](https://github.com/Harmonickey) (Alex Ayerdi)
- **Labels:** *None*
- **Created At:** 2021-06-09T02:24:20Z
- **Updated At:** 2022-03-20T21:14:02Z
- **Local Detail File:** [pr-1743.md](./pr-1743.md)

### Description

## Summary

When I read in a CSV file with a value in a cell that exceed the Number() limit in JavaScript then it does not fail graciously.  It simply returns a number but it's extremely hard to catch.  I think in these situations it needs to just return a string so that the user can figure out what they want to do with it, whether it's converting to a BigInt (which is a glorified String anyway) or actually storing their value as a String. 

Example:
'56343416020533614003'

When you try to parse it as a number in csv.js you are doing the following to set datumNumber...
Number('56343416020533614003')

This ends up being 56343416020533620000 in JavaScript

You'd even see that Number('56343416020533614003') == '56343416020533614003' => true because it's coerce the string to a Number with double-equals.  I want a triple-equal check so that we can skip the step in csv.js that's returning the number and instead return a string if it's too big of a number so that the user doesn't lose the original value.

String(Number('56343416020533614003')) === String('56343416020533614003') => false

At least by returning the string then, the user can determine what to do with it without losing the original value.

## Test plan

Please help me with the standard test plan that you might want to use for this?  I'm not sure since there are so many test vectors in this code base.

---

## [#1688] fix issue #894

- **GitHub URL:** [PR #1688 on GitHub](https://github.com/exceljs/exceljs/pull/1688)
- **Author:** [@SuyongSun](https://github.com/SuyongSun) (SuyongSun)
- **Labels:** *None*
- **Created At:** 2021-04-25T03:56:03Z
- **Updated At:** 2023-11-22T06:55:16Z
- **Local Detail File:** [pr-1688.md](./pr-1688.md)

### Description

## Summary
When I use this lib for excel exporting, I found that the issue with image exporting.
When add image with none integer coordinates, I get the wrong position in result file. I found others also facing this problem in issues like #894.

I make some test and lookup the data affter unziping the drawing.xml file. I found that the error is caused by the wrong colwidth and rowheight. The tl and br are set to float number, if the col and row are not resized, the result is ok. But when width or height of the cell, in which tl or br defined, were resized, the result were still calculated with the standard cell width and row. So we got the wrong result.

## Test plan
I read the code related with this problem. Finally, I found the reason occured in anchor.js. There is my fix below.

Put the following code in the first line in constructor function. After this we can get the real column width and row height in worksheet.
this.worksheet = worksheet;

Then, modify the colWidth and rowHeight getters methods to get the correct number. As the default height or width can be undefined in worksheet properties, so we can add some protection code for below sample. We can check if the default heigth or width defined, if not, use constant value instead. (for example, height is 15, width is 9.14XXXXXX.)
Math.floor(this.worksheet.getRow(this.nativeRow + 1).height/this.worksheet.properties.defaultRowHeight * 180000) Math.floor(this.worksheet.getColumn(this.nativeCol + 1).width/this.worksheet.properties.defaultColWidth * 640000)

as the following code we put the image in xlsx with correct positions.
worksheet.addImage(imageId, { tl: {col: 1.1, row: 5.83 }, br: {col: 8.85, row: 10.2 } });
testimage

![111744731-a64e8d00-88c6-11eb-827f-bff3231177ba](https://user-images.githubusercontent.com/12286518/115980249-c35d3680-a5bd-11eb-9239-b3e157bdaa44.png)

---

## [#1665] fix: parse-sax distructs multi-byte char

- **GitHub URL:** [PR #1665 on GitHub](https://github.com/exceljs/exceljs/pull/1665)
- **Author:** [@kouqon](https://github.com/kouqon) (t_mrc-ct)
- **Labels:** *None*
- **Created At:** 2021-04-14T05:23:34Z
- **Updated At:** 2021-11-18T00:56:03Z
- **Local Detail File:** [pr-1665.md](./pr-1665.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

ExcelJS.stream.xlsx.WorkbookReader sometimes distruct multibyte char.
That is because parse-sax convert chunk with fragment of multi-byte char to string.
Parser should remove fragmented char from chunk before converting to string.
Next chunk should be prepend that a fragment and remove a fragment if existed at the end of the chunk.

<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->

## Test plan

node ./test/test-saxes-stream-mbstr.js

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->

## Related to source code (for typings update)

<!-- List with permalink into source code to prove that changes are true -->

---

## [#1664] FIXES #713 Remove 'use strict' strings brute force to enable module packaging

- **GitHub URL:** [PR #1664 on GitHub](https://github.com/exceljs/exceljs/pull/1664)
- **Author:** [@laurisvan](https://github.com/laurisvan) (Lauri Svan)
- **Labels:** *None*
- **Created At:** 2021-04-13T11:17:27Z
- **Updated At:** 2023-06-07T16:54:56Z
- **Local Detail File:** [pr-1664.md](./pr-1664.md)

### Description

## Summary

The current ExcelJS fails with CSP unsafe code evaluation when exceljs is bundled with recent WebPack versions. It appears that the root cause is regenerator-runtime resorting to 'eval':ing the source code whenever it encounters "use strict". This is probably because "use strict" shouldn't be necessary with ES modules (they are strict by default).

I tried various workarounds, such as replacing all "use strict" clauses when babelifying code, having similar replacements with browserify etc. I am almost sure the root cause relates to browserify, e.g. it somehow ends up adding the "use strict" clauses. In absence of a better solution, I thought that brute force removal of "use strict" strings was the only option left, so I added a Grunt task for that. I tried the more popular "grunt-replace" module for this, but unfortunately it failed to process some of the libraries included (because of @@ character somewhere within the code).

I think the long term solution would be to replace the current build system with some other than browserify that would supply the needed polyfills, but I believe such an architectural change would be much bigger undertaking.

## Test plan

Steps to repeat:
1) Include the module in a Webpack build, insert `new CspHtmlWebpackPlugin(cspConfigPolicy, cspOptions)` into plugins array
2) `npm link` the exceljs module into your project
3) Build and load the web page

## Related to source code (for typings update)

N/A

---

## [#1600] Fix spliceRows() issues with delete

- **GitHub URL:** [PR #1600 on GitHub](https://github.com/exceljs/exceljs/pull/1600)
- **Author:** [@iva2k](https://github.com/iva2k) (Ilya I)
- **Labels:** *None*
- **Created At:** 2021-01-29T03:04:21Z
- **Updated At:** 2024-09-24T12:06:51Z
- **Local Detail File:** [pr-1600.md](./pr-1600.md)

### Description

## Summary

Fixes #674 #628 #474

## Test plan

```bash
npm run test
```
There are couple new testcases that exercise deletes near the end of the worksheet rows. They fail prior to the spliceRows() code edits, and pass with the fixes.

---

## [#1596] return destination stream when piping in StreamBuf

- **GitHub URL:** [PR #1596 on GitHub](https://github.com/exceljs/exceljs/pull/1596)
- **Author:** [@GabrielLomba](https://github.com/GabrielLomba) (Gabriel Lomba)
- **Labels:** *None*
- **Created At:** 2021-01-22T23:32:02Z
- **Updated At:** 2021-11-18T00:54:09Z
- **Local Detail File:** [pr-1596.md](./pr-1596.md)

### Description

Fixes StreamBuf pipe method, returning the destination stream. Fixes #1595

## Summary

Fixes usages of StreamBuf in [stream.pipeline](https://nodejs.org/api/stream.html#stream_stream_pipeline_source_transforms_destination_callback) and calls such as:
```javascript
worbook.stream.pipe(fs.createWritableStream('/tmp/sheet.xlsx'))
    .on('finish', ()=>console.log('Sheet has been written!'));
```

## Test plan

Added a unit test related to this change.

---

## [#1573] fix: cell.style.fill problems

- **GitHub URL:** [PR #1573 on GitHub](https://github.com/exceljs/exceljs/pull/1573)
- **Author:** [@huyunan](https://github.com/huyunan)
- **Labels:** *None*
- **Created At:** 2020-12-19T14:37:40Z
- **Updated At:** 2021-02-12T02:29:42Z
- **Local Detail File:** [pr-1573.md](./pr-1573.md)

### Description

# Summary
After all the borders of (A1: B1) are set, read the excel file, and then change the background color of cell A1. The background color of cell B1 will also change.
create test_a.xlsx
```javascript
  const wb = new ExcelJS.Workbook();
  const worksheet = wb.addWorksheet('Sheet1');
  const border = {"left":{"style":"thin"},"right":{"style":"thin"},"top":{"style":"thin"},"bottom":{"style":"thin"}};
  worksheet.getCell('A1').style.border = border;
  worksheet.getCell('A1').value = 'A1';
  worksheet.getCell('B1').style.border = border;
  worksheet.getCell('B1').value = 'B1';
  wb.xlsx.writeFile(path.resolve('./spec/unit/doc/test_a.xlsx'));
```
![image](https://user-images.githubusercontent.com/40879024/102712035-0dc16480-42f9-11eb-8aac-28079ae09888.png)
Then read excel
```javascript
  const wb = new ExcelJS.Workbook();
  const workbook = await wb.xlsx.readFile('./spec/unit/doc/test_a.xlsx');
  workbook.getWorksheet(1).getCell('A1').style.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFF0000' },
    bgColor: { indexed: 64 }
  };
  console.log(workbook.getWorksheet(1).getCell('A1').style.fill === workbook.getWorksheet(1).getCell('B1').style.fill);
  // **true**

  console.log(workbook.getWorksheet(1).getCell('B1').style.fill);
  console.log(workbook.getWorksheet(1).getCell('A1').style.fill);
  workbook.xlsx.writeFile(path.resolve('./spec/unit/doc/test_a0000.xlsx'));
```
fill A1 with red solid but A2 also red solid
![image](https://user-images.githubusercontent.com/40879024/102712085-32b5d780-42f9-11eb-808a-ab4e9026907c.png)

# Test plan spec\unit\utils
A simple test is included in spec/unit/utils/utils.spec.js

---

## [#1570] fix a handful of streaming parser bugs

- **GitHub URL:** [PR #1570 on GitHub](https://github.com/exceljs/exceljs/pull/1570)
- **Author:** [@yocontra](https://github.com/yocontra) (Eric Schoffstall)
- **Labels:** *None*
- **Created At:** 2020-12-17T20:06:20Z
- **Updated At:** 2025-01-27T08:29:54Z
- **Local Detail File:** [pr-1570.md](./pr-1570.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

We use the streaming parser and encountered a number of issues - sometimes files would stall out, sometimes they would always fail unless you opened and resaved the file, sometimes dates would just not be parsed for some files.

### Major Changes

- Change default arguments to match the docs (Closes #1531)
- Fixes a race condition where worksheets would start being read before the styles were parsed, causing dates to fail and show up as numbers (Closes #1430)
- Fixes a stall (unreported?) in the BaseXForm parser - if closetag was encountered it would return, and the sax parser would fail to flush and just pause forever. The correct behavior should be to break so that it flushes the parser correctly.
- Fixes a stall (unreported?) where worksheets would never be read.
  - I resolved this by implementing a basic queue to handle the waitingWorksheets logic - I think this cleans up the code a bit as well and makes it easier to understand.
- Removes the `iterateStream` utility, which was causing stalls and race conditions (Closes #1558)
  - I read through all of the previous conversation on the unzipper project so I understand the initial reason why it was added.
  - All tests pass without it, I think this was just covering up for some of the previous bugs - file parser generators were stalling which bubbles up causing the unzipper generator to stall as well (and thus fail to autodrain, because that statement was never reached).

### Minor Changes

- Changes the getStream ducktype to match the other code in the project (just checking for a pipe function)
- Use pipeline when writing files so that errors are properly managed
- Removed some node 8 code - Node 8 has been deprecated/EOL since 2019 (https://blog.risingstack.com/update-nodejs-8-end-of-life-no-support/)
- Switches to the promise version of autodrain, since your PR to unzipper making that work correctly landed and is published

## Test plan

All of our edge case tests that use exceljs under the hood pass, and the existing exceljs tests pass. Let me know if you would like to see any additional tests.

---

## [#1563] col listed in different order in the excel xml breaks props load

- **GitHub URL:** [PR #1563 on GitHub](https://github.com/exceljs/exceljs/pull/1563)
- **Author:** [@teodormarianmck](https://github.com/teodormarianmck) (Teodor Marian)
- **Labels:** *None*
- **Created At:** 2020-12-15T13:29:12Z
- **Updated At:** 2021-11-18T00:53:18Z
- **Local Detail File:** [pr-1563.md](./pr-1563.md)

### Description

## Summary

Sometimes xlsx generated from 3rd party libraries (360EntSecGroup-Skylar/excelize or jxls-poi) has the <col> tag in a different order vs the min/max on them.
```
  <cols>
    <col min="4" max="4" customWidth="true" style="164" width="12.6640625" collapsed="true"/>
    <col min="1" max="1" customWidth="true" width="73.6640625" collapsed="false"/>
    <col min="2" max="2" customWidth="true" hidden="true" width="3.5" collapsed="false"/>
    <col min="3" max="3" customWidth="true" style="164" width="12.6640625" collapsed="false"/>
```

This causes the properties to be lost (not with, hidden .. etc)

## Test plan

Wrote unit test.

---

## [#1531] docs: fix default options for streaming xlsx reader

- **GitHub URL:** [PR #1531 on GitHub](https://github.com/exceljs/exceljs/pull/1531)
- **Author:** [@yocontra](https://github.com/yocontra) (Eric Schoffstall)
- **Labels:** *None*
- **Created At:** 2020-11-13T17:17:54Z
- **Updated At:** 2021-11-18T00:51:40Z
- **Local Detail File:** [pr-1531.md](./pr-1531.md)

### Description

## Summary

The docs do not match the implementation or the type information: https://github.com/exceljs/exceljs/blob/4e38ad8ed2a18b6fe3999528cd30bf8b6579c249/index.d.ts#L1958

Closes https://github.com/exceljs/exceljs/issues/1430


## Semi-related

- I think it would improve the docs to identify what "styles" means to the user - it isn't clear that type information (dates, for example) are a style and without `styles: 'cache'` all dates are unusable.
- The default values for these options seem like a bit of a footgun, maybe worth revisiting why these are the defaults?

---

## [#1516] Corretly serialize and deserialize multiple print areas on one worksh…

- **GitHub URL:** [PR #1516 on GitHub](https://github.com/exceljs/exceljs/pull/1516)
- **Author:** [@peterkooijmans](https://github.com/peterkooijmans) (Peter Kooijmans)
- **Labels:** *None*
- **Created At:** 2020-10-27T15:29:05Z
- **Updated At:** 2020-11-09T12:03:27Z
- **Local Detail File:** [pr-1516.md](./pr-1516.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

This pull request fixes  #1515 

<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->

## Test plan

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->
I followed the step described in #1515 and with the changes from this pull request the problem is solved. I used [this](https://github.com/exceljs/exceljs/files/5446302/wb-issue-1515-.xlsx) to test it. I didn't add a test in code because the actual problem seems to be in the XML emitted that goes into the XLSX file.

---

## [#1457] browser: add streaming xlsx reader for blob

- **GitHub URL:** [PR #1457 on GitHub](https://github.com/exceljs/exceljs/pull/1457)
- **Author:** [@myfreeer](https://github.com/myfreeer)
- **Labels:** *None*
- **Created At:** 2020-09-12T04:05:28Z
- **Updated At:** 2023-08-26T03:04:16Z
- **Local Detail File:** [pr-1457.md](./pr-1457.md)

### Description

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

When reading large xlsx from file, this could use less memory compared to reading the whole file into memory and extract it into memory. Since `Blob` is seekable, we can read it by part and adapt to streaming reader.

workbook-reader-blob.js: the blob xlsx reader
abstract-workbook-reader.js: extracted common part of `workbook-reader.js` and `workbook-reader-blob.js`
blob-zip-stream.js: zip blob to stream reader modified from <https://github.com/antelle/node-stream-zip> (MIT Licensed in package.json)

## Test plan

A simple test is included in `spec/browser/exceljs.spec.js`.

A profiling is done with `spec/integration/data/huge.xlsx` as input file with results below:

### Workbook.xlsx.load
[Profile-load-20211120T104152.zip](https://github.com/exceljs/exceljs/files/7573798/Profile-load-20211120T104152.zip)
![load](https://user-images.githubusercontent.com/17702502/142711964-ebc402d3-1f72-4cc2-b8d2-688f67bbc66d.PNG)
```html
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>demo</title>
    <script src="exceljs.js"></script>
</head>
<input type="file" id="file-input">
<button type="button" id="read-btn">Read</button>
<p id="status"></p>
<script>

    document.getElementById('read-btn').onclick = () => {
      let file = document.getElementById('file-input').files[0];
      if (!file) return;
      let startTs = performance.now();

      const fr = new FileReader();
      fr.onload = () => {
        const wb = new ExcelJS.Workbook();
        wb.xlsx.load(fr.result).then(() => {
            let r = 0, c = 0;
            for (let worksheet of wb.worksheets) {
                console.log(worksheet.name);
                worksheet.eachRow(row => {
                    r++;
                    c += row.cellCount;
                });
            }
            console.log(r, c, performance.now() - startTs);
            document.getElementById('status').innerText =
                    `ok, rows=${r}, cells=${c}, time=${ performance.now() - startTs}`;
        });
      };
      fr.readAsArrayBuffer(file);
    };
</script>
</html>
```

### WorkbookReader
[Profile-stream-20211120T104141.zip](https://github.com/exceljs/exceljs/files/7573799/Profile-stream-20211120T104141.zip)
![stream](https://user-images.githubusercontent.com/17702502/142711968-f41a4ff5-01f0-40c9-bdac-2c44b8fd2428.PNG)


```html
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>demo</title>
    <script src="exceljs.js"></script>
</head>
<input type="file" id="file-input">
<button type="button" id="read-btn">Read</button>
<p id="status"></p>
<script>

    document.getElementById('read-btn').onclick = async () => {
      let file = document.getElementById('file-input').files[0];
      if (!file) return;
      let startTs = performance.now(), r = 0, c = 0;
      const workbookReader = new ExcelJS.stream.xlsx.WorkbookReader(file);
      for await (const worksheetReader of workbookReader) {
        console.log(worksheetReader.name);
        for await (const row of worksheetReader) {
          // ...
          r++;
          c += row.cellCount;
        }
      }
      console.log(r, c, performance.now() - startTs);
      document.getElementById('status').innerText =
              `ok, rows=${r}, cells=${c}, time=${ performance.now() - startTs}`;
    };
</script>
</html>
```

---

## [#1448] Add addImage method validation

- **GitHub URL:** [PR #1448 on GitHub](https://github.com/exceljs/exceljs/pull/1448)
- **Author:** [@Yangeok](https://github.com/Yangeok) (Yangwook Ian Jeong)
- **Labels:** *None*
- **Created At:** 2020-09-08T02:22:41Z
- **Updated At:** 2021-11-18T00:50:23Z
- **Local Detail File:** [pr-1448.md](./pr-1448.md)

### Description

**addImage** does not contain validation, so I added it.

<!-- Thanks for submitting a pull request! Please provide enough information so that others can review your pull request. The two fields below are mandatory. -->

## Summary

<!-- Explain the **motivation** for making this change. What existing problem does the pull request solve? -->

## Test plan

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->

---

## [#1383] [F] #1363 - Add support for excluding AutoFilter columns

- **GitHub URL:** [PR #1383 on GitHub](https://github.com/exceljs/exceljs/pull/1383)
- **Author:** [@remzh](https://github.com/remzh) (Rem Zhang)
- **Labels:** *None*
- **Created At:** 2020-07-09T22:14:12Z
- **Updated At:** 2025-11-16T14:01:49Z
- **Local Detail File:** [pr-1383.md](./pr-1383.md)

### Description

## Summary

I brought this up in #1363 several days back. Basically, Excel allows you to exclude specific columns from showing the AutoFilter button when setting an AutoFilter range, which is extremely helpful when you want a field to span more than one column and/or with merged cells. This would implement support for that in ExcelJS. 

## Test plan

<!-- Demonstrate the code is solid. Example: The exact commands you ran and their output, screenshots / videos if the pull request changes UI. -->
This implementation is intended to be as minimally invasive and non-destructive as possible - it merely adds on a property, `exclude`, that can be (optionally) passed onto the `autoFilter` property. The readme has also been updated with an example of this. 

If the user opts not to use said `exclude` property, then autoFilter will behave exactly the same way as before. 

Example: 
```javascript
const sheet = workbook.addWorksheet('My Sheet');

sheet.autoFilter = {
    from: 'A1', 
    to: 'E1', 
    exclude: [1, 2] // excludes columns B and C from showing the AutoFilter button
}
```

---

## [#1378] fix issue #791 - modify a cell style on existing excel file may affec…

- **GitHub URL:** [PR #1378 on GitHub](https://github.com/exceljs/exceljs/pull/1378)
- **Author:** [@DantSu](https://github.com/DantSu) (Franck Alary)
- **Labels:** *None*
- **Created At:** 2020-07-08T07:34:49Z
- **Updated At:** 2020-10-11T01:10:07Z
- **Local Detail File:** [pr-1378.md](./pr-1378.md)

### Description

## Summary

Steps : 
- create a file
- open it with MS excel
- select cells A1 to C5 (It's an example)
- assign a style
- close the file
- open it with exceljs
- run `ws.getCell('B2').font = {...cell.font, color: {argb: 'FF3366FF'}}`
- style of A1 to C5 will be changed

see issue #791 for more informations


### Actual workaround

```javascript
const cell = ws.getCell('B2')
cell.style = {
   ...cell.style,
   font: {...cell.font, color: {argb: 'FF3366FF'}}
}
```

## Update

Added setStyle method to Cell class : 

```javascript
setStyle(style) {
  this.style = {...this.style, ...style}
}
```
## Examples : 

### Example 1 : 

```javascript
const cell = ws.getCell('B2')
cell.style = {
   ...cell.style,
   font: {...cell.font, color: {argb: 'FF3366FF'}}
}
```

become : 

```javascript
const cell = ws.getCell('B2')
cell.setStyle({font: {...cell.font, color: {argb: 'FF3366FF'}}})
```

### Example 2 : 

```javascript
const cell = ws.getCell('B2')
cell.style = {
  ...cell.style,
  fill: {
    type: 'pattern',
    pattern: 'solid',
    fgColor: {argb: 'FFD8D8D8'}
  }
}
```

become : 

```javascript
ws.getCell('B2').setStyle({
  fill: {
    type: 'pattern',
    pattern: 'solid',
    fgColor: {argb: 'FFD8D8D8'}
  }
})
```

---

## [#1345] Improved table handling

- **GitHub URL:** [PR #1345 on GitHub](https://github.com/exceljs/exceljs/pull/1345)
- **Author:** [@delcon](https://github.com/delcon) (delcon)
- **Labels:** *None*
- **Created At:** 2020-06-19T10:27:11Z
- **Updated At:** 2021-02-12T02:30:48Z
- **Local Detail File:** [pr-1345.md](./pr-1345.md)

### Description

## Summary

I found several issues in data-table handling in worksheets regarding existing tables:
- loading existing Tables from workbook errors and alters table
- hidden header rows in Tables corrupt file on save
- totals row toggles on file save -> corrupt file on save

in addition to that I missed following features:
- define / create a table over existing data in Worksheet
- delete a table in Worksheets
  
## Updates

- fixed all errors reading existing Tables
- added ability to define Table over existing Data
- added Documentation for deleting a Table (function existed)
- added Documentation for defining a Table

## Test plan
I added a test to create a table, save it, read it back and comparing them to some extend
However, valid tests would also include reading generated Table in Excel and visually comparing them and creating Tables in Excel and reading them with the library

## Other thoughts
- I am not sure if current table data handling (duplicating worksheet data) is useful
- I am not sure if current requirement to commit table data changes is necessary useful

let me know what you think

---

## [#1061] Add ability to set fill style for a range 

- **GitHub URL:** [PR #1061 on GitHub](https://github.com/exceljs/exceljs/pull/1061)
- **Author:** [@iabukai](https://github.com/iabukai)
- **Labels:** *None*
- **Created At:** 2019-12-22T19:48:07Z
- **Updated At:** 2021-03-09T20:02:36Z
- **Local Detail File:** [pr-1061.md](./pr-1061.md)

### Description

*No description provided.*

---
