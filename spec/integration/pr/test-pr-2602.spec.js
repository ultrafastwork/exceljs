import ExcelJS from '../../../lib/exceljs.nodejs.js';

describe('PR #2602 - Parse page breaks', () => {
  it('reads and parses row page breaks into the worksheet model', async () => {
    const wb1 = new ExcelJS.Workbook();
    const ws1 = wb1.addWorksheet('row-breaks');
    ws1.getCell('A1').value = 'A1';
    ws1.getCell('A2').value = 'A2';
    ws1.getCell('A3').value = 'A3';
    ws1.getCell('A4').value = 'A4';
    ws1.getRow(2).addPageBreak();

    expect(ws1.rowBreaks).to.be.an('array');
    expect(ws1.rowBreaks.length).to.equal(1);
    expect(ws1.rowBreaks[0].id).to.equal(2);

    const buffer = await wb1.xlsx.writeBuffer();

    const wb2 = new ExcelJS.Workbook();
    await wb2.xlsx.load(buffer);
    const ws2 = wb2.getWorksheet('row-breaks');

    expect(ws2.rowBreaks).to.be.an('array');
    expect(ws2.rowBreaks.length).to.equal(1);
    expect(ws2.rowBreaks[0].id).to.equal(2);
    expect(ws2.rowBreaks[0].man).to.equal(1);

    // Can add another page break to loaded sheet
    ws2.getRow(4).addPageBreak();
    expect(ws2.rowBreaks.length).to.equal(2);

    const buffer2 = await wb2.xlsx.writeBuffer();
    const wb3 = new ExcelJS.Workbook();
    await wb3.xlsx.load(buffer2);
    const ws3 = wb3.getWorksheet('row-breaks');
    expect(ws3.rowBreaks.length).to.equal(2);
    expect(ws3.rowBreaks[0].id).to.equal(2);
    expect(ws3.rowBreaks[1].id).to.equal(4);
  });
});
