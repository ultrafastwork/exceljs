/* eslint-disable max-classes-per-file */
const JSZip = require('jszip');

const Workbook = verquire('doc/workbook');
const WorkbookReaderBlob = verquire('stream/xlsx/workbook-reader-blob');

describe('WorkbookReaderBlob and XLSX troubleshooting log', () => {
  it('logs a warning when loading an archive without worksheets (PR #2779)', async () => {
    const zip = new JSZip();
    zip.file('dummy.txt', 'not a real xlsx');
    const buffer = await zip.generateAsync({type: 'nodebuffer'});

    const warnings = [];
    const origWarn = console.warn;
    console.warn = msg => warnings.push(msg);

    try {
      const wb = new Workbook();
      await wb.xlsx.load(buffer);
      expect(warnings.length).to.equal(1);
      expect(warnings[0]).to.include('Every workbook must have at least one worksheet.');
    } finally {
      console.warn = origWarn;
    }
  });

  it('streams xlsx from a Blob using FileReader (PR #1457)', async () => {
    const wb = new Workbook();
    const ws = wb.addWorksheet('blort');
    ws.getCell('A1').value = 'Hello, World!';
    ws.getCell('A2').value = 7;

    const buffer = await wb.xlsx.writeBuffer();

    const origBlob = global.Blob;
    const origFileReader = global.FileReader;

    class MockBlob {
      constructor(parts) {
        this._buffer = Buffer.concat(parts.map(p => Buffer.from(p)));
      }

      get size() {
        return this._buffer.length;
      }

      slice(start, end) {
        return new MockBlob([this._buffer.slice(start, end)]);
      }
    }

    class MockFileReader {
      readAsArrayBuffer(blob) {
        setImmediate(() => {
          const buf = blob._buffer;
          this.result = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
          if (this.onload) {
            this.onload();
          }
        });
      }
    }

    global.Blob = MockBlob;
    global.FileReader = MockFileReader;

    try {
      const blob = new MockBlob([buffer]);
      const workbookReader = new WorkbookReaderBlob(blob);
      let rows = 0;
      for await (const worksheetReader of workbookReader) {
        expect(worksheetReader.name).to.equal('blort');
        for await (const row of worksheetReader) {
          rows++;
          if (rows === 1) {
            expect(row.getCell('A').value).to.equal('Hello, World!');
          } else if (rows === 2) {
            expect(row.getCell('A').value).to.equal(7);
          }
        }
      }
      expect(rows).to.equal(2);
    } finally {
      global.Blob = origBlob;
      global.FileReader = origFileReader;
    }
  });
});
