'use strict';

const ExcelJS = verquire('exceljs');

const TEST_XLSX_FILE_NAME = './spec/out/test-pr-2664.xlsx';

describe('PR #2664 - Worksheet protect(): fix types and support no arguments', () => {
  it('protect works without passing any arguments in standard workbook', async () => {
    const wb = new ExcelJS.Workbook();
    const ws1 = wb.addWorksheet('Protected');
    expect(ws1.name).to.equal('Protected');
    ws1.getCell('A1').value = 'Protected';

    const ws2 = wb.addWorksheet();
    expect(ws2.name).to.match(/sheet\d+/);
    ws2.getCell('A1').value = ws2.name;

    wb.addWorksheet('Unprotected');

    ws1.getCell('A1').protection = {
      locked: true,
    };

    await ws1.protect();

    await wb.xlsx.writeFile(TEST_XLSX_FILE_NAME);

    const wb2 = new ExcelJS.Workbook();
    await wb2.xlsx.readFile(TEST_XLSX_FILE_NAME);

    expect(wb2.getWorksheet('Protected')).to.be.ok();
    expect(wb2.getWorksheet('Unprotected')).to.be.ok();
    expect(wb2.getWorksheet('Protected').sheetProtection.sheet).to.equal(true);
  });

  it('protect works without passing any arguments in streaming workbook writer', async () => {
    const streamFilename = './spec/out/test-pr-2664-stream.xlsx';
    const wb = new ExcelJS.stream.xlsx.WorkbookWriter({
      filename: streamFilename,
    });
    const ws = wb.addWorksheet('ProtectedStream');
    ws.addRow(['protected cell']);
    ws.getRow(1).getCell(1).protection = {locked: true};

    await ws.protect();
    await wb.commit();

    const checkBook = new ExcelJS.Workbook();
    await checkBook.xlsx.readFile(streamFilename);
    const checkSheet = checkBook.getWorksheet('ProtectedStream');
    expect(checkSheet.sheetProtection.sheet).to.equal(true);
  });
});
