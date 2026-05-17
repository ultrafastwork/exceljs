# Performance Audit & Memory Analysis: Worksheet Operations

This document presents a comprehensive performance and memory audit of the worksheet and row operations in `lib/doc/worksheet.js` and `lib/doc/row.js`. 

---

## 1. Key Performance Bottlenecks & O(N) Loop Analysis

### A. Column Splicing Memory Leak (`spliceColumns`)
* **Location:** `lib/doc/worksheet.js` (inside `spliceColumns` when `inserts.length > 0`)
* **Current Implementation:**
  ```javascript
  if (inserts.length > 0) {
    for (let i = 0; i < nRows; i++) {
      ...
      const row = this.getRow(i + 1);
      ...
    }
  }
  ```
* **The Problem:** 
  In Excel, worksheets are often highly **sparse** (e.g., only row 1 and row 100,000 have data). `this._rows` tracks this using a sparse JS array. However, `spliceColumns` iterates from `0` to `nRows` (100,000) and calls `this.getRow(i + 1)` which **physically instantiates** an empty `Row` object (along with its internal cells, style maps, etc.) for all 99,998 empty rows in between.
  This transforms a highly memory-efficient sparse sheet into a dense memory-heavy representation, leading to severe memory spikes and eventual `Out Of Memory` (OOM) crashes on large files.
* **Proposed Optimization (O(1) Sparse Retention):**
  Only call `getRow(i + 1)` if:
  1. The row already exists (`this._rows[i] !== undefined`), OR
  2. One of the incoming column `inserts` actually contains a non-null, non-undefined cell value at index `i` (i.e., `inserts.some(insert => insert[i] !== undefined && insert[i] !== null)`).
  Otherwise, we skip row instantiation since inserting empty column values into a non-existent row maintains its empty state.

---

### B. Row Splicing/Insertion Bottleneck (`spliceRows`)
* **Location:** `lib/doc/worksheet.js` (inside `spliceRows`)
* **Current Implementation:**
  When inserting rows (`nExpand > 0`), the rows following the insertion point are shifted by looping backwards:
  ```javascript
  for (i = nEnd; i >= nKeep; i--) {
    rSrc = this._rows[i - 1];
    if (rSrc) {
      const rDst = this.getRow(i + nExpand);
      rDst.values = rSrc.values;
      rDst.style = rSrc.style;
      rDst.height = rSrc.height;
      rSrc.eachCell({includeEmpty: true}, (cell, colNumber) => {
        rDst.getCell(colNumber).style = cell.style;
        ...
      });
    }
  }
  ```
* **The Problem (Quadratic O(R * C) Shift):**
  Instead of shifting array references, the code **deep copies** cell values and styles row-by-row, cell-by-cell.
  - `rDst.values = rSrc.values` calls the `values` setter in `Row`, which parses, allocates, and sets cell instances.
  - `rSrc.eachCell` then iterates over the source cells and calls `rDst.getCell(colNumber)` which instantiates empty cell containers and merges style options.
  - This has `O(R * C)` time complexity (where R is shifted rows and C is average cells per row) and allocates millions of temporary cell objects, leading to major garbage collection pressure.
* **Proposed Optimization (O(R) Reference Shifting):**
  Instead of deep copying cell by cell, we can shift the `Row` object references directly inside the sparse `this._rows` array (i.e. `this._rows[i + nExpand - 1] = this._rows[i - 1]`). We then perform a quick O(1) pass to update:
  1. The row's internal `_number = i + nExpand`.
  2. The shifted cell addresses (updating `cell._address` and any internal value/style references).
  This avoids thousands of `getCellEx` lookups and millions of cell allocations.

---

### C. Linear Backward Scanning for `rowCount` (`_lastRowNumber`)
* **Location:** `lib/doc/worksheet.js` (inside `_lastRowNumber`)
* **Current Implementation:**
  ```javascript
  get _lastRowNumber() {
    const rows = this._rows;
    let n = rows.length;
    while (n > 0 && rows[n - 1] === undefined) {
      n--;
    }
    return n;
  }
  ```
* **The Problem:**
  If a sheet is sparse or has deleted rows at the end, `rows.length` can be very large while `n` is small. Calling `_lastRowNumber` triggers a backward linear scan through millions of empty indices.
* **Proposed Optimization (O(1) Tracked Maximum):**
  Maintain a tracked property `this._maxRowNumber` which is updated in O(1) whenever:
  - A row is added or set (using `getRow` or `addRow`).
  - Rows are spliced/deleted.
  This allows `_lastRowNumber` and `rowCount` to return instantly in O(1) time without scanning.

---

## 2. Memory Usage Patterns in Large Worksheets

### A. Object Allocation Overhead
In standard JavaScript (V8), every object instance has a substantial memory footprint (often 40-80 bytes per object). In a sheet with 100,000 rows and 50 columns:
* **Total cells:** 5,000,000 cells.
* **Total objects:** 5,000,000 `Cell` objects + 5,000,000 `Value` (or wrapper) objects + style objects.
* This easily exceeds **1.5 GB of V8 Heap Memory** just for the core tree structure, leaving very little room for Excel generation and zip compression, leading to OOM crashes.

### B. Streaming APIs (Best Practice)
For ultra-large worksheets, developers must prioritize the **Streaming APIs** (`WorkbookWriter` and `WorkbookReader`):
* **Streaming Writer (`WorkbookWriter`):** Serializes rows to files as soon as they are complete via `row.commit()`, which immediately breaks cyclic references and allows garbage collection of processed rows, keeping memory usage constant `O(1)`.
* **Streaming Reader (`WorkbookReader`):** Consumes SAX events from unzip streams directly without storing the full worksheet model in memory.

---

## 3. Transition to the Next Pull Request

With the performance audit successfully completed, we are fully prepared to transition to the next milestone in our roadmap:

### **PR #2924: Fix Anchor Column and Row Positioning**
* **Goal:** Fix image/object positioning issues when custom column widths or row heights are set in Excel.
* **Scope:** 
  - Refactor scaling and calculations in the `Anchor` class (`lib/doc/anchor.js`) to use precise default scaling factors:
    * `8.43` default width = `640000` EMUs
    * `15` default height = `180000` EMUs
  - Simplify test assertions for image positioning (`spec/integration/workbook-xlsx-reader.spec.js` and `spec/unit/doc/anchor.spec.js`).
  - Introduce new integration tests verifying correct positioning with custom column widths (`spec/integration/workbook/images.spec.js`).
