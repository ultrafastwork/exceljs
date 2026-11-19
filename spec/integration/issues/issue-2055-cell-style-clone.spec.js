import ExcelJS from '../../../lib/exceljs.nodejs.js';

describe('github issues', () => {
  it('issue 2055 - setting cell style attribute clones style object', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Sheet1');

    const initialFill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FFFF0000'},
    };
    const initialFont = {name: 'Arial', size: 12};

    const a1 = ws.getCell('A1');
    a1.value = 1;
    a1.style = {
      fill: initialFill,
      font: initialFont,
      numFmt: '0.00',
    };

    const b1 = ws.getCell('B1');
    b1.value = 2;
    b1.style = a1.style;

    // Write and reload so styles are also shared via styleId
    const buffer = await wb.xlsx.writeBuffer();
    const wb2 = new ExcelJS.Workbook();
    await wb2.xlsx.load(buffer);

    const ws2 = wb2.getWorksheet('Sheet1');
    const a1Loaded = ws2.getCell('A1');
    const b1Loaded = ws2.getCell('B1');

    const updatedFill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FF00FF00'},
    };
    a1Loaded.fill = updatedFill;
    a1Loaded.numFmt = '#,##0';

    expect(a1Loaded.fill).to.deep.equal(updatedFill);
    expect(a1Loaded.numFmt).to.equal('#,##0');
    expect(b1Loaded.fill).to.deep.equal(initialFill);
    expect(b1Loaded.numFmt).to.equal('0.00');
  });

  it('PR 1573 - mutating cell.style.fill after reading xlsx does not affect other cells', async () => {
    const wb = new ExcelJS.Workbook();
    const worksheet = wb.addWorksheet('Sheet1');
    const border = {
      left: {style: 'thin'},
      right: {style: 'thin'},
      top: {style: 'thin'},
      bottom: {style: 'thin'},
    };
    worksheet.getCell('A1').style.border = border;
    worksheet.getCell('A1').value = 'A1';
    worksheet.getCell('B1').style.border = border;
    worksheet.getCell('B1').value = 'B1';

    const buffer = await wb.xlsx.writeBuffer();
    const wb2 = new ExcelJS.Workbook();
    await wb2.xlsx.load(buffer);

    const ws2 = wb2.getWorksheet(1);
    ws2.getCell('A1').style.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FFFF0000'},
      bgColor: {indexed: 64},
    };

    expect(ws2.getCell('A1').style.fill).to.not.equal(ws2.getCell('B1').style.fill);
    expect(ws2.getCell('B1').style.fill).to.deep.equal({
      type: 'pattern',
      pattern: 'none',
    });
  });
});
