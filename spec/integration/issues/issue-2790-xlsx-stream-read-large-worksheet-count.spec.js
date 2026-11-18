const JSZip = require('jszip');
const {Readable} = require('readable-stream');

const ExcelJS = verquire('exceljs');

function createChunkedStream(buffer, chunkSize = 4096) {
  let offset = 0;
  return new Readable({
    read() {
      if (offset >= buffer.length) {
        this.push(null);
        return;
      }
      this.push(buffer.subarray(offset, offset + chunkSize));
      offset += chunkSize;
    },
  });
}

describe('github issues', () => {
  describe('issue 2790 - WorkbookReader missing worksheets when count > 100', function() {
    this.timeout(10000);
    const SHEET_COUNT = 188;
    let workbookBuffer;

    before(async () => {
      const wb = new ExcelJS.Workbook();
      for (let i = 1; i <= SHEET_COUNT; i++) {
        const ws = wb.addWorksheet(`Sheet${i}`);
        ws.getCell('A1').value = `Value ${i}`;
      }
      workbookBuffer = await wb.xlsx.writeBuffer();
    });

    it('reads all 188 worksheets via WorkbookReader.read()', async () => {
      const reader = new ExcelJS.stream.xlsx.WorkbookReader(
        createChunkedStream(workbookBuffer),
        {
          worksheets: 'emit',
          sharedStrings: 'cache',
          styles: 'cache',
        }
      );

      let worksheetCount = 0;
      let firstValue = null;
      let lastValue = null;

      await new Promise((resolve, reject) => {
        reader.on('worksheet', worksheet => {
          worksheetCount++;
          const currentIndex = worksheetCount;
          worksheet.on('row', row => {
            if (currentIndex === 1) {
              firstValue = row.getCell(1).value;
            }
            if (currentIndex === SHEET_COUNT) {
              lastValue = row.getCell(1).value;
            }
          });
        });
        reader.on('end', resolve);
        reader.on('error', reject);
        reader.read();
      });

      expect(worksheetCount).to.equal(SHEET_COUNT);
      expect(firstValue).to.equal('Value 1');
      expect(lastValue).to.equal(`Value ${SHEET_COUNT}`);
    });

    it('emits all 188 worksheets via async iterator without consuming each worksheet', async () => {
      const reader = new ExcelJS.stream.xlsx.WorkbookReader(
        createChunkedStream(workbookBuffer),
        {
          worksheets: 'emit',
          sharedStrings: 'cache',
        }
      );

      let worksheetCount = 0;
      // eslint-disable-next-line no-unused-vars
      for await (const worksheet of reader) {
        worksheetCount++;
      }

      expect(worksheetCount).to.equal(SHEET_COUNT);
    });

    it('reads all 188 worksheets when sharedStrings.xml appears after worksheets', async () => {
      const originalZip = await JSZip.loadAsync(workbookBuffer);
      const reorderedZip = new JSZip();

      const keys = Object.keys(originalZip.files);
      for (const key of keys) {
        const file = originalZip.files[key];
        if (!file.dir && key !== 'xl/sharedStrings.xml') {
          // eslint-disable-next-line no-await-in-loop
          reorderedZip.file(key, await file.async('nodebuffer'));
        }
      }
      reorderedZip.file(
        'xl/sharedStrings.xml',
        await originalZip.files['xl/sharedStrings.xml'].async('nodebuffer')
      );

      const reorderedBuffer = await reorderedZip.generateAsync({type: 'nodebuffer'});
      const reader = new ExcelJS.stream.xlsx.WorkbookReader(
        createChunkedStream(reorderedBuffer),
        {
          worksheets: 'emit',
          sharedStrings: 'cache',
        }
      );

      let worksheetCount = 0;
      let firstValue = null;
      let lastValue = null;

      await new Promise((resolve, reject) => {
        reader.on('worksheet', worksheet => {
          worksheetCount++;
          const currentIndex = worksheetCount;
          worksheet.on('row', row => {
            if (currentIndex === 1) {
              firstValue = row.getCell(1).value;
            }
            if (currentIndex === SHEET_COUNT) {
              lastValue = row.getCell(1).value;
            }
          });
        });
        reader.on('end', resolve);
        reader.on('error', reject);
        reader.read();
      });

      expect(worksheetCount).to.equal(SHEET_COUNT);
      expect(firstValue).to.equal('Value 1');
      expect(lastValue).to.equal(`Value ${SHEET_COUNT}`);
    });
  });
});
