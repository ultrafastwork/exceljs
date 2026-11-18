const Excel = verquire('exceljs');

function createTableWithName(name) {
  const wb = new Excel.Workbook();
  const ws = wb.addWorksheet('Sheet1');
  return ws.addTable({
    name,
    ref: 'A1',
    columns: [{name: 'Col1'}, {name: 'Col2'}],
    rows: [[1, 2]],
  });
}

describe('Worksheet', () => {
  describe('Table Name Validation', () => {
    const validNames = [
      'TestTable',
      'Test_Table',
      '_TestTable',
      '\\TestTable',
      'Test.Table',
      'Table1',
      'Item1',
      'A'.repeat(255),
      'XFE1',
      'A1048577',
    ];

    validNames.forEach(name => {
      it(`accepts valid table name "${name.length > 30 ? `${name.slice(0, 30)}...` : name}"`, () => {
        const table = createTableWithName(name);
        expect(table.name).to.equal(name);
      });
    });

    const invalidNames = [
      {label: 'empty string', value: ''},
      {label: 'undefined', value: undefined},
      {label: 'null', value: null},
      {label: 'space in name', value: 'Test Table'},
      {label: 'leading space', value: ' TestTable'},
      {label: 'leading digit', value: '1TestTable'},
      {label: 'digits only', value: '123'},
      {label: 'leading period', value: '.TestTable'},
      {label: 'hyphen', value: 'Test-Table'},
      {label: 'at sign', value: 'Test@Table'},
      {label: 'dollar sign', value: 'Test$Table'},
      {label: 'exclamation mark', value: 'Test!Table'},
      {label: 'reserved "C"', value: 'C'},
      {label: 'reserved "c"', value: 'c'},
      {label: 'reserved "R"', value: 'R'},
      {label: 'reserved "r"', value: 'r'},
      {label: 'cell reference "A1"', value: 'A1'},
      {label: 'cell reference "XFD1048576"', value: 'XFD1048576'},
      {label: 'R1C1 reference "R1C1"', value: 'R1C1'},
      {label: 'exceeding 255 characters', value: 'A'.repeat(256)},
    ];

    invalidNames.forEach(({label, value}) => {
      it(`throws error for invalid table name (${label})`, () => {
        expect(() => createTableWithName(value)).to.throw();
      });
    });
  });
});
