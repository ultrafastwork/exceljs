const {PassThrough} = require('stream');
const JSZip = require('jszip');

const ExcelJS = verquire('exceljs');

async function createStrictDateWorkbookBuffer() {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Sheet1');
  ws.getCell('A1').value = 'placeholder1';
  ws.getCell('A2').value = 'placeholder2';
  ws.getCell('A3').value = 'placeholder3';

  const buffer = await wb.xlsx.writeBuffer();
  const zip = await JSZip.loadAsync(buffer);
  const sheetXml = await zip.file('xl/worksheets/sheet1.xml').async('string');

  const updatedXml = sheetXml.replace(
    /<sheetData>[\s\S]*?<\/sheetData>/,
    [
      '<sheetData>',
      '<row r="1"><c r="A1" t="d"><v>2024-02-09</v></c></row>',
      '<row r="2"><c r="A2" t="d"><v>2024-02-09T12:34:56.000Z</v></c></row>',
      '<row r="3"><c r="A3" t="d"><f>TODAY()</f><v>2024-02-09</v></c></row>',
      '</sheetData>',
    ].join(''),
  );

  zip.file('xl/worksheets/sheet1.xml', updatedXml);
  return zip.generateAsync({type: 'nodebuffer'});
}

describe('github issues', () => {
  it('pr 2702 - should parse Strict OpenXML dates (t="d") via Workbook.xlsx.load', async () => {
    const buffer = await createStrictDateWorkbookBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);

    const sheet = workbook.getWorksheet('Sheet1');
    const a1 = sheet.getCell('A1');
    expect(a1.type).to.equal(ExcelJS.ValueType.Date);
    expect(a1.value).to.deep.equal(new Date('2024-02-09'));

    const a2 = sheet.getCell('A2');
    expect(a2.type).to.equal(ExcelJS.ValueType.Date);
    expect(a2.value).to.deep.equal(new Date('2024-02-09T12:34:56.000Z'));

    const a3 = sheet.getCell('A3');
    expect(a3.type).to.equal(ExcelJS.ValueType.Formula);
    expect(a3.value).to.deep.equal({
      formula: 'TODAY()',
      result: new Date('2024-02-09'),
    });
  });

  it('pr 2702 - should parse Strict OpenXML dates (t="d") via WorkbookReader', async () => {
    const buffer = await createStrictDateWorkbookBuffer();
    const values = [];

    const stream = new PassThrough();
    stream.end(buffer);

    const reader = new ExcelJS.stream.xlsx.WorkbookReader(stream, {
      worksheets: 'emit',
      styles: 'cache',
      sharedStrings: 'cache',
      hyperlinks: 'ignore',
      entries: 'ignore',
    });

    for await (const worksheetReader of reader) {
      for await (const row of worksheetReader) {
        values.push(row.getCell(1).value);
      }
    }

    expect(values).to.deep.equal([
      new Date('2024-02-09'),
      new Date('2024-02-09T12:34:56.000Z'),
      {
        formula: 'TODAY()',
        result: new Date('2024-02-09'),
      },
    ]);
  });
});
