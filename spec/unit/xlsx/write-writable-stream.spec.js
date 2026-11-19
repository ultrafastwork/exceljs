/* global ReadableStream, WritableStream */

import ExcelJS from '../../../lib/exceljs.nodejs.js';

describe('web-native streams', () => {
  it('writes and reads xlsx using WritableStream and ReadableStream', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Sheet1');
    ws.getCell('A1').value = 'hello';
    ws.getCell('B2').value = 42;

    const chunks = [];
    let closed = false;
    const writableStream = new WritableStream({
      write(chunk) {
        chunks.push(chunk);
      },
      close() {
        closed = true;
      },
    });

    await wb.xlsx.write(writableStream);

    expect(closed).to.be.true();
    expect(writableStream.locked).to.be.false();
    expect(chunks.length).to.be.greaterThan(0);

    const buffer = Buffer.concat(chunks);
    const midpoint = Math.floor(buffer.length / 2);
    const readableStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array(buffer.subarray(0, midpoint)));
        controller.enqueue(new Uint8Array(buffer.subarray(midpoint)));
        controller.close();
      },
    });

    const wb2 = new ExcelJS.Workbook();
    await wb2.xlsx.read(readableStream);

    const ws2 = wb2.getWorksheet('Sheet1');
    expect(ws2.getCell('A1').value).to.equal('hello');
    expect(ws2.getCell('B2').value).to.equal(42);
  });

  it('reads xlsx from a ReadableStream-like object without Symbol.asyncIterator', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Sheet1');
    ws.getCell('A1').value = 'no-async-iter';
    const buffer = await wb.xlsx.writeBuffer();

    const readableLike = {
      getReader() {
        let read = false;
        return {
          async read() {
            if (!read) {
              read = true;
              return {done: false, value: new Uint8Array(buffer)};
            }
            return {done: true, value: undefined};
          },
          releaseLock() {},
        };
      },
    };

    const wb2 = new ExcelJS.Workbook();
    await wb2.xlsx.read(readableLike);
    expect(wb2.getWorksheet('Sheet1').getCell('A1').value).to.equal('no-async-iter');
  });

  it('writes and reads csv using WritableStream and ReadableStream', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Sheet1');
    ws.addRow(['name', 'score']);
    ws.addRow(['alice', 100]);

    const chunks = [];
    let closed = false;
    const writableStream = new WritableStream({
      write(chunk) {
        chunks.push(chunk);
      },
      close() {
        closed = true;
      },
    });

    await wb.csv.write(writableStream);

    expect(closed).to.be.true();
    expect(writableStream.locked).to.be.false();

    const buffer = Buffer.concat(chunks);
    const readableStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array(buffer));
        controller.close();
      },
    });

    const wb2 = new ExcelJS.Workbook();
    const ws2 = await wb2.csv.read(readableStream);
    expect(ws2.getCell('A1').value).to.equal('name');
    expect(ws2.getCell('B2').value).to.equal(100);
  });

  it('propagates errors from WritableStream and ReadableStream', async () => {
    const wb = new ExcelJS.Workbook();
    wb.addWorksheet('Sheet1').getCell('A1').value = 'err';

    const failingWritable = new WritableStream({
      write() {
        throw new Error('write failed');
      },
    });

    let writeError;
    try {
      await wb.xlsx.write(failingWritable);
    } catch (err) {
      writeError = err;
    }
    expect(writeError).to.be.an('error');
    expect(writeError.message).to.equal('write failed');

    const failingReadable = new ReadableStream({
      pull() {
        throw new Error('read failed');
      },
    });

    let readError;
    try {
      await wb.xlsx.read(failingReadable);
    } catch (err) {
      readError = err;
    }
    expect(readError).to.be.an('error');
    expect(readError.message).to.equal('read failed');
  });
});
