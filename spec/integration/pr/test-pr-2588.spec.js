import ExcelJS from '../../../lib/exceljs.nodejs.js';
import nodeStream from 'node:stream';

describe('PR #2588 - Fix shared strings and richText', () => {
  it('preserves distinct richText values when using useSharedStrings in Workbook', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('RichTextSheet');

    ws.getCell('A1').value = {
      richText: [
        {font: {bold: true}, text: 'Hello '},
        {font: {italic: true}, text: 'World'},
      ],
    };
    ws.getCell('A2').value = {
      richText: [
        {font: {bold: true}, text: 'Goodbye '},
        {font: {italic: true}, text: 'World'},
      ],
    };
    ws.getCell('A3').value = {
      richText: [
        {font: {bold: true}, text: 'Hello '},
        {font: {italic: true}, text: 'World'},
      ],
    };

    const buffer = await wb.xlsx.writeBuffer({useSharedStrings: true});
    const wb2 = new ExcelJS.Workbook();
    await wb2.xlsx.load(buffer);
    const ws2 = wb2.getWorksheet('RichTextSheet');

    expect(ws2.getCell('A1').text).to.equal('Hello World');
    expect(ws2.getCell('A2').text).to.equal('Goodbye World');
    expect(ws2.getCell('A3').text).to.equal('Hello World');
    expect(ws2.getCell('A1').value).to.deep.equal(ws.getCell('A1').value);
    expect(ws2.getCell('A2').value).to.deep.equal(ws.getCell('A2').value);
  });

  it('preserves distinct richText values when using streaming WorkbookWriter with useSharedStrings', async () => {
    const {PassThrough} = nodeStream;
    const stream = new PassThrough();

    const wb = new ExcelJS.stream.xlsx.WorkbookWriter({
      stream,
      useSharedStrings: true,
    });
    const ws = wb.addWorksheet('StreamingRichText');

    ws.addRow([
      {
        richText: [{text: 'Section 1: '}, {font: {bold: true}, text: 'Title'}],
      },
    ]).commit();
    ws.addRow([
      {
        richText: [{text: 'Section 2: '}, {font: {italic: true}, text: 'Description'}],
      },
    ]).commit();
    ws.addRow([
      {
        richText: [{text: 'Section 1: '}, {font: {bold: true}, text: 'Title'}],
      },
    ]).commit();

    ws.commit();
    await wb.commit();

    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    const wb2 = new ExcelJS.Workbook();
    await wb2.xlsx.load(buffer);
    const ws2 = wb2.getWorksheet('StreamingRichText');

    expect(ws2.getCell('A1').text).to.equal('Section 1: Title');
    expect(ws2.getCell('A2').text).to.equal('Section 2: Description');
    expect(ws2.getCell('A3').text).to.equal('Section 1: Title');
  });
});
