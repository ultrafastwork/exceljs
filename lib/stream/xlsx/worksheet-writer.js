import {v4 as uuidv4} from '../../utils/uuid.js';
import _ from '../../utils/under-dash.js';
import RelType from '../../xlsx/rel-type.js';
import colCache from '../../utils/col-cache.js';
import Encryptor from '../../utils/encryptor.js';
import Dimensions from '../../doc/range.js';
import StringBuf from '../../utils/string-buf.js';
import Row from '../../doc/row.js';
import Column from '../../doc/column.js';
import Table from '../../doc/table.js';
import SheetRelsWriter from './sheet-rels-writer.js';
import SheetCommentsWriter from './sheet-comments-writer.js';
import DataValidations from '../../doc/data-validations.js';
import ListXform from '../../xlsx/xform/list-xform.js';
import DataValidationsXform from '../../xlsx/xform/sheet/data-validations-xform.js';
import SheetPropertiesXform from '../../xlsx/xform/sheet/sheet-properties-xform.js';
import SheetFormatPropertiesXform from '../../xlsx/xform/sheet/sheet-format-properties-xform.js';
import ColXform from '../../xlsx/xform/sheet/col-xform.js';
import RowXform from '../../xlsx/xform/sheet/row-xform.js';
import HyperlinkXform from '../../xlsx/xform/sheet/hyperlink-xform.js';
import SheetViewXform from '../../xlsx/xform/sheet/sheet-view-xform.js';
import SheetProtectionXform from '../../xlsx/xform/sheet/sheet-protection-xform.js';
import PageMarginsXform from '../../xlsx/xform/sheet/page-margins-xform.js';
import PageSetupXform from '../../xlsx/xform/sheet/page-setup-xform.js';
import AutoFilterXform from '../../xlsx/xform/sheet/auto-filter-xform.js';
import PictureXform from '../../xlsx/xform/sheet/picture-xform.js';
import ConditionalFormattingsXform from '../../xlsx/xform/sheet/cf/conditional-formattings-xform.js';
import HeaderFooterXform from '../../xlsx/xform/sheet/header-footer-xform.js';
import RowBreaksXform from '../../xlsx/xform/sheet/row-breaks-xform.js';
import DrawingXform from '../../xlsx/xform/sheet/drawing-xform.js';
import TableXform from '../../xlsx/xform/table/table-xform.js';
import Image from '../../doc/image.js';

const xmlBuffer = new StringBuf();

// ============================================================================================
// Xforms

// since prepare and render are functional, we can use singletons
const xform = {
  dataValidations: new DataValidationsXform(),
  sheetProperties: new SheetPropertiesXform(),
  sheetFormatProperties: new SheetFormatPropertiesXform(),
  columns: new ListXform({tag: 'cols', length: false, childXform: new ColXform()}),
  row: new RowXform(),
  hyperlinks: new ListXform({tag: 'hyperlinks', length: false, childXform: new HyperlinkXform()}),
  sheetViews: new ListXform({tag: 'sheetViews', length: false, childXform: new SheetViewXform()}),
  sheetProtection: new SheetProtectionXform(),
  pageMargins: new PageMarginsXform(),
  pageSeteup: new PageSetupXform(),
  autoFilter: new AutoFilterXform(),
  picture: new PictureXform(),
  drawing: new DrawingXform(),
  conditionalFormattings: new ConditionalFormattingsXform(),
  headerFooter: new HeaderFooterXform(),
  rowBreaks: new RowBreaksXform(),
  tables: new TableXform(),
};

// ============================================================================================

class WorksheetWriter {
  constructor(options) {
    // in a workbook, each sheet will have a number
    this.id = options.id;

    // and a name
    this.name = options.name || `Sheet${this.id}`;

    // add a state
    this.state = options.state || 'visible';

    // rows are stored here while they need to be worked on.
    // when they are committed, they will be deleted.
    this._rows = [];

    // number of rows that in commit process.
    this._rowsInCommitProcessNumber = 0;

    // column definitions
    this._columns = null;

    // column keys (addRow convenience): key ==> this._columns index
    this._keys = {};

    // keep a record of all row and column pageBreaks
    this._merges = [];
    this._merges.add = function () {}; // ignore cell instruction

    // keep record of all hyperlinks
    this._sheetRelsWriter = new SheetRelsWriter(options);

    this._sheetCommentsWriter = new SheetCommentsWriter(this, this._sheetRelsWriter, options);

    // keep a record of dimensions
    this._dimensions = new Dimensions();

    // first uncommitted row
    this._rowZero = 1;

    // committed flag
    this.committed = false;

    // in commit process flag
    this.inCommitProcess = false;

    // for data validations
    this.dataValidations = new DataValidations();

    // for sharing formulae
    this._formulae = {};
    this._siFormulae = 0;

    // for tables
    this.tables = {};

    // keep a record of conditionalFormattings
    this.conditionalFormatting = [];

    // keep a record of all row and column pageBreaks
    this.rowBreaks = [];

    // for default row height, outline levels, etc
    this.properties = Object.assign(
      {},
      {
        defaultRowHeight: 15,
        dyDescent: 55,
        outlineLevelCol: 0,
        outlineLevelRow: 0,
        outlineProperties: {
          summaryBelow: true,
          summaryRight: true,
        },
      },
      options.properties,
    );

    this.headerFooter = Object.assign(
      {},
      {
        differentFirst: false,
        differentOddEven: false,
        oddHeader: null,
        oddFooter: null,
        evenHeader: null,
        evenFooter: null,
        firstHeader: null,
        firstFooter: null,
      },
      options.headerFooter,
    );

    // for all things printing
    this.pageSetup = Object.assign(
      {},
      {
        margins: {left: 0.7, right: 0.7, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3},
        orientation: 'portrait',
        horizontalDpi: 4294967295,
        verticalDpi: 4294967295,
        fitToPage: !!(
          options.pageSetup &&
          (options.pageSetup.fitToWidth || options.pageSetup.fitToHeight) &&
          !options.pageSetup.scale
        ),
        pageOrder: 'downThenOver',
        blackAndWhite: false,
        draft: false,
        cellComments: 'None',
        errors: 'displayed',
        scale: 100,
        fitToWidth: 1,
        fitToHeight: 1,
        paperSize: undefined,
        showRowColHeaders: false,
        showGridLines: false,
        horizontalCentered: false,
        verticalCentered: false,
        rowBreaks: null,
        colBreaks: null,
      },
      options.pageSetup,
    );

    // using shared strings creates a smaller xlsx file but may use more memory
    this.useSharedStrings = options.useSharedStrings || false;

    this._workbook = options.workbook;

    this.hasComments = false;

    // views
    this._views = options.views || [];

    // auto filter
    this.autoFilter = options.autoFilter || null;

    this._media = [];

    // worksheet protection
    this.sheetProtection = null;

    // start writing to stream now
    this._writeOpenWorksheet();

    this.startedData = false;
  }

  get workbook() {
    return this._workbook;
  }

  get stream() {
    if (!this._stream) {
      this._stream = this._workbook._openStream(`/xl/worksheets/sheet${this.id}.xml`);

      // pause stream to prevent 'data' events
      this._stream.pause();
    }
    return this._stream;
  }

  // destroy - not a valid operation for a streaming writer
  // even though some streamers might be able to, it's a bad idea.
  destroy() {
    throw new Error('Invalid Operation: destroy');
  }

  async commit() {
    if (this.committed || this.inCommitProcess) {
      return;
    }

    this.inCommitProcess = true;

    // commit all rows
    const remainingRows = this._rows;
    // we _cannot_ accept new rows from now on
    this._rows = null;

    if (remainingRows) {
      for (const cRow of remainingRows) {
        if (cRow) {
          // write the row to the stream
          await this._writeRow(cRow);
        }
      }
    }

    // wait committing rows
    if (this._rowsInCommitProcessNumber !== 0) {
      await new Promise(resolve => {
        this.stream.once('rowsZipped', resolve);
      });
    }

    if (!this.startedData) {
      this._writeOpenSheetData();
    }
    this._writeCloseSheetData();
    this._writeSheetProtection();
    this._writeAutoFilter();
    this._writeMergeCells();

    // for some reason, Excel can't handle dimensions at the bottom of the file
    // this._writeDimensions();

    this._writeConditionalFormatting();
    this._writeDataValidations();
    this._writeHyperlinks();
    this._writePageMargins();
    this._writePageSetup();
    this._writeHeaderFooter();
    this._writeRowBreaks();
    this._writeDrawings();

    // Legacy Data tag for comments
    this._writeLegacyData();

    this._writeBackground();
    this._writeTables();

    this._writeCloseWorksheet();
    // signal end of stream to workbook

    this._sheetCommentsWriter.commit();
    // also commit the hyperlinks if any
    this._sheetRelsWriter.commit();

    await this.stream.end();
    this.committed = true;

    this.stream.emit('worksheetsZipped');

    this.inCommitProcess = false;
  }

  // return the current dimensions of the writer
  get dimensions() {
    return this._dimensions;
  }

  get views() {
    return this._views;
  }

  // =========================================================================
  // Columns

  // get the current columns array.
  get columns() {
    return this._columns;
  }

  // set the columns from an array of column definitions.
  // Note: any headers defined will overwrite existing values.
  set columns(value) {
    // calculate max header row count
    this._headerRowCount = value.reduce((pv, cv) => {
      const headerCount = (cv.header && 1) || (cv.headers && cv.headers.length) || 0;
      return Math.max(pv, headerCount);
    }, 0);

    // construct Column objects
    let count = 1;
    const columns = (this._columns = []);
    value.forEach(defn => {
      const column = new Column(this, count++, false);
      columns.push(column);
      column.defn = defn;
    });
  }

  getColumnKey(key) {
    return this._keys[key];
  }

  setColumnKey(key, value) {
    this._keys[key] = value;
  }

  deleteColumnKey(key) {
    delete this._keys[key];
  }

  eachColumnKey(f) {
    _.each(this._keys, f);
  }

  // get a single column by col number. If it doesn't exist, it and any gaps before it
  // are created.
  getColumn(c) {
    if (typeof c === 'string') {
      // if it matches a key'd column, return that
      const col = this._keys[c];
      if (col) return col;

      // otherwise, assume letter
      c = colCache.l2n(c);
    }
    if (!this._columns) {
      this._columns = [];
    }
    if (c > this._columns.length) {
      let n = this._columns.length + 1;
      while (n <= c) {
        this._columns.push(new Column(this, n++));
      }
    }
    return this._columns[c - 1];
  }

  // =========================================================================
  // Rows
  get _nextRow() {
    return this._rowZero + this._rows.length;
  }

  // iterate over every uncommitted row in the worksheet, including maybe empty rows
  eachRow(options, iteratee) {
    if (!iteratee) {
      iteratee = options;
      options = undefined;
    }
    if (options && options.includeEmpty) {
      const n = this._nextRow;
      for (let i = this._rowZero; i < n; i++) {
        iteratee(this.getRow(i), i);
      }
    } else {
      this._rows.forEach(row => {
        if (row.hasValues) {
          iteratee(row, row.number);
        }
      });
    }
  }

  async _commitRow(cRow) {
    // since rows must be written in order, we commit all rows up till and including cRow
    let found = false;
    const promises = [];
    while (this._rows !== null && this._rows.length && !found) {
      const row = this._rows.shift();
      this._rowZero++;
      if (row) {
        promises.push(this._writeRow(row));
        found = row.number === cRow.number;
        this._rowZero = row.number + 1;
      }
    }
    await Promise.all(promises);
  }

  get lastRow() {
    // returns last uncommitted row
    if (this._rows.length) {
      return this._rows[this._rows.length - 1];
    }
    return undefined;
  }

  // find a row (if exists) by row number
  findRow(rowNumber) {
    if (!this._rows) {
      return undefined;
    }
    const index = rowNumber - this._rowZero;
    return this._rows[index];
  }

  getRow(rowNumber) {
    if (!this._rows) {
      return undefined;
    }
    const index = rowNumber - this._rowZero;

    // may fail if rows have been comitted
    if (index < 0) {
      throw new Error('Out of bounds: this row has been committed');
    }
    let row = this._rows[index];
    if (!row) {
      this._rows[index] = row = new Row(this, rowNumber);
    }
    return row;
  }

  addRow(value) {
    const row = new Row(this, this._nextRow);
    this._rows[row.number - this._rowZero] = row;
    row.values = value;
    return row;
  }

  // ================================================================================
  // Cells

  // returns the cell at [r,c] or address given by r. If not found, return undefined
  findCell(r, c) {
    const address = colCache.getAddress(r, c);
    const row = this.findRow(address.row);
    return row ? row.findCell(address.column) : undefined;
  }

  // return the cell at [r,c] or address given by r. If not found, create a new one.
  getCell(r, c) {
    const address = colCache.getAddress(r, c);
    const row = this.getRow(address.row);
    return row.getCellEx(address);
  }

  mergeCells(...cells) {
    // may fail if rows have been comitted
    const dimensions = new Dimensions(cells);

    // check cells aren't already merged
    this._merges.forEach(merge => {
      if (merge.intersects(dimensions)) {
        throw new Error('Cannot merge already merged cells');
      }
    });

    // apply merge
    const master = this.getCell(dimensions.top, dimensions.left);
    for (let i = dimensions.top; i <= dimensions.bottom; i++) {
      for (let j = dimensions.left; j <= dimensions.right; j++) {
        if (i > dimensions.top || j > dimensions.left) {
          this.getCell(i, j).merge(master);
        }
      }
    }

    // index merge
    this._merges.push(dimensions);
  }

  // =========================================================================
  // Tables
  addTable(model) {
    const table = new Table(this, model);
    this.tables[model.name] = table;
    return table;
  }

  getTable(name) {
    return this.tables[name];
  }

  removeTable(name) {
    delete this.tables[name];
  }

  getTables() {
    return Object.values(this.tables);
  }

  // ===========================================================================
  // Conditional Formatting
  addConditionalFormatting(cf) {
    this.conditionalFormatting.push(cf);
  }

  removeConditionalFormatting(filter) {
    if (typeof filter === 'number') {
      this.conditionalFormatting.splice(filter, 1);
    } else if (filter instanceof Function) {
      this.conditionalFormatting = this.conditionalFormatting.filter(filter);
    } else {
      this.conditionalFormatting = [];
    }
  }

  // =========================================================================
  // Images
  addImage(imageId, range, rotationOrProps, maybeProps) {
    const sheetImageId = uuidv4();
    const isRotationNumber = typeof rotationOrProps === 'number';
    const rotation = isRotationNumber
      ? rotationOrProps
      : rotationOrProps && rotationOrProps.rotation;
    const props = isRotationNumber ? maybeProps : rotationOrProps;
    const model = {
      type: 'image',
      imageId,
      range,
      rotation,
      props,
      sheetImageId,
    };
    const im = new Image(this, model);
    this._media.push(im);
    return sheetImageId;
  }

  getImages() {
    return this._media.filter(m => m.type === 'image');
  }

  addBackgroundImage(imageId) {
    this._background = {
      imageId,
    };
  }

  getBackgroundImageId() {
    return this._background && this._background.imageId;
  }

  // =========================================================================
  // Worksheet Protection
  protect(password, options) {
    // TODO: make this function truly async
    // perhaps marshal to worker thread or something
    return new Promise(resolve => {
      this.sheetProtection = {
        sheet: true,
      };
      if (options && 'spinCount' in options) {
        // force spinCount to be integer >= 0
        options.spinCount = Number.isFinite(options.spinCount)
          ? Math.round(Math.max(0, options.spinCount))
          : 100000;
      }
      if (password) {
        this.sheetProtection.algorithmName = 'SHA-512';
        this.sheetProtection.saltValue = Encryptor.randomBytes(16).toString('base64');
        this.sheetProtection.spinCount =
          options && 'spinCount' in options ? options.spinCount : 100000; // allow user specified spinCount
        this.sheetProtection.hashValue = Encryptor.convertPasswordToHash(
          password,
          'SHA512',
          this.sheetProtection.saltValue,
          this.sheetProtection.spinCount,
        );
      }
      if (options) {
        this.sheetProtection = Object.assign(this.sheetProtection, options);
        if (!password && 'spinCount' in options) {
          delete this.sheetProtection.spinCount;
        }
      }
      resolve();
    });
  }

  unprotect() {
    this.sheetProtection = null;
  }

  // ================================================================================

  _write(text) {
    xmlBuffer.reset();
    xmlBuffer.addText(text);
    this.stream.write(xmlBuffer);
  }

  _writeSheetProperties(xmlBuf, properties, pageSetup) {
    const sheetPropertiesModel = {
      outlineProperties: properties && properties.outlineProperties,
      tabColor: properties && properties.tabColor,
      pageSetup:
        pageSetup && pageSetup.fitToPage
          ? {
              fitToPage: pageSetup.fitToPage,
            }
          : undefined,
    };

    xmlBuf.addText(xform.sheetProperties.toXml(sheetPropertiesModel));
  }

  _writeSheetFormatProperties(xmlBuf, properties) {
    const sheetFormatPropertiesModel = properties
      ? {
          defaultRowHeight: properties.defaultRowHeight,
          dyDescent: properties.dyDescent,
          outlineLevelCol: properties.outlineLevelCol,
          outlineLevelRow: properties.outlineLevelRow,
        }
      : undefined;
    if (properties.defaultColWidth) {
      sheetFormatPropertiesModel.defaultColWidth = properties.defaultColWidth;
    }

    xmlBuf.addText(xform.sheetFormatProperties.toXml(sheetFormatPropertiesModel));
  }

  _writeOpenWorksheet() {
    xmlBuffer.reset();

    xmlBuffer.addText('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
    xmlBuffer.addText(
      '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"' +
        ' xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"' +
        ' xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"' +
        ' mc:Ignorable="x14ac"' +
        ' xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">',
    );

    this._writeSheetProperties(xmlBuffer, this.properties, this.pageSetup);

    xmlBuffer.addText(xform.sheetViews.toXml(this.views));

    this._writeSheetFormatProperties(xmlBuffer, this.properties);

    this.stream.write(xmlBuffer);
  }

  _writeColumns() {
    const cols = Column.toModel(this.columns);
    if (cols) {
      xform.columns.prepare(cols, {styles: this._workbook.styles});
      this.stream.write(xform.columns.toXml(cols));
    }
  }

  _writeOpenSheetData() {
    this._write('<sheetData>');
  }

  async _writeRow(row) {
    if (!this.startedData) {
      this._writeColumns();
      this._writeOpenSheetData();
      this.startedData = true;
    }

    if (row.hasValues || row.height) {
      const {model} = row;
      const options = {
        styles: this._workbook.styles,
        sharedStrings: this.useSharedStrings ? this._workbook.sharedStrings : undefined,
        hyperlinks: this._sheetRelsWriter.hyperlinksProxy,
        merges: this._merges,
        formulae: this._formulae,
        siFormulae: this._siFormulae,
        comments: [],
      };
      xform.row.prepare(model, options);

      this._rowsInCommitProcessNumber++;
      await this.stream.write(xform.row.toXml(model));
      const rowsInCommitProcess = --this._rowsInCommitProcessNumber;

      if (rowsInCommitProcess === 0) {
        this.stream.emit('rowsZipped');
      }

      if (options.comments.length) {
        this.hasComments = true;
        this._sheetCommentsWriter.addComments(options.comments);
      }
    }
  }

  _writeCloseSheetData() {
    this._write('</sheetData>');
  }

  _writeMergeCells() {
    if (this._merges.length) {
      xmlBuffer.reset();
      xmlBuffer.addText(`<mergeCells count="${this._merges.length}">`);
      this._merges.forEach(merge => {
        xmlBuffer.addText(`<mergeCell ref="${merge}"/>`);
      });
      xmlBuffer.addText('</mergeCells>');

      this.stream.write(xmlBuffer);
    }
  }

  _writeHyperlinks() {
    this.stream.write(xform.hyperlinks.toXml(this._sheetRelsWriter._hyperlinks));
  }

  _writeConditionalFormatting() {
    const options = {
      styles: this._workbook.styles,
    };
    xform.conditionalFormattings.prepare(this.conditionalFormatting, options);
    this.stream.write(xform.conditionalFormattings.toXml(this.conditionalFormatting));
  }

  _writeRowBreaks() {
    this.stream.write(xform.rowBreaks.toXml(this.rowBreaks));
  }

  _writeTables() {
    const numTables = Object.keys(this.tables).length;
    if (numTables === 0) {
      return;
    }
    this.stream.write(`<tableParts count="${numTables}">`);

    Object.values(this.tables)
      .map(table => table.table)
      .forEach(table => {
        this._workbook.tableCount++;

        table.id = this._workbook.tableCount;
        table.target = `table${table.id}.xml`;

        // dynamic styles
        if (table.columns) {
          table.columns.forEach(column => {
            const {style} = column;
            if (style) {
              column.dxfId = this._workbook.styles.addDxfStyle(style);
            }
          });
        }

        xform.tables.prepare(table, {});
        const tableXml = xform.tables.toXml(table);

        const tableId = this._sheetRelsWriter.addRelationship({
          Target: `../tables/${table.target}`,
          Type: RelType.Table,
        });

        const tableStream = this._workbook._openStream(`/xl/tables/${table.target}`);
        tableStream.write(tableXml);
        tableStream.end();

        this.stream.write(`<tablePart r:id="${tableId}"/>`);
      });
    this.stream.write('</tableParts>');
  }

  _writeDataValidations() {
    this.stream.write(xform.dataValidations.toXml(this.dataValidations.model));
  }

  _writeSheetProtection() {
    this.stream.write(xform.sheetProtection.toXml(this.sheetProtection));
  }

  _writePageMargins() {
    this.stream.write(xform.pageMargins.toXml(this.pageSetup.margins));
  }

  _writePageSetup() {
    this.stream.write(xform.pageSeteup.toXml(this.pageSetup));
  }

  _writeHeaderFooter() {
    this.stream.write(xform.headerFooter.toXml(this.headerFooter));
  }

  _writeAutoFilter() {
    this.stream.write(xform.autoFilter.toXml(this.autoFilter));
  }

  _writeBackground() {
    if (this._background) {
      if (this._background.imageId !== undefined) {
        const image = this._workbook.getImage(this._background.imageId);
        const pictureId = this._sheetRelsWriter.addMedia({
          Target: `../media/${image.name}`,
          Type: RelType.Image,
        });

        this._background = {
          ...this._background,
          rId: pictureId,
        };
      }
      this.stream.write(xform.picture.toXml({rId: this._background.rId}));
    }
  }

  _writeDrawings() {
    const images = this.getImages();
    if (images.length) {
      const lastDrawingId = this.workbook.drawings.length + 1;
      const drawingId = this._sheetRelsWriter.addMedia({
        Target: `../drawings/drawing${lastDrawingId}.xml`,
        Type: RelType.Drawing,
      });
      const drawing = {
        rId: drawingId,
        name: `drawing${lastDrawingId}`,
        rels: [],
        anchors: [],
      };
      const drawingRelsHash = {};
      images.forEach(img => {
        const image = this.workbook.getImage(img.imageId);
        let rIdImage = drawingRelsHash[img.imageId];
        if (!rIdImage) {
          rIdImage = `rId${drawing.rels.length + 1}`;
          drawingRelsHash[img.imageId] = rIdImage;
          drawing.rels.push({
            Id: rIdImage,
            Type: RelType.Image,
            Target: `../media/${image.name}`,
          });
        }
        const anchor = {
          picture: {
            rId: rIdImage,
            ...(img.rotation !== undefined ? {rotation: img.rotation} : {}),
            ...(img.ext !== undefined ? {ext: img.ext} : {}),
            ...(img.off !== undefined ? {off: img.off} : {}),
            ...(img.props
              ? {
                  title: img.props.title,
                  description: img.props.description,
                  decorative: img.props.decorative,
                }
              : {}),
          },
          range: img.range,
        };
        if (img.range && img.range.hyperlinks && img.range.hyperlinks.hyperlink) {
          const rIdHyperLink = `rId${drawing.rels.length + 1}`;
          anchor.picture.hyperlinks = {
            tooltip: img.range.hyperlinks.tooltip,
            rId: rIdHyperLink,
          };
          drawing.rels.push({
            Id: rIdHyperLink,
            Type: RelType.Hyperlink,
            Target: img.range.hyperlinks.hyperlink,
            TargetMode: 'External',
          });
        }
        drawing.anchors.push(anchor);
      });
      this.workbook.drawings.push(drawing);
      this.stream.write(xform.drawing.toXml({rId: drawing.rId}));
    }
  }

  _writeLegacyData() {
    if (this.hasComments) {
      xmlBuffer.reset();
      xmlBuffer.addText(`<legacyDrawing r:id="${this._sheetCommentsWriter.vmlRelId}"/>`);
      this.stream.write(xmlBuffer);
    }
  }

  _writeDimensions() {
    // for some reason, Excel can't handle dimensions at the bottom of the file
    // and we don't know the dimensions until the commit, so don't write them.
    // this._write('<dimension ref="' + this._dimensions + '"/>');
  }

  _writeCloseWorksheet() {
    this._write('</worksheet>');
  }
}

export default WorksheetWriter;
