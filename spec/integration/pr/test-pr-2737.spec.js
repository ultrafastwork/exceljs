import ExcelJS from '../../../lib/exceljs.nodejs.js';

describe('github issues', () => {
  it('pull request 2737 - should not render empty rich text substrings', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Test');

    ws.getCell('C1').value = {
      richText: [
        {font: {size: 10, color: {argb: 'ffff0000'}}, text: 'Test 1'},
        {font: {size: 10, color: {argb: 'ff00ff00'}}, text: ''},
        {font: {size: 10, color: {argb: 'ff0000ff'}}, text: 'Test 2'},
      ],
    };

    ws.getCell('C2').value = {
      richText: [
        {font: {size: 10, color: {argb: 'ffff0000'}}, text: ''},
        {font: {size: 10, color: {argb: 'ff00ff00'}}, text: ''},
      ],
    };

    const buffer = await wb.xlsx.writeBuffer();
    const wb2 = new ExcelJS.Workbook();
    await wb2.xlsx.load(buffer);

    const ws2 = wb2.getWorksheet('Test');
    expect(ws2.getCell('C1').value).to.deep.equal({
      richText: [
        {font: {size: 10, color: {argb: 'ffff0000'}}, text: 'Test 1'},
        {font: {size: 10, color: {argb: 'ff0000ff'}}, text: 'Test 2'},
      ],
    });
    expect(ws2.getCell('C2').value).to.equal('');
  });
});
