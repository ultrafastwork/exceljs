// Runs in a real browser against the built bundles (see ./run.js).
// `ExcelJS` and `expect` are globals provided by the test page.

describe('ExcelJS (browser)', () => {
  function createWorkbook() {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('blort');
    ws.getCell('A1').value = 'Hello, World!';
    ws.getCell('A2').value = 7;
    return wb;
  }

  it('reads and writes xlsx via binary buffer', async () => {
    const buffer = await createWorkbook().xlsx.writeBuffer();

    const wb2 = new ExcelJS.Workbook();
    await wb2.xlsx.load(buffer);
    const ws2 = wb2.getWorksheet('blort');
    expect(ws2).to.be.ok;
    expect(ws2.getCell('A1').value).to.equal('Hello, World!');
    expect(ws2.getCell('A2').value).to.equal(7);
  });

  it('reads compressed xlsx via blob streaming', async () => {
    const buffer = await createWorkbook().xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const values = [];
    for await (const worksheetReader of new ExcelJS.stream.xlsx.WorkbookReader(blob)) {
      expect(worksheetReader.name).to.equal('blort');
      for await (const row of worksheetReader) {
        values.push(row.getCell('A').value);
      }
    }
    expect(values).to.deep.equal(['Hello, World!', 7]);
  });

  it('reads and writes xlsx via base64 buffer', async () => {
    const options = {base64: true};
    const buffer = await createWorkbook().xlsx.writeBuffer(options);

    const wb2 = new ExcelJS.Workbook();
    await wb2.xlsx.load(buffer.toString('base64'), options);
    const ws2 = wb2.getWorksheet('blort');
    expect(ws2.getCell('A1').value).to.equal('Hello, World!');
    expect(ws2.getCell('A2').value).to.equal(7);
  });

  it('round-trips non-ASCII text', async () => {
    const text = 'Grüße, 世界 👋';
    const wb = new ExcelJS.Workbook();
    wb.addWorksheet('ünïcödé').getCell('A1').value = text;

    const wb2 = new ExcelJS.Workbook();
    await wb2.xlsx.load(await wb.xlsx.writeBuffer());
    expect(wb2.getWorksheet('ünïcödé').getCell('A1').value).to.equal(text);
  });

  it('protects a worksheet with a hashed password', async () => {
    const wb = createWorkbook();
    const ws = wb.getWorksheet('blort');
    await ws.protect('secret', {spinCount: 1000});
    expect(ws.sheetProtection.algorithmName).to.equal('SHA-512');
    expect(ws.sheetProtection.saltValue).to.have.length(24);
    expect(ws.sheetProtection.hashValue).to.have.length(88);

    const wb2 = new ExcelJS.Workbook();
    await wb2.xlsx.load(await wb.xlsx.writeBuffer());
    expect(wb2.getWorksheet('blort').sheetProtection.hashValue).to.equal(
      ws.sheetProtection.hashValue,
    );
  });

  it('writes csv via buffer', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('blort');
    ws.getCell('A1').value = 'Hello, World!';
    ws.getCell('B1').value = 'What time is it?';
    ws.getCell('A2').value = 7;
    ws.getCell('B2').value = '12pm';

    const buffer = await wb.csv.writeBuffer();
    expect(buffer.toString()).to.equal('"Hello, World!",What time is it?\n7,12pm');
  });
});
