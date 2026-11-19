const ExcelJS = verquire('exceljs');
const Table = verquire('doc/table');

describe('github issues', () => {
  describe('pull request 1938 - Load table rows and ref', () => {
    it('Reading test-pr-1938.xlsx', () => {
      const wb = new ExcelJS.Workbook();
      return wb.xlsx.readFile('./spec/integration/data/test-pr-1938.xlsx').then(() => {
        const ws = wb.getWorksheet('Sheet1');
        const table = ws.getTable('Table1');
        expect(table.model.ref).to.be.equal('C4:E12');
        expect(table.model.tl.address).to.be.equal('C4');
        expect(table.model.rows.length).equal(8);
        expect(table.model.rows[3][2]).equal(4);
      });
    });

    it('loads table rows and ref when instantiated with tableRef', () => {
      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet('Sheet1');
      ws.getCell('C4').value = 'Col1';
      ws.getCell('D4').value = 'Col2';
      ws.getCell('C5').value = 'A';
      ws.getCell('D5').value = 10;
      ws.getCell('C6').value = 'B';
      ws.getCell('D6').value = 20;

      const table = new Table(ws, {
        name: 'LoadedTable',
        tableRef: 'C4:D6',
        columns: [{name: 'Col1'}, {name: 'Col2'}],
      });

      expect(table.model.ref).to.equal('C4:D6');
      expect(table.model.tl.address).to.equal('C4');
      expect(table.model.rows).to.deep.equal([
        ['A', 10],
        ['B', 20],
      ]);
    });
  });
});
