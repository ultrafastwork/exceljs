import {Readable} from 'node:stream';
import ExcelJS from '../../../lib/exceljs.nodejs.js';

describe('PR #2081 and PR #1665 - streaming multibyte UTF-8 characters', () => {
  it('reads multibyte UTF-8 characters via WorkbookReader when stream is sliced into small chunks', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Multibyte');

    const testStrings = [
      '凡是能够说的，都能够说清楚；凡是不能说的，必须保持沉默',
      'αβγδεζηθικ',
      'あいうえお 日本語のテスト',
      'Emoji 😀😁😂😃😄 rocket 🚀 sparkles ✨',
    ];

    testStrings.forEach((str, index) => {
      ws.getCell(`A${index + 1}`).value = str;
    });

    const buffer = await wb.xlsx.writeBuffer();

    // Stream the buffer in 16-byte chunks to force multibyte character boundary splits
    const chunkSize = 16;
    const stream = new Readable({
      read() {},
    });

    for (let i = 0; i < buffer.length; i += chunkSize) {
      stream.push(buffer.subarray(i, Math.min(i + chunkSize, buffer.length)));
    }
    stream.push(null);

    const workbookReader = new ExcelJS.stream.xlsx.WorkbookReader(stream, {
      worksheets: 'emit',
      sharedStrings: 'cache',
      styles: 'cache',
    });

    const rows = [];
    await new Promise((resolve, reject) => {
      workbookReader.read();
      workbookReader.on('worksheet', worksheet => {
        worksheet.on('row', row => {
          rows.push(row.values[1]);
        });
      });
      workbookReader.on('end', resolve);
      workbookReader.on('error', reject);
    });

    expect(rows).to.deep.equal(testStrings);
    // Ensure no replacement characters (U+FFFD ) are present
    rows.forEach(str => {
      expect(str).to.not.include('\uFFFD');
    });
  });
});
