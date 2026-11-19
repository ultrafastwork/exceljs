import fs from 'node:fs';
import {promisify} from 'node:util';
import testUtils from '../../utils/index.js';
import worksheetTableSpec from '../../unit/doc/worksheet-table.spec.js';
import ExcelJS from '../../../lib/exceljs.nodejs.js';

const {addTable, checkTable, defaultTableValues} = worksheetTableSpec;

const TEST_XLSX_FILE_NAME = './spec/out/wb.test.xlsx';
const IMAGE_FILENAME = `${import.meta.dirname}/../data/image.png`;
const fsReadFileAsync = promisify(fs.readFile);

describe('WorkbookWriter', () => {
  it('creates sheets with correct names', () => {
    const wb = new ExcelJS.stream.xlsx.WorkbookWriter();
    const ws1 = wb.addWorksheet('Hello, World!');
    expect(ws1.name).to.equal('Hello, World!');

    const ws2 = wb.addWorksheet();
    expect(ws2.name).to.match(/sheet\d+/);
  });

  describe('Serialise', () => {
    it('xlsx file', () => {
      const options = {
        filename: TEST_XLSX_FILE_NAME,
        useStyles: true,
      };
      const wb = testUtils.createTestBook(new ExcelJS.stream.xlsx.WorkbookWriter(options), 'xlsx');

      return wb
        .commit()
        .then(() => {
          const wb2 = new ExcelJS.Workbook();
          return wb2.xlsx.readFile(TEST_XLSX_FILE_NAME);
        })
        .then(wb2 => {
          testUtils.checkTestBook(wb2, 'xlsx');
        });
    });

    it('shared formula', () => {
      const options = {
        filename: TEST_XLSX_FILE_NAME,
        useStyles: false,
      };
      const wb = new ExcelJS.stream.xlsx.WorkbookWriter(options);
      const ws = wb.addWorksheet('Hello');
      ws.getCell('A1').value = {
        formula: 'ROW()+COLUMN()',
        ref: 'A1:B2',
        result: 2,
      };
      ws.getCell('B1').value = {sharedFormula: 'A1', result: 3};
      ws.getCell('A2').value = {sharedFormula: 'A1', result: 3};
      ws.getCell('B2').value = {sharedFormula: 'A1', result: 4};

      ws.commit();
      return wb
        .commit()
        .then(() => {
          const wb2 = new ExcelJS.Workbook();
          return wb2.xlsx.readFile(TEST_XLSX_FILE_NAME);
        })
        .then(wb2 => {
          const ws2 = wb2.getWorksheet('Hello');
          expect(ws2.getCell('A1').value).to.deep.equal({
            formula: 'ROW()+COLUMN()',
            shareType: 'shared',
            ref: 'A1:B2',
            result: 2,
          });
          expect(ws2.getCell('B1').value).to.deep.equal({
            sharedFormula: 'A1',
            result: 3,
          });
          expect(ws2.getCell('A2').value).to.deep.equal({
            sharedFormula: 'A1',
            result: 3,
          });
          expect(ws2.getCell('B2').value).to.deep.equal({
            sharedFormula: 'A1',
            result: 4,
          });
        });
    });

    it('auto filter', () => {
      const options = {
        filename: TEST_XLSX_FILE_NAME,
        useStyles: false,
      };
      const wb = new ExcelJS.stream.xlsx.WorkbookWriter(options);
      const ws = wb.addWorksheet('Hello');
      ws.getCell('A1').value = 1;
      ws.getCell('B1').value = 1;
      ws.getCell('A2').value = 2;
      ws.getCell('B2').value = 2;
      ws.getCell('A3').value = 3;
      ws.getCell('B3').value = 3;

      ws.autoFilter = 'A1:B1';
      ws.commit();

      return wb
        .commit()
        .then(() => {
          const wb2 = new ExcelJS.Workbook();
          return wb2.xlsx.readFile(TEST_XLSX_FILE_NAME);
        })
        .then(wb2 => {
          const ws2 = wb2.getWorksheet('Hello');
          expect(ws2.autoFilter).to.equal('A1:B1');
        });
    });

    it('Without styles', () => {
      const options = {
        filename: TEST_XLSX_FILE_NAME,
        useStyles: false,
      };
      const wb = testUtils.createTestBook(new ExcelJS.stream.xlsx.WorkbookWriter(options), 'xlsx');

      return wb
        .commit()
        .then(() => {
          const wb2 = new ExcelJS.Workbook();
          return wb2.xlsx.readFile(TEST_XLSX_FILE_NAME);
        })
        .then(wb2 => {
          testUtils.checkTestBook(wb2, 'xlsx', undefined, {
            checkStyles: false,
          });
        });
    });

    it('serializes row styles and columns properly', () => {
      const options = {
        filename: TEST_XLSX_FILE_NAME,
        useStyles: true,
      };
      const wb = new ExcelJS.stream.xlsx.WorkbookWriter(options);
      const ws = wb.addWorksheet('blort');

      const colStyle = {
        font: testUtils.styles.fonts.comicSansUdB16,
        alignment: testUtils.styles.namedAlignments.middleCentre,
      };
      ws.columns = [
        {header: 'A1', width: 10},
        {header: 'B1', style: colStyle},
        {header: 'C1', width: 30},
        {header: 'D1'},
      ];

      ws.getRow(2).font = testUtils.styles.fonts.broadwayRedOutline20;

      ws.getCell('A2').value = 'A2';
      ws.getCell('B2').value = 'B2';
      ws.getCell('C2').value = 'C2';
      ws.getCell('A3').value = 'A3';
      ws.getCell('B3').value = 'B3';
      ws.getCell('C3').value = 'C3';

      return wb
        .commit()
        .then(() => {
          const wb2 = new ExcelJS.Workbook();
          return wb2.xlsx.readFile(TEST_XLSX_FILE_NAME);
        })
        .then(wb2 => {
          const ws2 = wb2.getWorksheet('blort');
          ['A1', 'B1', 'C1', 'A2', 'B2', 'C2', 'A3', 'B3', 'C3'].forEach(address => {
            expect(ws2.getCell(address).value).to.equal(address);
          });
          expect(ws2.getCell('B1').font).to.deep.equal(testUtils.styles.fonts.comicSansUdB16);
          expect(ws2.getCell('B1').alignment).to.deep.equal(
            testUtils.styles.namedAlignments.middleCentre,
          );
          expect(ws2.getCell('A2').font).to.deep.equal(testUtils.styles.fonts.broadwayRedOutline20);
          expect(ws2.getCell('B2').font).to.deep.equal(testUtils.styles.fonts.broadwayRedOutline20);
          expect(ws2.getCell('C2').font).to.deep.equal(testUtils.styles.fonts.broadwayRedOutline20);
          expect(ws2.getCell('B3').font).to.deep.equal(testUtils.styles.fonts.comicSansUdB16);
          expect(ws2.getCell('B3').alignment).to.deep.equal(
            testUtils.styles.namedAlignments.middleCentre,
          );

          expect(ws2.getColumn(2).font).to.deep.equal(testUtils.styles.fonts.comicSansUdB16);
          expect(ws2.getColumn(2).alignment).to.deep.equal(
            testUtils.styles.namedAlignments.middleCentre,
          );
          expect(ws2.getColumn(2).width).to.equal(9);

          expect(ws2.getColumn(4).width).to.equal(undefined);

          expect(ws2.getRow(2).font).to.deep.equal(testUtils.styles.fonts.broadwayRedOutline20);
        });
    });

    it('rich text', () => {
      const options = {
        filename: TEST_XLSX_FILE_NAME,
        useStyles: true,
      };
      const wb = new ExcelJS.stream.xlsx.WorkbookWriter(options);
      const ws = wb.addWorksheet('Hello');

      ws.getCell('A1').value = {
        richText: [
          {
            font: {color: {argb: 'FF0000'}},
            text: 'red ',
          },
          {
            font: {color: {argb: '00FF00'}, bold: true},
            text: ' bold green',
          },
        ],
      };

      ws.getCell('B1').value = 'plain text';

      ws.commit();
      return wb
        .commit()
        .then(() => {
          const wb2 = new ExcelJS.Workbook();
          return wb2.xlsx.readFile(TEST_XLSX_FILE_NAME);
        })
        .then(wb2 => {
          const ws2 = wb2.getWorksheet('Hello');
          expect(ws2.getCell('A1').value).to.deep.equal({
            richText: [
              {
                font: {color: {argb: 'FF0000'}},
                text: 'red ',
              },
              {
                font: {color: {argb: '00FF00'}, bold: true},
                text: ' bold green',
              },
            ],
          });
          expect(ws2.getCell('B1').value).to.equal('plain text');
        });
    });

    it('table', () => {
      const options = {
        filename: TEST_XLSX_FILE_NAME,
        useStyles: true,
      };
      const wb = new ExcelJS.stream.xlsx.WorkbookWriter(options);
      const ws = wb.addWorksheet('Hello');
      addTable('A1', ws);

      ws.commit();
      return wb
        .commit()
        .then(() => {
          const wb2 = new ExcelJS.Workbook();
          return wb2.xlsx.readFile(TEST_XLSX_FILE_NAME);
        })
        .then(wb2 => {
          const ws2 = wb2.getWorksheet('Hello');
          checkTable('A1', ws2, defaultTableValues);
        });
    });

    it('table commiting', () => {
      const options = {
        filename: TEST_XLSX_FILE_NAME,
        useStyles: true,
      };
      const wb = new ExcelJS.stream.xlsx.WorkbookWriter(options);
      const ws = wb.addWorksheet('Hello');
      const table = addTable('A1', ws);

      expect(() => {
        table.headerRow = false;
      }).to.throw();

      expect(() => {
        table.ref = 'A2';
      }).to.throw();

      expect(() => {
        table.addColumn({name: 'Some extra column'});
      }).to.throw();

      expect(() => {
        table.removeColumns(2);
      }).to.throw();

      expect(() => {
        table.removeRows(-1);
      }).to.throw();

      expect(() => {
        table.addRow(defaultTableValues[1], 0);
      }).to.throw();

      table.addRow(defaultTableValues[1]);
      table.addRow(defaultTableValues[2], 4);
      table.addRow(defaultTableValues[3], 4);
      table.addRow(defaultTableValues[4], 4);

      table.commit();
      ws.commit();
      return wb
        .commit()
        .then(() => {
          const wb2 = new ExcelJS.Workbook();
          return wb2.xlsx.readFile(TEST_XLSX_FILE_NAME);
        })
        .then(wb2 => {
          const ws2 = wb2.getWorksheet('Hello');
          const rows = [...defaultTableValues]
            .splice(0, 5)
            .concat([...defaultTableValues].splice(1, 4).reverse())
            .concat([defaultTableValues[5]]);
          checkTable('A1', ws2, rows);
        });
    });

    it('A lot of sheets', function () {
      this.timeout(5000);

      let i;
      const wb = new ExcelJS.stream.xlsx.WorkbookWriter({
        filename: TEST_XLSX_FILE_NAME,
      });
      const numSheets = 90;
      // add numSheets sheets
      for (i = 1; i <= numSheets; i++) {
        const ws = wb.addWorksheet(`sheet${i}`);
        ws.getCell('A1').value = i;
      }
      return wb
        .commit()
        .then(() => {
          const wb2 = new ExcelJS.Workbook();
          return wb2.xlsx.readFile(TEST_XLSX_FILE_NAME);
        })
        .then(wb2 => {
          for (i = 1; i <= numSheets; i++) {
            const ws2 = wb2.getWorksheet(`sheet${i}`);
            expect(ws2).to.be.ok();
            expect(ws2.getCell('A1').value).to.equal(i);
          }
        });
    });

    it('addRow', () => {
      const options = {
        stream: fs.createWriteStream(TEST_XLSX_FILE_NAME, {flags: 'w'}),
        useStyles: true,
        useSharedStrings: true,
      };
      const workbook = new ExcelJS.stream.xlsx.WorkbookWriter(options);
      const worksheet = workbook.addWorksheet('test');
      const newRow = worksheet.addRow(['hello']);
      newRow.commit();
      worksheet.commit();
      return workbook.commit();
    });

    it('defined names', () => {
      const wb = new ExcelJS.stream.xlsx.WorkbookWriter({
        filename: TEST_XLSX_FILE_NAME,
      });
      const ws = wb.addWorksheet('blort');
      ws.getCell('A1').value = 5;
      ws.getCell('A1').name = 'five';

      ws.getCell('A3').value = 'drei';
      ws.getCell('A3').name = 'threes';
      ws.getCell('B3').value = 'trois';
      ws.getCell('B3').name = 'threes';
      ws.getCell('B3').value = 'san';
      ws.getCell('B3').name = 'threes';

      ws.getCell('E1').value = 'grün';
      ws.getCell('E1').name = 'greens';
      ws.getCell('E2').value = 'vert';
      ws.getCell('E2').name = 'greens';
      ws.getCell('E3').value = 'verde';
      ws.getCell('E3').name = 'greens';

      return wb
        .commit()
        .then(() => {
          const wb2 = new ExcelJS.Workbook();
          return wb2.xlsx.readFile(TEST_XLSX_FILE_NAME);
        })
        .then(wb2 => {
          const ws2 = wb2.getWorksheet('blort');
          expect(ws2.getCell('A1').name).to.equal('five');

          expect(ws2.getCell('A3').name).to.equal('threes');
          expect(ws2.getCell('B3').name).to.equal('threes');
          expect(ws2.getCell('B3').name).to.equal('threes');

          expect(ws2.getCell('E1').name).to.equal('greens');
          expect(ws2.getCell('E2').name).to.equal('greens');
          expect(ws2.getCell('E3').name).to.equal('greens');
        });
    });

    it('does not escape special xml characters', () => {
      const wb = new ExcelJS.stream.xlsx.WorkbookWriter({
        filename: TEST_XLSX_FILE_NAME,
        useSharedStrings: true,
      });
      const ws = wb.addWorksheet('blort');
      const xmlCharacters = 'xml characters: & < > "';

      ws.getCell('A1').value = xmlCharacters;

      return wb
        .commit()
        .then(() => {
          const wb2 = new ExcelJS.Workbook();
          return wb2.xlsx.readFile(TEST_XLSX_FILE_NAME);
        })
        .then(wb2 => {
          const ws2 = wb2.getWorksheet('blort');
          expect(ws2.getCell('A1').value).to.equal(xmlCharacters);
        });
    });

    it('serializes and deserializes dataValidations', () => {
      const options = {filename: TEST_XLSX_FILE_NAME};
      const wb = testUtils.createTestBook(new ExcelJS.stream.xlsx.WorkbookWriter(options), 'xlsx', [
        'dataValidations',
      ]);

      return wb
        .commit()
        .then(() => {
          const wb2 = new ExcelJS.Workbook();
          return wb2.xlsx.readFile(TEST_XLSX_FILE_NAME);
        })
        .then(wb2 => {
          testUtils.checkTestBook(wb2, 'xlsx', ['dataValidations']);
        });
    });

    it('with zip compression option', () => {
      const options = {
        filename: TEST_XLSX_FILE_NAME,
        useStyles: true,
        zip: {
          zlib: {level: 9}, // Sets the compression level.
        },
      };
      const wb = testUtils.createTestBook(new ExcelJS.stream.xlsx.WorkbookWriter(options), 'xlsx', [
        'dataValidations',
      ]);

      return wb
        .commit()
        .then(() => {
          const wb2 = new ExcelJS.Workbook();
          return wb2.xlsx.readFile(TEST_XLSX_FILE_NAME);
        })
        .then(wb2 => {
          testUtils.checkTestBook(wb2, 'xlsx', ['dataValidations']);
        });
    });

    it('writes notes', async () => {
      const options = {
        filename: TEST_XLSX_FILE_NAME,
      };
      const wb = new ExcelJS.stream.xlsx.WorkbookWriter(options);
      const ws = wb.addWorksheet('Hello');
      ws.getCell('B2').value = 5;
      ws.getCell('B2').note = 'five';

      const note = {
        texts: [
          {
            font: {
              size: 12,
              color: {argb: 'FFFF6600'},
              name: 'Calibri',
              scheme: 'minor',
            },
            text: 'seven',
          },
        ],
        margins: {
          insetmode: 'auto',
          inset: [0.13, 0.13, 0.25, 0.25],
        },
        protection: {
          locked: 'True',
          lockText: 'True',
        },
        editAs: 'twoCells',
      };
      ws.getCell('D2').value = 7;
      ws.getCell('D2').note = note;

      await wb.commit();

      const wb2 = new ExcelJS.Workbook();
      await wb2.xlsx.readFile(TEST_XLSX_FILE_NAME);
      const ws2 = wb2.getWorksheet('Hello');

      expect(ws2.getCell('B2').value).to.equal(5);
      expect(ws2.getCell('B2').note).to.equal('five');
      expect(ws2.getCell('D2').value).to.equal(7);
      expect(ws2.getCell('D2').note.texts).to.deep.equal(note.texts);
      expect(ws2.getCell('D2').note.margins).to.deep.equal(note.margins);
      expect(ws2.getCell('D2').note.protection).to.deep.equal(note.protection);
      expect(ws2.getCell('D2').note.editAs).to.deep.equal(note.editAs);
    });

    it('Cell annotation supports setting margins and protection properties', async () => {
      const options = {
        filename: TEST_XLSX_FILE_NAME,
      };
      const wb = new ExcelJS.stream.xlsx.WorkbookWriter(options);
      const ws = wb.addWorksheet('Hello');
      ws.getCell('B2').value = 5;
      ws.getCell('B2').note = 'five';
      const note = {
        texts: [
          {
            font: {
              size: 12,
              color: {argb: 'FFFF6600'},
              name: 'Calibri',
              scheme: 'minor',
            },
            text: 'seven',
          },
        ],
        margins: {
          insetmode: 'custom',
          inset: [0.25, 0.25, 0.35, 0.35],
        },
        protection: {
          locked: 'False',
          lockText: 'False',
        },
        editAs: 'oneCells',
        autoShape: true,
      };
      ws.getCell('D2').value = 7;
      ws.getCell('D2').note = note;

      await wb.commit();

      const wb2 = new ExcelJS.Workbook();
      await wb2.xlsx.readFile(TEST_XLSX_FILE_NAME);
      const ws2 = wb2.getWorksheet('Hello');
      expect(ws2.getCell('B2').value).to.equal(5);
      expect(ws2.getCell('B2').note).to.equal('five');

      expect(ws2.getCell('D2').value).to.equal(7);
      expect(ws2.getCell('D2').note.texts).to.deep.equal(note.texts);
      expect(ws2.getCell('D2').note.margins).to.deep.equal(note.margins);
      expect(ws2.getCell('D2').note.protection).to.deep.equal(note.protection);
      expect(ws2.getCell('D2').note.editAs).to.deep.equal(note.editAs);
    });

    it('with background image', async () => {
      const options = {
        filename: TEST_XLSX_FILE_NAME,
      };
      const wb = new ExcelJS.stream.xlsx.WorkbookWriter(options);
      const ws = wb.addWorksheet('Hello');

      const imageId = wb.addImage({
        filename: IMAGE_FILENAME,
        extension: 'jpeg',
      });
      ws.getCell('A1').value = 'Hello, World!';
      ws.addBackgroundImage(imageId);

      await wb.commit();

      const wb2 = new ExcelJS.Workbook();
      await wb2.xlsx.readFile(TEST_XLSX_FILE_NAME);
      const ws2 = wb2.getWorksheet('Hello');

      const backgroundId2 = ws2.getBackgroundImageId();
      const image = wb2.getImage(backgroundId2);
      const imageData = await fsReadFileAsync(IMAGE_FILENAME);
      expect(Buffer.compare(imageData, image.buffer)).to.equal(0);
    });

    it('with background image where worksheet is commited in advance', async () => {
      const options = {
        filename: TEST_XLSX_FILE_NAME,
      };
      const wb = new ExcelJS.stream.xlsx.WorkbookWriter(options);
      const ws = wb.addWorksheet('Hello');

      const imageId = wb.addImage({
        filename: IMAGE_FILENAME,
        extension: 'jpeg',
      });
      ws.getCell('A1').value = 'Hello, World!';
      ws.addBackgroundImage(imageId);

      await ws.commit();
      await wb.commit();

      const wb2 = new ExcelJS.Workbook();
      await wb2.xlsx.readFile(TEST_XLSX_FILE_NAME);
      const ws2 = wb2.getWorksheet('Hello');

      const backgroundId2 = ws2.getBackgroundImageId();
      const image = wb2.getImage(backgroundId2);
      const imageData = await fsReadFileAsync(IMAGE_FILENAME);
      expect(Buffer.compare(imageData, image.buffer)).to.equal(0);
    });

    it('with conditional formatting', async () => {
      const options = {
        filename: TEST_XLSX_FILE_NAME,
        useStyles: true,
        useSharedStrings: true,
      };
      const wb = testUtils.createTestBook(new ExcelJS.stream.xlsx.WorkbookWriter(options), 'xlsx', [
        'conditionalFormatting',
      ]);

      return wb
        .commit()
        .then(() => {
          const wb2 = new ExcelJS.Workbook();
          return wb2.xlsx.readFile(TEST_XLSX_FILE_NAME);
        })
        .then(wb2 => {
          testUtils.checkTestBook(wb2, 'xlsx', ['conditionalFormatting']);
        });
    });

    it('with conditional formatting that contains numFmt (#1814)', async () => {
      const sheet = 'conditionalFormatting';
      const options = {filename: TEST_XLSX_FILE_NAME, useStyles: true};

      // generate file with conditional formatting that contains styles with numFmt
      const wb1 = new ExcelJS.stream.xlsx.WorkbookWriter(options);
      const ws1 = wb1.addWorksheet(sheet);
      const cf1 = testUtils.conditionalFormatting.abbreviation;
      ws1.addConditionalFormatting(cf1);
      await wb1.commit();

      // read generated file and extract saved conditional formatting rule
      const wb2 = new ExcelJS.Workbook();
      await wb2.xlsx.readFile(TEST_XLSX_FILE_NAME);
      const ws2 = wb2.getWorksheet(sheet);
      const [cf2] = ws2.conditionalFormattings;

      // verify that rules from generated file contain styles with valid numFmt
      cf2.rules.forEach(rule => {
        expect(rule.style.numFmt).to.exist();
        expect(rule.style.numFmt.id).to.be.a('number');
        expect(rule.style.numFmt.formatCode).to.be.a('string');
      });
    });

    it('with images added to worksheet (PR #2201)', async () => {
      const options = {
        filename: TEST_XLSX_FILE_NAME,
        useStyles: true,
      };
      const wb = new ExcelJS.stream.xlsx.WorkbookWriter(options);
      const ws1 = wb.addWorksheet('Sheet1');
      const ws2 = wb.addWorksheet('Sheet2');

      const imageId = wb.addImage({
        filename: IMAGE_FILENAME,
        extension: 'png',
      });

      const sheetImageId1 = ws1.addImage(imageId, 'B2:D6');
      expect(sheetImageId1).to.be.a('string');
      expect(ws1.getImages().length).to.equal(1);

      const sheetImageId2 = ws2.addImage(imageId, {
        tl: {col: 0.25, row: 0.7},
        ext: {width: 160, height: 60},
      });
      expect(sheetImageId2).to.be.a('string');
      expect(ws2.getImages().length).to.equal(1);

      await ws1.commit();
      await ws2.commit();
      await wb.commit();

      const wb2 = new ExcelJS.Workbook();
      await wb2.xlsx.readFile(TEST_XLSX_FILE_NAME);

      const readWs1 = wb2.getWorksheet('Sheet1');
      const readWs2 = wb2.getWorksheet('Sheet2');

      const images1 = readWs1.getImages();
      expect(images1.length).to.equal(1);
      expect(images1[0].imageId).to.equal(imageId);
      expect(images1[0].range.tl.nativeCol).to.equal(1);
      expect(images1[0].range.tl.nativeRow).to.equal(1);
      expect(images1[0].range.br.nativeCol).to.equal(4);
      expect(images1[0].range.br.nativeRow).to.equal(6);

      const images2 = readWs2.getImages();
      expect(images2.length).to.equal(1);
      expect(images2[0].imageId).to.equal(imageId);
      expect(images2[0].range.tl.nativeCol).to.equal(0);
      expect(images2[0].range.tl.nativeRow).to.equal(0);
      expect(images2[0].range.ext.width).to.equal(160);
      expect(images2[0].range.ext.height).to.equal(60);

      const readImage = wb2.getImage(images1[0].imageId);
      const expectedImageData = await fsReadFileAsync(IMAGE_FILENAME);
      expect(Buffer.compare(expectedImageData, readImage.buffer)).to.equal(0);
    });

    it('writes rows asynchronously with await row.commit() and await worksheet.commit() (PR #2558)', async () => {
      const writeStream = fs.createWriteStream(TEST_XLSX_FILE_NAME, {
        flags: 'w',
      });
      const wb = new ExcelJS.stream.xlsx.WorkbookWriter({stream: writeStream});
      const ws = wb.addWorksheet('test');

      const headers = Array.from({length: 10}, (_, i) => `test${i + 1}`);
      for (let i = 0; i < 50; i++) {
        const rowValues = headers.map(header => `${header}|${i}`);
        await ws.addRow(rowValues).commit();
      }

      await ws.commit();
      await wb.commit();

      const wb2 = new ExcelJS.Workbook();
      await wb2.xlsx.readFile(TEST_XLSX_FILE_NAME);
      const ws2 = wb2.getWorksheet('test');
      expect(ws2.rowCount).to.equal(50);
      expect(ws2.getCell('A1').value).to.equal('test1|0');
      expect(ws2.getCell('J50').value).to.equal('test10|49');
    });

    it('preserves multiple print areas across write and read (PR #1971)', async () => {
      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet('test sheet');
      ws.getCell('A1').value = 'Header';
      ws.pageSetup.printArea = 'A1:B5&&A6:B10';

      await wb.xlsx.writeFile(TEST_XLSX_FILE_NAME);

      const wb2 = new ExcelJS.Workbook();
      await wb2.xlsx.readFile(TEST_XLSX_FILE_NAME);
      const ws2 = wb2.getWorksheet('test sheet');
      expect(ws2.pageSetup.printArea).to.equal('A1:B5&&A6:B10');
    });

    it('writes styled workbooks with stylesCacheMode FAST_MAP and JSON_MAP (PR #2867)', async () => {
      for (const mode of ['FAST_MAP', 'JSON_MAP', 'NO_CACHE', 'WEAK_MAP']) {
        const wb = new ExcelJS.stream.xlsx.WorkbookWriter({
          filename: TEST_XLSX_FILE_NAME,
          useStyles: true,
          stylesCacheMode: mode,
        });
        const ws = wb.addWorksheet('Styled');
        ws.getColumn(1).style = {numFmt: '0.00'};
        const row = ws.addRow([42.5, 'Text']);
        row.getCell(1).addStyle({font: {bold: true, name: 'Arial', size: 12}});
        row.getCell(2).style = {
          alignment: {horizontal: 'center'},
          fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'FFFF0000'},
          },
        };
        row.commit();
        ws.commit();
        await wb.commit();

        const wb2 = new ExcelJS.Workbook();
        await wb2.xlsx.readFile(TEST_XLSX_FILE_NAME);
        const ws2 = wb2.getWorksheet('Styled');
        expect(ws2.getCell('A1').value).to.equal(42.5);
        expect(ws2.getCell('A1').numFmt).to.equal('0.00');
        expect(ws2.getCell('A1').font.bold).to.equal(true);
        expect(ws2.getCell('B1').alignment.horizontal).to.equal('center');
        expect(ws2.getCell('B1').fill.fgColor.argb).to.equal('FFFF0000');
      }
    });
  });
});
