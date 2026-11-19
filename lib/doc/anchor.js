import colCache from '../utils/col-cache.js';

class Anchor {
  constructor(worksheet, address, offset = 0) {
    this.worksheet = worksheet;

    if (!address) {
      this.nativeCol = 0;
      this.nativeColOff = 0;
      this.nativeRow = 0;
      this.nativeRowOff = 0;
    } else if (typeof address === 'string') {
      const decoded = colCache.decodeAddress(address);
      this.nativeCol = decoded.col + offset;
      this.nativeColOff = 0;
      this.nativeRow = decoded.row + offset;
      this.nativeRowOff = 0;
    } else if (address.nativeCol !== undefined) {
      this.nativeCol = address.nativeCol || 0;
      this.nativeColOff = address.nativeColOff || 0;
      this.nativeRow = address.nativeRow || 0;
      this.nativeRowOff = address.nativeRowOff || 0;
    } else if (address.col !== undefined) {
      this.col = address.col + offset;
      this.row = address.row + offset;
    } else {
      this.nativeCol = 0;
      this.nativeColOff = 0;
      this.nativeRow = 0;
      this.nativeRowOff = 0;
    }
  }

  static asInstance(model) {
    return model instanceof Anchor || model == null ? model : new Anchor(model);
  }

  get col() {
    return this.nativeCol + Math.min(this.colWidth - 1, this.nativeColOff) / this.colWidth;
  }

  set col(v) {
    this.nativeCol = Math.floor(v);
    this.nativeColOff = Math.floor((v - this.nativeCol) * this.colWidth);
  }

  get row() {
    return this.nativeRow + Math.min(this.rowHeight - 1, this.nativeRowOff) / this.rowHeight;
  }

  set row(v) {
    this.nativeRow = Math.floor(v);
    this.nativeRowOff = Math.floor((v - this.nativeRow) * this.rowHeight);
  }

  get colWidth() {
    const defaultColWidth =
      this.worksheet && this.worksheet.properties && this.worksheet.properties.defaultColWidth
        ? this.worksheet.properties.defaultColWidth
        : 8.43;
    let col;
    try {
      col =
        this.worksheet &&
        (this.worksheet.findColumn
          ? this.worksheet.findColumn(this.nativeCol + 1)
          : this.worksheet.getColumn(this.nativeCol + 1));
    } catch (_) {
      col = undefined;
    }
    const customColWidth = col && col.width ? col.width : undefined;
    const width = customColWidth || defaultColWidth;
    return Math.floor(width * (640000 / 8.43));
  }

  get rowHeight() {
    const defaultRowHeight =
      this.worksheet && this.worksheet.properties && this.worksheet.properties.defaultRowHeight
        ? this.worksheet.properties.defaultRowHeight
        : 15;
    let row;
    try {
      row =
        this.worksheet &&
        (this.worksheet.findRow
          ? this.worksheet.findRow(this.nativeRow + 1)
          : this.worksheet.getRow(this.nativeRow + 1));
    } catch (_) {
      row = undefined;
    }
    const customRowHeight = row && row.height ? row.height : undefined;
    const height = customRowHeight || defaultRowHeight;
    return Math.floor(height * (180000 / 15));
  }

  get model() {
    return {
      nativeCol: this.nativeCol,
      nativeColOff: this.nativeColOff,
      nativeRow: this.nativeRow,
      nativeRowOff: this.nativeRowOff,
    };
  }

  set model(value) {
    this.nativeCol = value.nativeCol;
    this.nativeColOff = value.nativeColOff;
    this.nativeRow = value.nativeRow;
    this.nativeRowOff = value.nativeRowOff;
  }
}

export default Anchor;
