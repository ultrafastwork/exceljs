const ExcelJS = verquire('exceljs');
const JSZip = require('jszip');
const {Readable} = require('readable-stream');

describe('github issues: WorkbookReader early termination in Node 22', () => {
  it('should parse xlsx where worksheets appear before workbook.xml', async () => {
    // 1. Create a simple workbook
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Sheet1');
    sheet.getCell('A1').value = 'Hello World';
    sheet.getCell('B2').value = 42;

    const originalBuffer = await workbook.xlsx.writeBuffer();

    // 2. Read entries from original zip
    const originalZip = await JSZip.loadAsync(originalBuffer);

    // 3. Create a new zip with a custom entry order where worksheets are added BEFORE xl/workbook.xml
    const reorderedZip = new JSZip();

    // Partition keys so worksheets come first, then others, and xl/workbook.xml comes last
    const keys = Object.keys(originalZip.files);
    const worksheetKeys = keys.filter(k => k.includes('xl/worksheets/'));
    const otherKeys = keys.filter(k => !k.includes('xl/worksheets/') && k !== 'xl/workbook.xml');

    const filePromises = [];

    // First add worksheets
    for (const key of worksheetKeys) {
      const file = originalZip.files[key];
      if (!file.dir) {
        filePromises.push(
          file.async('nodebuffer').then(data => {
            reorderedZip.file(key, data);
          })
        );
      }
    }

    // Then add other non-workbook files
    for (const key of otherKeys) {
      const file = originalZip.files[key];
      if (!file.dir) {
        filePromises.push(
          file.async('nodebuffer').then(data => {
            reorderedZip.file(key, data);
          })
        );
      }
    }

    await Promise.all(filePromises);

    // Finally add xl/workbook.xml
    const workbookXmlData = await originalZip.files['xl/workbook.xml'].async('nodebuffer');
    reorderedZip.file('xl/workbook.xml', workbookXmlData);

    // 4. Generate the reordered ZIP buffer
    const reorderedBuffer = await reorderedZip.generateAsync({type: 'nodebuffer'});

    // 5. Read the reordered ZIP buffer using WorkbookReader
    const stream = new Readable();
    stream._read = () => {};
    stream.push(reorderedBuffer);
    stream.push(null);

    const workbookReader = new ExcelJS.stream.xlsx.WorkbookReader(stream, {
      worksheets: 'emit',
      sharedStrings: 'cache',
      styles: 'cache',
    });

    const worksheetRows = [];

    await new Promise((resolve, reject) => {
      workbookReader.read();
      workbookReader.on('worksheet', worksheet => {
        worksheet.on('row', row => {
          worksheetRows.push(row.values);
        });
      });
      workbookReader.on('end', resolve);
      workbookReader.on('error', reject);
    });

    // 6. Assertions
    expect(worksheetRows.length).to.equal(2);
    expect(worksheetRows[0][1]).to.equal('Hello World');
    expect(worksheetRows[1][2]).to.equal(42);
  });
});
