const JSZip = require('jszip');

const ExcelJS = verquire('exceljs');

describe('github issues', () => {
  it('pr 2807 - places pageSetUpPr at the end of sheetPr', async () => {
    const wb = new ExcelJS.Workbook();
    wb.creator = 'Me';

    const ws = wb.addWorksheet('My Sheet', {
      properties: {
        tabColor: {argb: 'FFFF0000'},
        outlineProperties: {summaryBelow: false},
      },
      pageSetup: {
        paperSize: 9,
        orientation: 'landscape',
        fitToPage: true,
        fitToHeight: 0,
      },
    });
    expect(ws).to.be.ok();

    const buffer = await wb.xlsx.writeBuffer();
    const zip = await JSZip.loadAsync(buffer);
    const sheetXml = await zip.file('xl/worksheets/sheet1.xml').async('string');

    const sheetPrMatch = sheetXml.match(/<sheetPr>[\s\S]*?<\/sheetPr>/);
    expect(sheetPrMatch).to.be.ok();
    expect(sheetPrMatch[0]).to.equal(
      '<sheetPr><tabColor rgb="FFFF0000"/><outlinePr summaryBelow="0"/><pageSetUpPr fitToPage="1"/></sheetPr>',
    );

    const readWb = new ExcelJS.Workbook();
    await readWb.xlsx.load(buffer);
    const readWs = readWb.getWorksheet('My Sheet');
    expect(readWs.pageSetup.fitToPage).to.equal(true);
    expect(readWs.properties.outlineProperties.summaryBelow).to.equal(false);
  });
});
