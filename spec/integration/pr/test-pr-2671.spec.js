import {PassThrough} from 'node:stream';
import JSZip from 'jszip';
import ExcelJS from '../../../lib/exceljs.nodejs.js';

describe('github issues: PR #2671', () => {
  it('preserves worksheet names when workbook.xml.rels uses /xl/worksheets/ targets (openpyxl style)', async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet1 = workbook.addWorksheet('First Sheet');
    sheet1.getCell('A1').value = 'hello';
    const sheet2 = workbook.addWorksheet('Hidden Sheet', {state: 'hidden'});
    sheet2.getCell('B2').value = 123;

    const buffer = await workbook.xlsx.writeBuffer();
    const zip = await JSZip.loadAsync(buffer);

    const relsXml = await zip.file('xl/_rels/workbook.xml.rels').async('string');
    const openpyxlRelsXml = relsXml.replace(
      /Target="worksheets\/(sheet\d+\.xml)"/g,
      'Target="/xl/worksheets/$1"',
    );
    expect(openpyxlRelsXml).to.include('Target="/xl/worksheets/sheet1.xml"');
    zip.file('xl/_rels/workbook.xml.rels', openpyxlRelsXml);

    const modifiedBuffer = await zip.generateAsync({type: 'nodebuffer'});
    const stream = new PassThrough();
    stream.end(modifiedBuffer);

    const workbookReader = new ExcelJS.stream.xlsx.WorkbookReader(stream, {
      worksheets: 'emit',
      sharedStrings: 'cache',
      styles: 'cache',
    });

    const worksheets = [];
    for await (const worksheetReader of workbookReader) {
      const rows = [];
      for await (const row of worksheetReader) {
        rows.push(row.values);
      }
      worksheets.push({
        id: worksheetReader.id,
        name: worksheetReader.name,
        state: worksheetReader.state,
        rows,
      });
    }

    expect(worksheets).to.deep.equal([
      {
        id: 1,
        name: 'First Sheet',
        state: 'visible',
        rows: [[undefined, 'hello']],
      },
      {
        id: 2,
        name: 'Hidden Sheet',
        state: 'hidden',
        rows: [[undefined, undefined, 123]],
      },
    ]);
  });
});
