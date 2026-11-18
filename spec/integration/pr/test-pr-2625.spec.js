const ExcelJS = verquire('exceljs');

describe('PR #2625 - Fix splicecolumn mergedcells', () => {
  it('correctly shifts merged cells after deleted columns without inserts', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('test-splice-merges');

    // Row with 2 merged cells: B2:C2 and E2:F2
    ws.getCell('A2').value = 'ColA';
    ws.getCell('B2').value = 'Merge1';
    ws.mergeCells('B2:C2');
    ws.getCell('D2').value = 'ColD';
    ws.getCell('E2').value = 'Merge2';
    ws.mergeCells('E2:F2');
    ws.getCell('G2').value = 'ColG';

    // Delete column A (start = 1, count = 1)
    ws.spliceColumns(1, 1);

    // After deleting column A:
    // What was B2:C2 moves to A2:B2 ('Merge1')
    // What was D2 moves to C2 ('ColD')
    // What was E2:F2 moves to D2:E2 ('Merge2')
    // What was G2 moves to F2 ('ColG')
    expect(ws.getCell('A2').value).to.equal('Merge1');
    expect(ws.getCell('B2').value).to.equal('Merge1');
    expect(ws.getCell('B2').isMerged).to.be.true();
    expect(ws.getCell('C2').value).to.equal('ColD');
    expect(ws.getCell('D2').value).to.equal('Merge2');
    expect(ws.getCell('E2').value).to.equal('Merge2');
    expect(ws.getCell('E2').isMerged).to.be.true();
    expect(ws.getCell('F2').value).to.equal('ColG');

    expect(Object.keys(ws._merges)).to.deep.equal(['A2', 'D2']);
    expect(ws._merges.A2.range).to.equal('A2:B2');
    expect(ws._merges.D2.range).to.equal('D2:E2');

    // Verify round-trip save and load
    const buffer = await wb.xlsx.writeBuffer();
    const wb2 = new ExcelJS.Workbook();
    await wb2.xlsx.load(buffer);
    const ws2 = wb2.getWorksheet('test-splice-merges');

    expect(ws2.getCell('A2').value).to.equal('Merge1');
    expect(ws2.getCell('C2').value).to.equal('ColD');
    expect(ws2.getCell('D2').value).to.equal('Merge2');
    expect(ws2.getCell('F2').value).to.equal('ColG');
    expect(Object.keys(ws2._merges)).to.deep.equal(['A2', 'D2']);
  });

  it('correctly handles spliceColumns deleting first merged range and moving second merged range', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('test-splice-first-merge');

    // Two different merged cells in a row: B2:C2 and E2:F2
    ws.getCell('B2').value = 'FirstMerge';
    ws.mergeCells('B2:C2');
    ws.getCell('D2').value = 'ColD';
    ws.getCell('E2').value = 'SecondMerge';
    ws.mergeCells('E2:F2');

    // Splice columns 2 and 3 (the first merged range)
    ws.spliceColumns(2, 2);

    // First merge should be deleted; ColD moves to B2; SecondMerge (E2:F2) moves to C2:D2
    expect(ws.getCell('B2').value).to.equal('ColD');
    expect(ws.getCell('C2').value).to.equal('SecondMerge');
    expect(ws.getCell('D2').value).to.equal('SecondMerge');
    expect(ws.getCell('D2').isMerged).to.be.true();

    expect(Object.keys(ws._merges)).to.deep.equal(['C2']);
    expect(ws._merges.C2.range).to.equal('C2:D2');

    const buffer = await wb.xlsx.writeBuffer();
    const wb2 = new ExcelJS.Workbook();
    await wb2.xlsx.load(buffer);
    const ws2 = wb2.getWorksheet('test-splice-first-merge');
    expect(ws2.getCell('B2').value).to.equal('ColD');
    expect(ws2.getCell('C2').value).to.equal('SecondMerge');
    expect(Object.keys(ws2._merges)).to.deep.equal(['C2']);
  });

  it('correctly handles spliceColumns inside a merged range (shrinking it)', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('test-shrink-merge');

    // Merge B2:E2 (width 4)
    ws.getCell('B2').value = 'WideMerge';
    ws.mergeCells('B2:E2');
    ws.getCell('F2').value = 'AfterMerge';

    // Delete column C (start = 3, count = 1)
    ws.spliceColumns(3, 1);

    // Merge should shrink to B2:D2 (width 3), and AfterMerge should move to E2
    expect(ws.getCell('B2').value).to.equal('WideMerge');
    expect(ws.getCell('C2').value).to.equal('WideMerge');
    expect(ws.getCell('D2').value).to.equal('WideMerge');
    expect(ws.getCell('E2').value).to.equal('AfterMerge');

    expect(Object.keys(ws._merges)).to.deep.equal(['B2']);
    expect(ws._merges.B2.range).to.equal('B2:D2');

    const buffer = await wb.xlsx.writeBuffer();
    const wb2 = new ExcelJS.Workbook();
    await wb2.xlsx.load(buffer);
    const ws2 = wb2.getWorksheet('test-shrink-merge');
    expect(ws2.getCell('B2').value).to.equal('WideMerge');
    expect(ws2.getCell('E2').value).to.equal('AfterMerge');
    expect(Object.keys(ws2._merges)).to.deep.equal(['B2']);
    expect(ws2._merges.B2.range).to.equal('B2:D2');
  });

  it('correctly shifts merged cells when inserting columns', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('test-insert-merge');

    ws.getCell('B2').value = 'Merge1';
    ws.mergeCells('B2:C2');
    ws.getCell('E2').value = 'Merge2';
    ws.mergeCells('E2:F2');

    // Insert 2 columns at col 2
    ws.spliceColumns(2, 0, [, 'InsRow2a'], [, 'InsRow2b']);

    // What was B2:C2 moves to D2:E2
    // What was E2:F2 moves to G2:H2
    expect(ws.getCell('B2').value).to.equal('InsRow2a');
    expect(ws.getCell('C2').value).to.equal('InsRow2b');
    expect(ws.getCell('D2').value).to.equal('Merge1');
    expect(ws.getCell('E2').value).to.equal('Merge1');
    expect(ws.getCell('G2').value).to.equal('Merge2');
    expect(ws.getCell('H2').value).to.equal('Merge2');

    expect(Object.keys(ws._merges)).to.deep.equal(['D2', 'G2']);
    expect(ws._merges.D2.range).to.equal('D2:E2');
    expect(ws._merges.G2.range).to.equal('G2:H2');

    const buffer = await wb.xlsx.writeBuffer();
    const wb2 = new ExcelJS.Workbook();
    await wb2.xlsx.load(buffer);
    const ws2 = wb2.getWorksheet('test-insert-merge');
    expect(ws2.getCell('B2').value).to.equal('InsRow2a');
    expect(ws2.getCell('D2').value).to.equal('Merge1');
    expect(ws2.getCell('G2').value).to.equal('Merge2');
  });
});
