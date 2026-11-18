const {PassThrough} = require('stream');

const ExcelJS = verquire('exceljs.nodejs');

describe('CSV', () => {
  describe('read', () => {
    it('preserves cells filled with spaces only instead of converting to 0', async () => {
      const wb = new ExcelJS.Workbook();
      const stream = new PassThrough();
      stream.end('firstValue;    ;secondValue; ;0;; 42 ;\t');
      const ws = await wb.csv.read(stream, {parserOptions: {delimiter: ';'}});

      const row = ws.getRow(1);
      expect(row.getCell(1).value).to.equal('firstValue');
      expect(row.getCell(2).value).to.equal('    ');
      expect(row.getCell(3).value).to.equal('secondValue');
      expect(row.getCell(4).value).to.equal(' ');
      expect(row.getCell(5).value).to.equal(0);
      expect(row.getCell(6).value).to.be.null();
      expect(row.getCell(7).value).to.equal(42);
      expect(row.getCell(8).value).to.equal('\t');
    });

    it('preserves large numbers that lose precision as strings', async () => {
      const wb = new ExcelJS.Workbook();
      const stream = new PassThrough();
      stream.end(
        [
          'A',
          'B',
          'Some123String',
          '-1',
          '0',
          '1',
          '100',
          '1.0',
          '-1.0',
          '1.1',
          '1.10',
          '1.101010',
          '0.000',
          '1000000',
          '56343416020533614003',
          '56343416020533614003.0',
          '56343416020533614003.1',
        ].join('\n')
      );
      const ws = await wb.csv.read(stream);

      expect(ws.getCell('A1').value).to.equal('A');
      expect(ws.getCell('A2').value).to.equal('B');
      expect(ws.getCell('A3').value).to.equal('Some123String');
      expect(ws.getCell('A4').value).to.equal(-1);
      expect(ws.getCell('A5').value).to.equal(0);
      expect(ws.getCell('A6').value).to.equal(1);
      expect(ws.getCell('A7').value).to.equal(100);
      expect(ws.getCell('A8').value).to.equal(1);
      expect(ws.getCell('A9').value).to.equal(-1);
      expect(ws.getCell('A10').value).to.equal(1.1);
      expect(ws.getCell('A11').value).to.equal(1.1);
      expect(ws.getCell('A12').value).to.equal(1.10101);
      expect(ws.getCell('A13').value).to.equal(0);
      expect(ws.getCell('A14').value).to.equal(1000000);
      expect(ws.getCell('A15').value).to.equal('56343416020533614003');
      expect(ws.getCell('A16').value).to.equal('56343416020533614003.0');
      expect(ws.getCell('A17').value).to.equal('56343416020533614003.1');
    });
  });
});
