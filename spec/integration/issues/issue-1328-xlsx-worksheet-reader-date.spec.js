const ExcelJS = verquire('exceljs');
const fs = require('fs');
const JSZip = require('jszip');
const {PassThrough} = require('readable-stream');

describe('github issues: Date field with cache style', () => {
  const rows = [];
  beforeEach(
    () =>
      new Promise((resolve, reject) => {
        rows.length = 0;
        const workbookReader = new ExcelJS.stream.xlsx.WorkbookReader(
          fs.createReadStream('./spec/integration/data/dateIssue.xlsx'),
          {
            worksheets: 'emit',
            styles: 'cache',
            sharedStrings: 'cache',
            hyperlinks: 'ignore',
            entries: 'ignore',
          },
        );
        workbookReader.read();
        workbookReader.on('worksheet', worksheet =>
          worksheet.on('row', row => rows.push(row.values[1])),
        );
        workbookReader.on('end', resolve);
        workbookReader.on('error', reject);
      }),
  );
  it('issue 1328 - should emit row with Date Object', () => {
    expect(rows).that.deep.equals(['Date', new Date('2020-11-20T00:00:00.000Z')]);
  });

  it('PR 1570 / issue 1430 - should parse dates and sheet name when styles.xml and workbook.xml appear after worksheet in zip', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('DateSheet');
    ws.getCell('A1').value = 'Header';
    ws.getCell('A2').value = new Date('2020-11-20T00:00:00.000Z');
    ws.getCell('A2').numFmt = 'yyyy-mm-dd';
    const buf = await wb.xlsx.writeBuffer();

    const originalZip = await JSZip.loadAsync(buf);
    const reorderedZip = new JSZip();

    // Put workbook.xml.rels, sharedStrings.xml, and sheet1.xml BEFORE styles.xml and workbook.xml
    const firstKeys = [
      '[Content_Types].xml',
      '_rels/.rels',
      'xl/_rels/workbook.xml.rels',
      'xl/sharedStrings.xml',
      'xl/worksheets/sheet1.xml',
    ];
    for (const key of firstKeys) {
      if (originalZip.files[key] && !originalZip.files[key].dir) {
        // eslint-disable-next-line no-await-in-loop
        reorderedZip.file(key, await originalZip.files[key].async('nodebuffer'));
      }
    }
    for (const key of Object.keys(originalZip.files)) {
      const file = originalZip.files[key];
      if (!file.dir && !firstKeys.includes(key)) {
        // eslint-disable-next-line no-await-in-loop
        reorderedZip.file(key, await file.async('nodebuffer'));
      }
    }

    const reorderedBuf = await reorderedZip.generateAsync({type: 'nodebuffer'});
    const stream = new PassThrough();
    stream.end(reorderedBuf);

    const parsedValues = [];
    let sheetName = null;
    await new Promise((resolve, reject) => {
      const reader = new ExcelJS.stream.xlsx.WorkbookReader(stream, {
        worksheets: 'emit',
        styles: 'cache',
        sharedStrings: 'cache',
      });
      reader.on('worksheet', worksheet => {
        sheetName = worksheet.name;
        worksheet.on('row', row => parsedValues.push(row.values[1]));
      });
      reader.on('end', resolve);
      reader.on('error', reject);
      reader.read();
    });

    expect(sheetName).to.equal('DateSheet');
    expect(parsedValues).to.deep.equal(['Header', new Date('2020-11-20T00:00:00.000Z')]);
  });
});
