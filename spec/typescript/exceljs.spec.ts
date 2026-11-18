import 'regenerator-runtime/runtime';

import { expect } from 'chai';
import * as ExcelJS from '../../index';

describe('typescript', () => {
  it('can create and buffer xlsx', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('blort');
    ws.getCell('A1').value = 7;
    const buffer = await wb.xlsx.writeBuffer({
      useStyles: true,
      useSharedStrings: true,
    });

    const wb2 = new ExcelJS.Workbook();
    await wb2.xlsx.load(buffer);
    const ws2 = wb2.getWorksheet('blort');
    expect(ws2.getCell('A1').value).to.equal(7);
  });
  it('can create and stream xlsx', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('blort');
    ws.getCell('A1').value = 7;

    const { PassThrough } = require('stream');
    const stream = new PassThrough();
    const wb2 = new ExcelJS.Workbook();
    
    // Write to stream and read from it
    const writePromise = wb.xlsx.write(stream);
    const readPromise = wb2.xlsx.read(stream);
    
    await Promise.all([writePromise, readPromise]);
    
    const ws2 = wb2.getWorksheet('blort');
    expect(ws2.getCell('A1').value).to.equal(7);
  });
  it('can create and stream xlsx with web-native streams', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('blort');
    ws.getCell('A1').value = 7;

    const chunks: Uint8Array[] = [];
    const writable = new WritableStream<Uint8Array>({
      write(chunk) {
        chunks.push(chunk);
      },
    });
    await wb.xlsx.write(writable);

    const buffer = Buffer.concat(chunks);
    const readable = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new Uint8Array(buffer));
        controller.close();
      },
    });

    const wb2 = new ExcelJS.Workbook();
    await wb2.xlsx.read(readable);
    const ws2 = wb2.getWorksheet('blort');
    expect(ws2.getCell('A1').value).to.equal(7);
  });
  it('can create and stream csv with web-native streams', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('blort');
    ws.getCell('A1').value = 7;

    const chunks: Uint8Array[] = [];
    const writable = new WritableStream<Uint8Array>({
      write(chunk) {
        chunks.push(chunk);
      },
    });
    await wb.csv.write(writable);

    const buffer = Buffer.concat(chunks);
    const readable = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new Uint8Array(buffer));
        controller.close();
      },
    });

    const wb2 = new ExcelJS.Workbook();
    const ws2 = await wb2.csv.read(readable);
    expect(ws2.getCell('A1').value).to.equal(7);
  });
  it('can add conditional formatting with stopIfTrue and optional priority', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('cf');
    ws.addConditionalFormatting({
      ref: 'A1:A5',
      rules: [
        {
          type: 'expression',
          formulae: ['A1>5'],
          stopIfTrue: true,
          style: {
            fill: {
              type: 'pattern',
              pattern: 'solid',
              bgColor: { argb: 'FFFF0000' },
            },
          },
        },
        {
          type: 'top10',
          priority: 2,
          stopIfTrue: false,
          style: {
            font: { bold: true },
          },
        },
      ],
    });

    const buffer = await wb.xlsx.writeBuffer();
    const wb2 = new ExcelJS.Workbook();
    await wb2.xlsx.load(buffer);
    const ws2 = wb2.getWorksheet('cf');
    expect(ws2.conditionalFormattings).to.have.lengthOf(1);
    expect(ws2.conditionalFormattings[0].rules[0].stopIfTrue).to.equal(true);
    expect(ws2.conditionalFormattings[0].rules[0].priority).to.be.a('number');
  });
  it('exposes numeric col and row on Address and Cell', () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('address');
    const cell = ws.getCell('B3');

    const col: number = cell.col;
    const row: number = cell.row;
    const addr: ExcelJS.Address = {
      address: cell.address,
      col,
      row,
      $col$row: cell.$col$row,
    };

    expect(col).to.equal(2);
    expect(row).to.equal(3);
    expect(ws.getRow(row).getCellEx(addr).address).to.equal('B3');
  });
  it('exports DataValidationType for DataValidation.type', () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('dv');
    const validationType: ExcelJS.DataValidationType = 'list';
    const validation: ExcelJS.DataValidation = {
      type: validationType,
      allowBlank: true,
      formulae: ['"One,Two,Three"'],
    };

    ws.getCell('A1').dataValidation = validation;
    expect(ws.getCell('A1').dataValidation.type).to.equal('list');
  });
  it('protect worksheet with 0, 1, or 2 arguments (PR #2664)', async function () {
    this.timeout(5000);
    const wb = new ExcelJS.Workbook();
    const ws1 = wb.addWorksheet('protect-0');
    await ws1.protect();
    expect(ws1.sheetProtection?.sheet).to.equal(true);

    const ws2 = wb.addWorksheet('protect-1');
    await ws2.protect('password');
    expect(ws2.sheetProtection?.sheet).to.equal(true);

    const ws3 = wb.addWorksheet('protect-2');
    await ws3.protect('password', {
      selectLockedCells: true,
      selectUnlockedCells: true,
    });
    expect(ws3.sheetProtection?.sheet).to.equal(true);
    expect(ws3.sheetProtection?.selectLockedCells).to.equal(true);
  });
  it('supports dataBar conditional formatting with color and ext colors (PR #2655)', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('databar');
    const dataBarRule: ExcelJS.DataBarRuleType = {
      type: 'dataBar',
      color: { argb: 'FFFF0000' },
      borderColor: { argb: 'FF0000FF' },
      negativeBorderColor: { argb: 'FF00FF00' },
      negativeFillColor: { argb: 'FFFF00FF' },
      axisColor: { argb: 'FF000000' },
      gradient: false,
      cfvo: [{ type: 'min' }, { type: 'max' }],
    };

    ws.addConditionalFormatting({
      ref: 'A1:A10',
      rules: [dataBarRule],
    });

    const buffer = await wb.xlsx.writeBuffer();
    const wb2 = new ExcelJS.Workbook();
    await wb2.xlsx.load(buffer);
    const ws2 = wb2.getWorksheet('databar');
    expect(ws2.conditionalFormattings).to.have.lengthOf(1);
    const rule = ws2.conditionalFormattings[0].rules[0] as ExcelJS.DataBarRuleType;
    expect(rule.type).to.equal('dataBar');
    expect(rule.color?.argb).to.equal('FFFF0000');
    expect(rule.borderColor?.argb).to.equal('FF0000FF');
    expect(rule.negativeBorderColor?.argb).to.equal('FF00FF00');
    expect(rule.negativeFillColor?.argb).to.equal('FFFF00FF');
    expect(rule.axisColor?.argb).to.equal('FF000000');
  });
  it('supports Media, WorkbookMedia, and WorksheetMedia types (PR #2630)', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('media');

    // Create 1x1 transparent PNG buffer
    const pngBase64 =
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const pngBuffer = Buffer.from(pngBase64, 'base64');

    const imageId = wb.addImage({
      buffer: pngBuffer,
      extension: 'png',
    });

    ws.addImage(imageId, {
      tl: { col: 0, row: 0 },
      ext: { width: 100, height: 100 },
      editAs: 'oneCell',
      hyperlinks: {
        hyperlink: 'http://www.somewhere.com',
        tooltip: 'www.somewhere.com',
      },
    });
    ws.addBackgroundImage(imageId);

    const buffer = await wb.xlsx.writeBuffer();
    const wb2 = new ExcelJS.Workbook();
    await wb2.xlsx.load(buffer);
    const ws2 = wb2.getWorksheet('media');

    const wbMediaList: ExcelJS.WorkbookMedia[] = wb2.model.media;
    const baseMediaList: ExcelJS.Media[] = wbMediaList;
    expect(wbMediaList).to.have.lengthOf(1);
    expect(wbMediaList[0].type).to.equal('image');
    expect(wbMediaList[0].extension).to.equal('png');
    expect(wbMediaList[0].index).to.equal(0);
    expect(baseMediaList[0].name).to.equal('image1');

    const wsMediaList: ExcelJS.WorksheetMedia[] = ws2.model.media;
    expect(wsMediaList).to.have.lengthOf(2);
    expect(wsMediaList[0].type).to.equal('image');
    expect(wsMediaList[0].imageId).to.equal(0);
    expect(wsMediaList[1].type).to.equal('background');
    expect(wsMediaList[1].imageId).to.equal(0);
  });
  it('returns null or { min, max } for Row.dimensions (PR #2596)', () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('dimensions');

    const emptyRow = ws.getRow(1);
    const emptyDimensions: { min: number; max: number } | null = emptyRow.dimensions;
    expect(emptyDimensions).to.equal(null);

    const populatedRow = ws.getRow(2);
    populatedRow.getCell(2).value = 'first';
    populatedRow.getCell(4).value = 'last';

    const populatedDimensions: { min: number; max: number } | null = populatedRow.dimensions;
    expect(populatedDimensions).to.deep.equal({ min: 2, max: 4 });
  });
  it('supports Column.values and Row.values types (PR #2587, PR #1886)', () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('values');

    ws.columns = [
      { header: 'Id', key: 'id' },
      { header: 'Name', key: 'name' },
    ];

    const colA = ws.getColumn('A');
    colA.values = ['Id', 1, 2];
    const colValues: ExcelJS.CellValue[] = colA.values;
    expect(colValues).to.deep.equal([, 'Id', 1, 2]);

    const row2 = ws.getRow(2);
    row2.values = [10, 'Alice'];
    const row2Values: ExcelJS.CellValue[] = row2.values;
    expect(row2Values.length).to.equal(3);
    expect(row2Values).to.deep.equal([, 10, 'Alice']);

    const row3 = ws.getRow(3);
    row3.values = { id: 20, name: 'Bob' };
    const row3Values: ExcelJS.CellValue[] = row3.values;
    expect(row3Values).to.deep.equal([, 20, 'Bob']);
  });
  it('supports boolean, string, and null for FastCsvParserOptionsArgs.quote (PR #2127)', async () => {
    const { Readable } = require('stream');

    const optionsFalse: Partial<ExcelJS.CsvReadOptions> = {
      parserOptions: {
        delimiter: '\t',
        quote: false,
      },
    };
    const wbFalse = new ExcelJS.Workbook();
    const wsFalse = await wbFalse.csv.read(Readable.from(['a\t"b"']), optionsFalse);
    expect(wsFalse.getCell('A1').value).to.equal('a');
    expect(wsFalse.getCell('B1').value).to.equal('"b"');

    const optionsString: Partial<ExcelJS.CsvReadOptions> = {
      parserOptions: {
        quote: '"',
      },
    };
    const wbString = new ExcelJS.Workbook();
    const wsString = await wbString.csv.read(Readable.from(['a,"b"']), optionsString);
    expect(wsString.getCell('A1').value).to.equal('a');
    expect(wsString.getCell('B1').value).to.equal('b');

    const optionsNull: Partial<ExcelJS.CsvReadOptions> = {
      parserOptions: {
        quote: null,
      },
    };
    const wbNull = new ExcelJS.Workbook();
    const wsNull = await wbNull.csv.read(Readable.from(['a,"b"']), optionsNull);
    expect(wsNull.getCell('A1').value).to.equal('a');
    expect(wsNull.getCell('B1').value).to.equal('"b"');
  });
  it("supports 'None' and null for TableStyleProperties.theme (PR #2061)", async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('tables');

    const styleNone: ExcelJS.TableStyleProperties = {
      theme: 'None',
      showRowStripes: true,
    };

    const styleNull: ExcelJS.TableStyleProperties = {
      theme: null,
      showRowStripes: true,
    };

    ws.addTable({
      name: 'TableNone',
      ref: 'A1',
      headerRow: true,
      totalsRow: true,
      style: styleNone,
      columns: [
        { name: 'Date', totalsRowLabel: 'Totals:', filterButton: true },
        { name: 'Amount', totalsRowFunction: 'sum', filterButton: false },
      ],
      rows: [
        [new Date('2019-07-20'), 70.1],
        [new Date('2019-07-21'), 70.6],
      ],
    });

    ws.addTable({
      name: 'TableNull',
      ref: 'D1',
      headerRow: true,
      totalsRow: false,
      style: styleNull,
      columns: [
        { name: 'Category', filterButton: true },
        { name: 'Value', filterButton: false },
      ],
      rows: [['A', 1]],
    });

    const buffer = await wb.xlsx.writeBuffer();
    const wb2 = new ExcelJS.Workbook();
    await wb2.xlsx.load(buffer);
    const ws2 = wb2.getWorksheet('tables');

    const tableNone: any = ws2.getTable('TableNone');
    expect(tableNone.table.style.theme).to.equal('None');
    expect(tableNone.table.style.showRowStripes).to.equal(true);

    const tableNull: any = ws2.getTable('TableNull');
    expect(tableNull.table.style.theme).to.equal(null);
    expect(tableNull.table.style.showRowStripes).to.equal(true);
  });
  it('supports optional options for stream.xlsx.WorkbookReader (PR #1922)', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('stream-reader');
    ws.getCell('A1').value = 'hello';
    const buffer = await wb.xlsx.writeBuffer();

    const { Readable } = require('stream');

    const readerWithoutOptions = new ExcelJS.stream.xlsx.WorkbookReader(Readable.from(buffer));
    const valuesWithoutOptions: ExcelJS.CellValue[] = [];
    for await (const worksheetReader of readerWithoutOptions) {
      for await (const row of worksheetReader) {
        valuesWithoutOptions.push(row.getCell(1).value);
      }
    }
    expect(valuesWithoutOptions).to.deep.equal(['hello']);

    const readerWithOptions = new ExcelJS.stream.xlsx.WorkbookReader(Readable.from(buffer), {
      worksheets: 'emit',
      sharedStrings: 'cache',
    });
    const valuesWithOptions: ExcelJS.CellValue[] = [];
    for await (const worksheetReader of readerWithOptions) {
      for await (const row of worksheetReader) {
        valuesWithOptions.push(row.getCell(1).value);
      }
    }
    expect(valuesWithOptions).to.deep.equal(['hello']);
  });
  it('exposes WorksheetReader properties and getters (PR #1901)', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('SheetWithProps', { state: 'visible' });
    ws.columns = [
      { header: 'Id', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 20 },
    ];
    ws.addRow({ id: 1, name: 'Alice' });
    const buffer = await wb.xlsx.writeBuffer();

    const { Readable } = require('stream');
    const workbookReader = new ExcelJS.stream.xlsx.WorkbookReader(Readable.from(buffer));

    for await (const worksheetReader of workbookReader) {
      const id: number = worksheetReader.id;
      const name: string = worksheetReader.name;
      const state: ExcelJS.WorksheetState = worksheetReader.state;
      const parentWb: ExcelJS.stream.xlsx.WorkbookReader = worksheetReader.workbook;

      expect(id).to.equal(1);
      expect(name).to.equal('SheetWithProps');
      expect(state).to.equal('visible');
      expect(parentWb).to.equal(workbookReader);

      const rows: ExcelJS.Row[] = [];
      for await (const row of worksheetReader) {
        rows.push(row);
      }
      expect(rows).to.have.lengthOf(2);

      const dimensions: ExcelJS.Range = worksheetReader.dimensions;
      expect(dimensions.top).to.equal(1);
      expect(dimensions.left).to.equal(1);
      expect(dimensions.bottom).to.equal(2);
      expect(dimensions.right).to.equal(2);

      const columns: ExcelJS.Column[] | null = worksheetReader.columns;
      expect(columns).to.be.an('array').with.lengthOf(2);

      const colByNum: ExcelJS.Column = worksheetReader.getColumn(1);
      const colByLetter: ExcelJS.Column = worksheetReader.getColumn('B');
      expect(colByNum.number).to.equal(1);
      expect(colByLetter.number).to.equal(2);
    }
  });

  it('supports outlineProperties, duplicateRows, and csv headers typing', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('OutlineSheet', {
      properties: {
        outlineProperties: {
          summaryBelow: false,
          summaryRight: false,
        },
      },
    });

    if (ws.properties.outlineProperties) {
      ws.properties.outlineProperties.summaryBelow = true;
      ws.properties.outlineProperties.summaryRight = true;
      expect(ws.properties.outlineProperties.summaryBelow).to.equal(true);
      expect(ws.properties.outlineProperties.summaryRight).to.equal(true);
    }

    ws.duplicateRows({
      initialRow: 1,
      length: 2,
      firstRowToPaste: 3,
      copiesAmount: 1,
    });

    expect(typeof ws.duplicateRows).to.equal('function');

    const csvOptions: Partial<ExcelJS.CsvReadOptions> = {
      parserOptions: {
        headers: true,
      },
    };
    expect(csvOptions.parserOptions?.headers).to.equal(true);
  });

  it('supports Table properties, methods, and column filterButton typing (PR #2185, #2089, #2090)', () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('TableSheet');
    const table: ExcelJS.Table = ws.addTable({
      name: 'TestTable',
      ref: 'A1:B3',
      headerRow: true,
      totalsRow: false,
      columns: [
        {name: 'Col1', filterButton: true},
        {name: 'Col2', filterButton: false},
      ],
      rows: [
        [1, 2],
        [3, 4],
      ],
    });

    expect(table.name).to.equal('TestTable');
    expect(table.table.ref).to.equal('A1:B3');
    expect(table.ref).to.equal('A1:B3');
    table.commit();
    expect(ws.getTable('TestTable')).to.equal(table);
  });

  it('supports stream.xlsx.WorkbookWriter with addImage and addDrawings (PR #2201)', async () => {
    const wb = new ExcelJS.stream.xlsx.WorkbookWriter({});
    const ws = wb.addWorksheet('ImageSheet');
    const imageId = wb.addImage({
      buffer: Buffer.from([1, 2, 3]),
      extension: 'png',
    });
    const sheetImageId: string = ws.addImage(imageId, 'A1:C5');
    expect(sheetImageId).to.be.a('string');
    await wb.addDrawings();
  });

  it('supports CJS index.js entry point and exports (PR #2562)', () => {
    const wb: ExcelJS.Workbook = new ExcelJS.Workbook();
    expect(wb).to.be.an.instanceOf(ExcelJS.Workbook);
    const ws: ExcelJS.Worksheet = wb.addWorksheet('Sheet1');
    expect(ws.name).to.equal('Sheet1');
  });

  it('supports shapes, pivot tables with multiple values, and header/footer images (PR #2601, #2578, #2563)', () => {
    const wb = new ExcelJS.Workbook();
    const ws1 = wb.addWorksheet('SourceSheet');
    ws1.addRow(['Name', 'Category', 'Sales', 'Profit']);
    ws1.addRow(['Widget', 'A', 100, 20]);
    ws1.addRow(['Gadget', 'B', 200, 50]);

    // PR #2578: addPivotTable with multiple values and optional columns
    const pivotProps: ExcelJS.PivotTableModel = {
      sourceSheet: ws1,
      rows: ['Category'],
      values: ['Sales', 'Profit'],
      metric: 'sum',
    };
    const wsPivot = wb.addWorksheet('PivotSheet');
    wsPivot.addPivotTable(pivotProps);

    // PR #2601: addShape and getShapes
    const shapeProps: ExcelJS.ShapeProps = {
      type: 'roundRect',
      rotation: 15,
      fill: {type: 'solid', color: {rgb: '4499FF'}},
      outline: {weight: 2, color: {rgb: '446699'}, dash: 'sysDash'},
      textBody: {
        vertAlign: 'ctr',
        paragraphs: [
          {alignment: 'l', runs: [{text: 'Hello Shape'}]},
        ],
      },
    };
    ws1.addShape(shapeProps, 'B2:H8', {
      hyperlink: 'https://www.example.com',
      tooltip: 'Example Link',
    });
    const shapes = ws1.getShapes();
    expect(shapes).to.be.an('array').with.lengthOf(1);
    expect(shapes[0].props.type).to.equal('roundRect');

    // PR #2563: addHFImage
    const imageId = wb.addImage({
      buffer: Buffer.from([1, 2, 3]),
      extension: 'png',
    });
    const hfOptions: ExcelJS.HFImageOptions = {
      id: 'HF',
      width: '15pt',
      height: '15pt',
    };
    ws1.addHFImage(imageId, hfOptions);
    expect(ws1.hfImages).to.be.an('array').with.lengthOf(1);
    expect(ws1.hfImages[0].id).to.equal('HF');
  });

  it('supports async row.commit(), worksheet.commit(), and addImage rotation (PR #2558, #2049)', async () => {
    const wb = new ExcelJS.stream.xlsx.WorkbookWriter({});
    const ws = wb.addWorksheet('StreamSheet');
    const imageId = wb.addImage({
      buffer: Buffer.from([1, 2, 3]),
      extension: 'png',
    });
    const sheetImageId = ws.addImage(imageId, 'A1:B2', 90);
    expect(sheetImageId).to.be.a('string');
    const images = ws.getImages();
    expect(images[0].rotation).to.equal(90);

    await ws.addRow(['a', 'b']).commit();
    await ws.commit();
    await wb.commit();
  });

  it('supports comment autoShape option (PR #1933)', () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('CommentsSheet');
    const comment: ExcelJS.Comment = {
      texts: [{text: 'This\nIs\nA\nComment\nThat\nNeed\nA\nLargeBox'}],
      autoShape: true,
    };
    ws.getCell('C3').note = comment;
    const cellNote = ws.getCell('C3').note as ExcelJS.Comment;
    expect(cellNote.autoShape).to.equal(true);
  });

  it('supports makeColumns, streaming tables, and image accessibility props (PR #1889, #1885, #1789)', () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('NestedSheet');
    const {rows} = ws.makeColumns([
      {id: 1, title: 'Col 1'},
      {
        id: 2,
        title: 'Group',
        children: [
          {id: 21, title: 'Sub 1', width: 12},
          {id: 22, title: 'Sub 2', width: 14},
        ],
      },
    ]);
    expect(rows.length).to.equal(2);

    const imageId = wb.addImage({
      buffer: Buffer.from([1, 2, 3]),
      extension: 'png',
    });
    ws.addImage(
      imageId,
      {tl: {col: 0, row: 3}, ext: {width: 100, height: 50}},
      {title: 'Title', description: 'Alt text', decorative: 1}
    );
    expect(ws.getImages()[0].props?.title).to.equal('Title');

    const streamWb = new ExcelJS.stream.xlsx.WorkbookWriter({});
    const streamWs = streamWb.addWorksheet('StreamTableSheet');
    const table = streamWs.addTable({
      name: 'StreamTable',
      ref: 'A1',
      columns: [{name: 'A'}, {name: 'B'}],
      rows: [[1, 2]],
    });
    expect(streamWs.getTable('StreamTable')).to.equal(table);

    const styledCell = ws.getCell('A1');
    styledCell.setStyle({
      font: {bold: true, color: {argb: 'FF3366FF'}},
    });
    expect(styledCell.font?.bold).to.equal(true);
  });
});
