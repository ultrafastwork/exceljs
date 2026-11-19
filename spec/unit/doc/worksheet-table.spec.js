const colCache = verquire('utils/col-cache');
const Excel = verquire('exceljs');

const spliceArray = (a, index, count, ...rest) => {
  const clone = [...a];
  clone.splice(index, count, ...rest);
  return clone;
};

const values = [
  ['Date', 'Id', 'Word'],
  [new Date('2019-08-01'), 1, 'Bird'],
  [new Date('2019-08-02'), 2, 'is'],
  [new Date('2019-08-03'), 3, 'the'],
  [new Date('2019-08-04'), 4, 'Word'],
  ['Totals', {formula: 'SUBTOTAL(104,TestTable[Id])', result: 4}, null],
];

function addTable(ref, ws) {
  return ws.addTable({
    name: 'TestTable',
    ref,
    headerRow: true,
    totalsRow: true,
    style: {
      theme: 'TableStyleDark3',
      showRowStripes: true,
    },
    columns: [
      {name: 'Date', totalsRowLabel: 'Totals', filterButton: true},
      {
        name: 'Id',
        totalsRowFunction: 'max',
        filterButton: true,
        totalsRowResult: 4,
      },
      {
        name: 'Word',
        filterButton: false,
        style: {font: {bold: true, name: 'Comic Sans MS'}},
      },
    ],
    rows: [
      [new Date('2019-08-01'), 1, 'Bird'],
      [new Date('2019-08-02'), 2, 'is'],
      [new Date('2019-08-03'), 3, 'the'],
      [new Date('2019-08-04'), 4, 'Word'],
    ],
  });
}

function checkTable(ref, ws, testValues) {
  const a = colCache.decodeAddress(ref);

  for (let i = -1; i <= testValues.length + 1; i++) {
    const vRow = testValues[i];
    const nRow = i + a.row;
    const row = nRow >= 1 && ws.getRow(nRow);
    if (!row) continue;
    for (let j = -1; j <= testValues[0].length + 1; j++) {
      const value = (vRow && vRow[j]) || null;
      const nCol = j + a.col;
      const cellValue = nCol >= 1 && row.getCell(nCol).value;
      if (!cellValue) continue;

      if (value instanceof Date) {
        expect(cellValue).to.equalDate(value);
      } else if (value === null) {
        expect(cellValue).to.be.null();
      } else if (typeof value === 'object') {
        expect(cellValue).to.deep.equal(value);
      } else {
        expect(cellValue).to.equal(value);
      }
    }
  }
}

describe('Worksheet', () => {
  describe('Table', () => {
    it('creates a table', () => {
      const wb = new Excel.Workbook();
      const ws = wb.addWorksheet('blort');
      addTable('A1', ws);

      checkTable('A1', ws, values);
    });

    it('removes header', () => {
      const wb = new Excel.Workbook();
      const ws = wb.addWorksheet('blort');
      const table = addTable('A1', ws);

      table.headerRow = false;
      table.commit();

      const newValues = spliceArray(values, 0, 1);
      checkTable('A1', ws, newValues);
    });

    it('removes totals', () => {
      const wb = new Excel.Workbook();
      const ws = wb.addWorksheet('blort');
      const table = addTable('A1', ws);

      table.totalsRow = false;
      table.commit();

      const newValues = spliceArray(values, 5, 1);
      checkTable('A1', ws, newValues);
    });

    it('moves the table', () => {
      const wb = new Excel.Workbook();
      const ws = wb.addWorksheet('blort');
      const table = addTable('A1', ws);

      table.ref = 'C2';
      table.commit();

      checkTable('C2', ws, values);
    });

    it('removes a row', () => {
      const wb = new Excel.Workbook();
      const ws = wb.addWorksheet('blort');
      const table = addTable('A1', ws);

      table.removeRows(1);
      table.commit();

      const newValues = spliceArray(values, 2, 1);
      checkTable('A1', ws, newValues);
    });

    it('adds a row', () => {
      const wb = new Excel.Workbook();
      const ws = wb.addWorksheet('blort');
      const table = addTable('A1', ws);

      table.addRow([new Date('2019-08-05'), 5, 'Bird']);
      table.commit();

      const newValues = spliceArray(values, 5, 0, [new Date('2019-08-05'), 5, 'Bird']);
      checkTable('A1', ws, newValues);
    });

    it('removes a column', () => {
      const wb = new Excel.Workbook();
      const ws = wb.addWorksheet('blort');
      const table = addTable('A1', ws);

      table.removeColumns(1);
      table.commit();

      const newValues = values.map(rVals => spliceArray(rVals, 1, 1));
      checkTable('A1', ws, newValues);
    });

    it('adds a column', () => {
      const wb = new Excel.Workbook();
      const ws = wb.addWorksheet('blort');
      const table = addTable('A1', ws);

      table.addColumn(
        {
          name: 'Letter',
          totalsRowFunction: 'custom',
          totalsRowFormula: 'ROW()',
          totalsRowResult: 6,
          filterButton: true,
        },
        ['a', 'b', 'c', 'd'],
        2,
      );
      table.commit();

      const colValues = ['Letter', 'a', 'b', 'c', 'd', {formula: 'ROW()', result: 6}];
      const newValues = values.map((rVals, i) => spliceArray(rVals, 2, 0, colValues[i]));
      checkTable('A1', ws, newValues);
    });

    it('renames a column', () => {
      const wb = new Excel.Workbook();
      const ws = wb.addWorksheet('blort');
      const table = addTable('A1', ws);

      const column = table.getColumn(1);
      column.name = 'Code';
      table.commit();

      const newValues = [...values];
      newValues.splice(0, 1, ['Date', 'Code', 'Word']);
      newValues.splice(5, 1, [
        'Totals',
        {formula: 'SUBTOTAL(104,TestTable[Code])', result: 4},
        null,
      ]);

      checkTable('A1', ws, newValues);
    });

    it('throws error when rows is empty', () => {
      const wb = new Excel.Workbook();
      const ws = wb.addWorksheet('blort');
      expect(() =>
        ws.addTable({
          name: 'TestTable',
          ref: 'A1',
          columns: [{name: 'Col1'}, {name: 'Col2'}],
          rows: [],
        }),
      ).to.throw('Table must have row definitions');
    });

    it('throws error when rows is missing or null', () => {
      const wb = new Excel.Workbook();
      const ws = wb.addWorksheet('blort');
      expect(() =>
        ws.addTable({
          name: 'TestTable',
          ref: 'A1',
          columns: [{name: 'Col1'}, {name: 'Col2'}],
        }),
      ).to.throw('Table must have row definitions');
      expect(() =>
        ws.addTable({
          name: 'TestTable2',
          ref: 'A1',
          columns: [{name: 'Col1'}, {name: 'Col2'}],
          rows: null,
        }),
      ).to.throw('Table must have row definitions');
    });

    it('throws error when removing all rows and committing', () => {
      const wb = new Excel.Workbook();
      const ws = wb.addWorksheet('blort');
      const table = addTable('A1', ws);

      table.removeRows(0, 4);
      expect(() => table.commit()).to.throw('Table must have row definitions');
    });

    it('merges column style into cell.style without overwriting existing cell style', () => {
      const wb = new Excel.Workbook();
      const ws = wb.addWorksheet('blort');
      ws.getCell('C2').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {argb: 'FFFF0000'},
      };

      ws.addTable({
        name: 'FlexReport',
        ref: 'A1',
        headerRow: true,
        totalsRow: true,
        style: {
          theme: 'TableStyleMedium9',
          showRowStripes: true,
        },
        columns: [
          {name: 'ID', filterButton: true},
          {name: 'Name', filterButton: true},
          {
            name: 'value',
            filterButton: true,
            totalsRowFunction: 'sum',
            style: {numFmt: '#,#00.00', font: {bold: true}},
          },
        ],
        rows: [
          [1, 'One', 10.5],
          [2, 'Two', 20.25],
        ],
      });

      expect(ws.getCell('C1').style.numFmt).to.equal('#,#00.00');
      expect(ws.getCell('C1').style.font).to.deep.equal({bold: true});
      expect(ws.getCell('C2').style.numFmt).to.equal('#,#00.00');
      expect(ws.getCell('C2').style.font).to.deep.equal({bold: true});
      expect(ws.getCell('C2').style.fill).to.deep.equal({
        type: 'pattern',
        pattern: 'solid',
        fgColor: {argb: 'FFFF0000'},
      });
      expect(ws.getCell('C3').style.numFmt).to.equal('#,#00.00');
      expect(ws.getCell('C4').style.numFmt).to.equal('#,#00.00');
    });

    it('defines a table over existing worksheet data using tableRef', () => {
      const wb = new Excel.Workbook();
      const ws = wb.addWorksheet('blort');
      ws.getCell('A1').value = 'Col1';
      ws.getCell('B1').value = 'Col2';
      ws.getCell('A2').value = 'val1';
      ws.getCell('B2').value = 10;
      ws.getCell('A3').value = 'val2';
      ws.getCell('B3').value = 20;

      const table = ws.addTable({
        name: 'ExistingDataTable',
        tableRef: 'A1:B3',
        columns: [{name: 'Col1'}, {name: 'Col2'}],
      });

      expect(table.table.rows).to.deep.equal([
        ['val1', 10],
        ['val2', 20],
      ]);
      expect(table.getTableRange(true)).to.deep.equal({
        startRow: 2,
        startColumn: 1,
        endRow: 3,
        endColumn: 2,
      });
      expect(table.getTableRange(false)).to.deep.equal({
        startRow: 1,
        startColumn: 1,
        endRow: 3,
        endColumn: 2,
      });
    });

    it('removes a table with and without destroying cell data', () => {
      const wb = new Excel.Workbook();
      const ws = wb.addWorksheet('blort');
      addTable('A1', ws);

      ws.removeTable('TestTable', false);
      expect(ws.getTable('TestTable')).to.be.undefined();
      expect(ws.getCell('A1').value).to.equal('Date');

      addTable('A1', ws);
      ws.removeTable('TestTable', true);
      expect(ws.getTable('TestTable')).to.be.undefined();
      expect(ws.getCell('A1').value).to.be.null();
      expect(ws.getCell('B2').value).to.be.null();
      expect(ws.getCell('A6').value).to.be.null();
    });

    it('fills cells in a range with cloned or shared fill object', () => {
      const wb = new Excel.Workbook();
      const ws = wb.addWorksheet('blort');
      const fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {argb: 'FFFF0000'},
      };

      ws.fillCells('A1:B2', fill, true);
      expect(ws.getCell('A1').fill).to.deep.equal(fill);
      expect(ws.getCell('B2').fill).to.deep.equal(fill);
      expect(ws.getCell('A1').fill).to.not.equal(ws.getCell('B2').fill);

      ws.fillCells('C1:D2', fill, false);
      expect(ws.getCell('C1').fill).to.equal(fill);
      expect(ws.getCell('D2').fill).to.equal(fill);
    });
  });
});

module.exports = {
  defaultTableValues: values,
  addTable,
  checkTable,
};
