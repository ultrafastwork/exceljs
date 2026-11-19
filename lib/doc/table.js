/* eslint-disable max-classes-per-file */
const colCache = require('../utils/col-cache');

const TABLE_NAME_REGEX = /^[a-zA-Z_\\][a-zA-Z0-9._]*$/;
const CELL_REF_REGEX = /^([a-zA-Z]{1,3})([1-9][0-9]*)$/;
const R1C1_REF_REGEX = /^[rR]\d*[cC]\d*$/;
const MAX_TABLE_NAME_LENGTH = 255;
const MAX_EXCEL_COL = 16384; // XFD
const MAX_EXCEL_ROW = 1048576;

function colLettersToNumber(letters) {
  let col = 0;
  const upper = letters.toUpperCase();
  for (let i = 0; i < upper.length; i++) {
    col = col * 26 + (upper.charCodeAt(i) - 64);
  }
  return col;
}

function isValidTableName(name) {
  if (typeof name !== 'string' || name.length === 0 || name.length > MAX_TABLE_NAME_LENGTH) {
    return false;
  }
  if (!TABLE_NAME_REGEX.test(name)) {
    return false;
  }
  if (name === 'C' || name === 'c' || name === 'R' || name === 'r') {
    return false;
  }
  if (R1C1_REF_REGEX.test(name)) {
    return false;
  }
  const cellMatch = CELL_REF_REGEX.exec(name);
  if (cellMatch) {
    const col = colLettersToNumber(cellMatch[1]);
    const row = parseInt(cellMatch[2], 10);
    if (col <= MAX_EXCEL_COL && row <= MAX_EXCEL_ROW) {
      return false;
    }
  }
  return true;
}

class Column {
  // wrapper around column model, allowing access and manipulation
  constructor(table, column, index) {
    this.table = table;
    this.column = column;
    this.index = index;
  }

  _set(name, value) {
    this.table.cacheState();
    this.column[name] = value;
  }

  /* eslint-disable lines-between-class-members */
  get name() {
    return this.column.name;
  }
  set name(value) {
    this._set('name', value);
  }

  get filterButton() {
    return this.column.filterButton;
  }
  set filterButton(value) {
    this.column.filterButton = value;
  }

  get style() {
    return this.column.style;
  }
  set style(value) {
    this.column.style = value;
  }

  get totalsRowLabel() {
    return this.column.totalsRowLabel;
  }
  set totalsRowLabel(value) {
    this._set('totalsRowLabel', value);
  }

  get totalsRowFunction() {
    return this.column.totalsRowFunction;
  }
  set totalsRowFunction(value) {
    this._set('totalsRowFunction', value);
  }

  get totalsRowResult() {
    return this.column.totalsRowResult;
  }
  set totalsRowResult(value) {
    this._set('totalsRowResult', value);
  }

  get totalsRowFormula() {
    return this.column.totalsRowFormula;
  }
  set totalsRowFormula(value) {
    this._set('totalsRowFormula', value);
  }
  /* eslint-enable lines-between-class-members */
}

class Table {
  constructor(worksheet, table) {
    this.worksheet = worksheet;
    this.isCommiting = false;
    if (table) {
      this.table = table;
      if (
        (table.tableRef && !table.ref) ||
        ((!table.rows || table.rows.length === 0) && table.tableRef)
      ) {
        this.load(this.worksheet);
      }
      // check things are ok first
      this.validate();

      this.store();
    }
  }

  getFormula(column) {
    // get the correct formula to apply to the totals row
    switch (column.totalsRowFunction) {
      case 'none':
        return null;
      case 'average':
        return `SUBTOTAL(101,${this.table.name}[${column.name}])`;
      case 'countNums':
        return `SUBTOTAL(102,${this.table.name}[${column.name}])`;
      case 'count':
        return `SUBTOTAL(103,${this.table.name}[${column.name}])`;
      case 'max':
        return `SUBTOTAL(104,${this.table.name}[${column.name}])`;
      case 'min':
        return `SUBTOTAL(105,${this.table.name}[${column.name}])`;
      case 'stdDev':
        return `SUBTOTAL(106,${this.table.name}[${column.name}])`;
      case 'var':
        return `SUBTOTAL(107,${this.table.name}[${column.name}])`;
      case 'sum':
        return `SUBTOTAL(109,${this.table.name}[${column.name}])`;
      case 'custom':
        return column.totalsRowFormula;
      default:
        throw new Error(`Invalid Totals Row Function: ${column.totalsRowFunction}`);
    }
  }

  get width() {
    // width of the table
    return this.table.columns.length;
  }

  get height() {
    // height of the table data
    return this.table.rows.length + this.rowsCommitted;
  }

  get filterHeight() {
    // height of the table data plus optional header row
    return this.height + (this.table.headerRow ? 1 : 0);
  }

  get tableHeight() {
    // full height of the table on the sheet
    return this.filterHeight + (this.table.totalsRow ? 1 : 0);
  }

  getTableRange(body = true) {
    const [, startColumnStr, startRowStr, endColumnStr, endRowStr] = /(\D+)(\d+):(\D+)(\d+)/i.exec(
      this.table.tableRef,
    );
    const startColumn = colCache.l2n(startColumnStr);
    const endColumn = colCache.l2n(endColumnStr);
    let startRow = parseInt(startRowStr, 10);
    startRow = body && this.table.headerRow ? startRow + 1 : startRow;
    let endRow = parseInt(endRowStr, 10);
    endRow = body && this.table.totalsRow ? endRow - 1 : endRow;
    return {
      startRow,
      startColumn,
      endRow,
      endColumn,
    };
  }

  destroy() {
    // delete all cells covered by table
    const {startRow, startColumn, endRow, endColumn} = this.getTableRange(false);
    for (let i = startRow; i <= endRow; i++) {
      this.worksheet.getRow(i).eachCell((cell, colNumber) => {
        if (colNumber >= startColumn && colNumber <= endColumn) {
          cell.value = null;
        }
      });
    }
  }

  validate() {
    const {table} = this;
    // set defaults and check is valid
    const assign = (o, name, dflt) => {
      if (o[name] === undefined) {
        o[name] = dflt;
      }
    };
    assign(table, 'headerRow', true);
    assign(table, 'totalsRow', false);

    assign(table, 'style', {});
    assign(table.style, 'theme', 'TableStyleMedium2');
    assign(table.style, 'showFirstColumn', false);
    assign(table.style, 'showLastColumn', false);
    assign(table.style, 'showRowStripes', false);
    assign(table.style, 'showColumnStripes', false);
    assign(table, 'rowsCommitted', 0);

    assign(table, 'isCommiting', false);

    const assert = (test, message) => {
      if (!test) {
        throw new Error(message);
      }
    };
    assert(table.name, 'Table must have a name');
    assert(isValidTableName(table.name), `Invalid table name: ${table.name}`);
    assert(table.ref, 'Table must have ref');
    assert(table.columns, 'Table must have column definitions');
    assert(
      Array.isArray(table.rows) && table.rows.length + this.rowsCommitted > 0,
      'Table must have row definitions',
    );

    table.tl = colCache.decodeAddress(table.ref);
    const {row, col} = table.tl;
    assert(row > 0, 'Table must be on valid row');
    assert(col > 0, 'Table must be on valid col');

    const {width, tableHeight} = this;

    // autoFilterRef should be just the header row for Excel tables
    if (table.headerRow) {
      table.autoFilterRef = colCache.encode(row, col, row, col + width - 1);
    } else {
      table.autoFilterRef = undefined;
    }

    // tableRef is a range that includes optional headers and totals
    table.tableRef = colCache.encode(row, col, row + tableHeight - 1, col + width - 1);

    const colUniqueNames = [];
    let count = 0;
    table.columns.forEach((column, i) => {
      assert(column.name, `Column ${i} must have a name`);
      while (colUniqueNames.includes(column.name)) {
        column.name = `Column ${count}`;
        count++;
      }
      colUniqueNames.push(column.name);

      assign(column, 'filterButton', true);
      if (i === 0) {
        assign(column, 'totalsRowLabel', 'Total');
      } else {
        assign(column, 'totalsRowFunction', 'none');
        column.totalsRowFormula = this.getFormula(column);
        if (column.totalsRowLabel) {
          delete column.totalsRowLabel;
        }
      }
    });
  }

  store() {
    // where the table needs to store table data, headers, footers in
    // the sheet...
    const assignStyle = (cell, style) => {
      if (style) {
        Object.keys(style).forEach(key => {
          cell.style[key] = style[key];
        });
      }
    };

    const {worksheet, table} = this;
    const {row, col} = table.tl;
    let count = this.rowsCommitted;
    if (table.headerRow) {
      if (this.rowsCommitted === 0) {
        const r = worksheet.getRow(row + count++);
        table.columns.forEach((column, j) => {
          const {style, name} = column;
          const cell = r.getCell(col + j);
          cell.value = name;
          assignStyle(cell, style);
        });
      } else {
        // rows committed doesn't include the header row
        count++;
      }
    }
    const rows = table.rows.map(data => {
      const r = worksheet.getRow(row + count++);
      data.forEach((value, j) => {
        const cell = r.getCell(col + j);
        cell.value = value;

        assignStyle(cell, table.columns[j].style);
      });
      this.table.rowsCommitted++;
      return r;
    });
    if (this.rowsCommitted > 0 && rows.length > 0) {
      // this will commit all earlier rows as well
      rows[rows.length - 1].commit();
      table.rows = [];
    }

    if (table.totalsRow) {
      const r = worksheet.getRow(row + count++);
      table.columns.forEach((column, j) => {
        const cell = r.getCell(col + j);
        if (j === 0) {
          cell.value = column.totalsRowLabel;
        } else {
          const formula = this.getFormula(column);
          if (formula) {
            cell.value = {
              formula: column.totalsRowFormula,
              result: column.totalsRowResult,
            };
          } else {
            cell.value = null;
          }
        }

        assignStyle(cell, column.style);
      });
    }
  }

  load(worksheet = this.worksheet) {
    // where the table will read necessary features from a loaded sheet
    const {table} = this;
    if (table.tableRef && !table.ref) {
      table.ref = table.tableRef;
    }
    if (table.headerRow === undefined) {
      table.headerRow = true;
    }
    if (table.totalsRow === undefined) {
      table.totalsRow = false;
    }
    if (table.ref && worksheet) {
      const range = colCache.decode(table.ref);
      table.tl = colCache.decodeAddress(table.ref);
      if (range.top !== undefined && range.bottom !== undefined) {
        const startRow = range.top + (table.headerRow ? 1 : 0);
        const endRow = range.bottom - (table.totalsRow ? 1 : 0);
        table.rows = [];
        for (let r = startRow; r <= endRow; r++) {
          const rowValues = [];
          const row = worksheet.getRow(r);
          for (let c = range.left; c <= range.right; c++) {
            rowValues.push(row.getCell(c).value);
          }
          table.rows.push(rowValues);
        }
        if (table.totalsRow && table.columns) {
          const totalsRow = worksheet.getRow(range.bottom);
          table.columns.forEach((column, index) => {
            const cellValue = totalsRow.getCell(range.left + index).value;
            if (
              cellValue &&
              typeof cellValue === 'object' &&
              cellValue.result !== undefined &&
              column.totalsRowResult === undefined
            ) {
              column.totalsRowResult = cellValue.result;
            }
          });
        }
      }
    }
  }

  get model() {
    return this.table;
  }

  set model(value) {
    this.table = value;
  }

  // ================================================================
  // TODO: Mutating methods
  cacheState() {
    if (!this._cache) {
      this._cache = {
        ref: this.ref,
        width: this.width,
        tableHeight: this.tableHeight,
      };
    }
  }

  commit() {
    // changes may have been made that might have on-sheet effects
    if (!this._cache) {
      return;
    }

    this.isCommiting = true;
    if (this.table) {
      this.table.isCommiting = true;
    }
    try {
      // check things are ok first
      this.validate();

      if (this.rowsCommitted === 0) {
        const ref = colCache.decodeAddress(this._cache.ref);
        if (this.ref !== this._cache.ref) {
          // wipe out whole table footprint at previous location
          for (let i = 0; i < this._cache.tableHeight; i++) {
            const row = this.worksheet.getRow(ref.row + i);
            for (let j = 0; j < this._cache.width; j++) {
              const cell = row.getCell(ref.col + j);
              cell.value = null;
            }
          }
        } else {
          // clear out below table if it has shrunk
          for (let i = this.tableHeight; i < this._cache.tableHeight; i++) {
            const row = this.worksheet.getRow(ref.row + i);
            for (let j = 0; j < this._cache.width; j++) {
              const cell = row.getCell(ref.col + j);
              cell.value = null;
            }
          }

          // clear out to right of table if it has lost columns
          for (let i = 0; i < this.tableHeight; i++) {
            const row = this.worksheet.getRow(ref.row + i);
            for (let j = this.width; j < this._cache.width; j++) {
              const cell = row.getCell(ref.col + j);
              cell.value = null;
            }
          }
        }
      }

      this.store();
    } finally {
      this.isCommiting = false;
      if (this.table) {
        this.table.isCommiting = false;
      }
    }
  }

  addRow(values, rowNumber) {
    // Add a row of data, either insert at rowNumber or append
    if (this.rowsCommitted > 0 && rowNumber !== undefined) {
      rowNumber -= this.rowsCommitted;
      if (rowNumber < 0) {
        throw new Error('Out of bounds: this row has been committed');
      }
    }
    this.cacheState();

    if (rowNumber === undefined) {
      this.table.rows.push(values);
    } else {
      this.table.rows.splice(rowNumber, 0, values);
    }

    if (!this.worksheet.commit) {
      // Update table reference to reflect new size and re-render entire table
      this._updateTableRef();

      // Commit changes to worksheet (this will re-render the entire table properly)
      this.commit();
    }
  }

  removeRows(rowIndex, count = 1) {
    if (rowIndex < this.rowsCommitted) {
      rowIndex -= this.rowsCommitted;
      if (rowIndex < 0) {
        throw new Error('Out of bounds: this row has been committed');
      }
    }
    // Remove a rows of data
    this.cacheState();
    this.table.rows.splice(rowIndex, count);

    if (!this.worksheet.commit) {
      // Update table reference to reflect new size
      this._updateTableRef();

      // For now, we'll use store() for removeRows as it's more complex to handle
      // TODO: Implement targeted row removal
      this.store();
    }
  }

  _updateTableRef() {
    // Update the table's ref property to reflect current table size
    if (this.table.ref && this.table.tl) {
      const {row, col} = this.table.tl;
      const {width, tableHeight} = this;

      // Update the ref to include all current data
      this.table.ref = colCache.encode(row, col, row + tableHeight - 1, col + width - 1);

      // Update autoFilterRef if table has headers (for filter buttons)
      // For Excel tables, autoFilter should just reference the header row
      if (this.table.headerRow) {
        const newAutoFilterRef = colCache.encode(row, col, row, col + width - 1);
        this.table.autoFilterRef = newAutoFilterRef;
      }
    }
  }

  _writeRowToWorksheet(values, insertIndex) {
    // Write a single row to the worksheet at the correct position
    const {row, col} = this.table.tl;
    let targetRowIndex = row;

    // Account for header row if it exists
    if (this.table.headerRow) {
      targetRowIndex += 1;
    }

    // Add the insert index to get to the right data row
    targetRowIndex += insertIndex;

    // If there's a totals row, we need to shift it down
    if (this.table.totalsRow) {
      // First, move the totals row down by clearing and rewriting it
      const totalsRowIndex = row + (this.table.headerRow ? 1 : 0) + this.table.rows.length;
      const totalsRow = this.worksheet.getRow(totalsRowIndex);

      // Clear the old totals row
      for (let j = 0; j < this.width; j++) {
        totalsRow.getCell(col + j).value = null;
      }

      // Write totals row at new position
      const newTotalsRowIndex = totalsRowIndex + 1;
      const newTotalsRow = this.worksheet.getRow(newTotalsRowIndex);
      this.table.columns.forEach((column, j) => {
        const cell = newTotalsRow.getCell(col + j);
        if (j === 0) {
          cell.value = column.totalsRowLabel || 'Total';
        } else {
          const formula = this.getFormula(column);
          if (formula) {
            cell.value = {formula};
          }
        }
      });
    }

    // Write the new data row
    const worksheetRow = this.worksheet.getRow(targetRowIndex);
    values.forEach((value, j) => {
      const cell = worksheetRow.getCell(col + j);
      cell.value = value;
      // Apply column style if it exists
      if (this.table.columns[j] && this.table.columns[j].style) {
        Object.keys(this.table.columns[j].style).forEach(key => {
          cell.style[key] = this.table.columns[j].style[key];
        });
      }
    });
  }

  getColumn(colIndex) {
    const column = this.table.columns[colIndex];
    return new Column(this, column, colIndex);
  }

  addColumn(column, values, colIndex) {
    if (this.rowsCommitted > 0) {
      throw new Error('Out of bounds: columns cannot be modified after rows have been committed');
    }
    // Add a new column, including column defn and values
    // Inserts at colNumber or adds to the right
    this.cacheState();

    if (colIndex === undefined) {
      this.table.columns.push(column);
      this.table.rows.forEach((row, i) => {
        row.push(values[i]);
      });
    } else {
      this.table.columns.splice(colIndex, 0, column);
      this.table.rows.forEach((row, i) => {
        row.splice(colIndex, 0, values[i]);
      });
    }
  }

  removeColumns(colIndex, count = 1) {
    if (this.rowsCommitted > 0) {
      throw new Error('Out of bounds: columns cannot be modified after rows have been committed');
    }
    // Remove a column with data
    this.cacheState();

    this.table.columns.splice(colIndex, count);
    this.table.rows.forEach(row => {
      row.splice(colIndex, count);
    });
  }

  _assign(target, prop, value) {
    this.cacheState();
    target[prop] = value;
  }

  /* eslint-disable lines-between-class-members */
  get ref() {
    return this.table.ref;
  }
  set ref(value) {
    if (this.rowsCommitted > 0) {
      throw new Error('Out of bounds: this row has been committed');
    }
    this._assign(this.table, 'ref', value);
  }

  get name() {
    return this.table.name;
  }
  set name(value) {
    this.table.name = value;
  }

  get displayName() {
    return this.table.displyName || this.table.name;
  }
  set displayNamename(value) {
    this.table.displayName = value;
  }

  get headerRow() {
    return this.table.headerRow;
  }
  set headerRow(value) {
    if (this.rowsCommitted > 0) {
      throw new Error('Out of bounds: this row has been committed');
    }
    this._assign(this.table, 'headerRow', value);
  }

  get totalsRow() {
    return this.table.totalsRow;
  }
  set totalsRow(value) {
    this._assign(this.table, 'totalsRow', value);
  }

  get theme() {
    return this.table.style.name;
  }
  set theme(value) {
    this.table.style.name = value;
  }

  get showFirstColumn() {
    return this.table.style.showFirstColumn;
  }
  set showFirstColumn(value) {
    this.table.style.showFirstColumn = value;
  }

  get showLastColumn() {
    return this.table.style.showLastColumn;
  }
  set showLastColumn(value) {
    this.table.style.showLastColumn = value;
  }

  get showRowStripes() {
    return this.table.style.showRowStripes;
  }
  set showRowStripes(value) {
    this.table.style.showRowStripes = value;
  }

  get showColumnStripes() {
    return this.table.style.showColumnStripes;
  }
  set showColumnStripes(value) {
    this.table.style.showColumnStripes = value;
  }

  get autoFilterRef() {
    return this.table.autoFilterRef;
  }
  set autoFilterRef(value) {
    this._assign(this.table, 'autoFilterRef', value);
  }

  get rowsCommitted() {
    return this.worksheet && this.worksheet.commit ? this.table.rowsCommitted : 0;
  }
  /* eslint-enable lines-between-class-members */
}

module.exports = Table;
