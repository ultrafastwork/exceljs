const fs = require('fs');
const JSZip = require('jszip');

const ExcelJS = verquire('exceljs');

const TEST_XLSX_FILE_NAME = './spec/out/test-pr-2803.xlsx';

describe('github issues', () => {
  it('pull request 2803 - conditional formatting before hyperlinks in WorkbookWriter', async () => {
    const wb = new ExcelJS.stream.xlsx.WorkbookWriter({
      filename: TEST_XLSX_FILE_NAME,
      useSharedStrings: false,
      useStyles: true,
    });
    const ws = wb.addWorksheet('Sheet1');

    for (let index = 0; index < 4; index++) {
      ws.addRow([
        'test',
        {
          text: 'Link',
          hyperlink: 'https://google.com',
          tooltip: 'https://google.com',
        },
      ]);
    }

    ws.addConditionalFormatting({
      ref: 'A1:B4',
      rules: [
        {
          priority: 1,
          type: 'expression',
          formulae: ['MOD(ROW(),2)=0'],
          style: {
            fill: {
              type: 'pattern',
              pattern: 'solid',
              bgColor: {argb: 'FFEDEDED'},
            },
          },
        },
      ],
    });

    ws.commit();
    await wb.commit();

    const data = fs.readFileSync(TEST_XLSX_FILE_NAME);
    const zip = await JSZip.loadAsync(data);
    const sheetXml = await zip.file('xl/worksheets/sheet1.xml').async('string');

    const iConditionalFormatting = sheetXml.indexOf('<conditionalFormatting');
    const iHyperlinks = sheetXml.indexOf('<hyperlinks>');
    expect(iConditionalFormatting).to.not.equal(-1);
    expect(iHyperlinks).to.not.equal(-1);
    expect(iConditionalFormatting).to.be.lessThan(iHyperlinks);

    const wb2 = new ExcelJS.Workbook();
    await wb2.xlsx.readFile(TEST_XLSX_FILE_NAME);
    const ws2 = wb2.getWorksheet('Sheet1');
    expect(ws2.getCell('B1').hyperlink).to.equal('https://google.com');
    expect(ws2.conditionalFormattings).to.have.lengthOf(1);
    expect(ws2.conditionalFormattings[0].ref).to.equal('A1:B4');
  });
});
