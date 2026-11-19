const fs = require('fs');

const testXformHelper = require('../test-xform-helper');

const TableXform = verquire('xlsx/xform/table/table-xform');

const expectations = [
  {
    title: 'showing filter',
    create() {
      return new TableXform();
    },
    initialModel: null,
    preparedModel: require('./data/table.1.1.json'),
    xml: fs.readFileSync(`${__dirname}/data/table.1.2.xml`).toString(),
    parsedModel: require('./data/table.1.3.json'),
    tests: ['render', 'renderIn', 'parse'],
  },
  {
    title: 'autofilter with extra filterColumn beyond tableColumns',
    create() {
      return new TableXform();
    },
    initialModel: null,
    xml:
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<table xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" id="1" name="TestTable" displayName="TestTable" ref="A1:B5" totalsRowCount="0" headerRowCount="1">' +
      '<autoFilter ref="A1:C5">' +
      '<filterColumn colId="0" hiddenButton="0"/>' +
      '<filterColumn colId="1" hiddenButton="1"/>' +
      '<filterColumn colId="2" hiddenButton="0"/>' +
      '</autoFilter>' +
      '<tableColumns count="2">' +
      '<tableColumn id="1" name="Col1"/>' +
      '<tableColumn id="2" name="Col2"/>' +
      '</tableColumns>' +
      '</table>',
    parsedModel: {
      name: 'TestTable',
      displayName: 'TestTable',
      tableRef: 'A1:B5',
      autoFilterRef: 'A1:C5',
      totalsRow: false,
      headerRow: true,
      columns: [
        {name: 'Col1', filterButton: true},
        {name: 'Col2', filterButton: false},
      ],
      style: null,
    },
    tests: ['parse'],
  },
  {
    title: 'autofilter with dynamicFilter in filterColumn',
    create() {
      return new TableXform();
    },
    initialModel: null,
    xml:
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<table xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" id="1" name="TestTable" displayName="TestTable" ref="A1:B5" totalsRowCount="0" headerRowCount="1">' +
      '<autoFilter ref="A1:B5">' +
      '<filterColumn colId="0" hiddenButton="0"><dynamicFilter type="today"/></filterColumn>' +
      '<filterColumn colId="1" hiddenButton="1"/>' +
      '</autoFilter>' +
      '<tableColumns count="2">' +
      '<tableColumn id="1" name="Col1"/>' +
      '<tableColumn id="2" name="Col2"/>' +
      '</tableColumns>' +
      '</table>',
    parsedModel: {
      name: 'TestTable',
      displayName: 'TestTable',
      tableRef: 'A1:B5',
      autoFilterRef: 'A1:B5',
      totalsRow: false,
      headerRow: true,
      columns: [
        {name: 'Col1', filterButton: true},
        {name: 'Col2', filterButton: false},
      ],
      style: null,
    },
    tests: ['parse'],
  },
  {
    title: 'table with calculated column',
    create() {
      return new TableXform();
    },
    initialModel: null,
    xml:
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<table xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" id="1" name="TestTable" displayName="TestTable" ref="A1:C5" totalsRowCount="0" headerRowCount="1">' +
      '<autoFilter ref="A1:C5">' +
      '<filterColumn colId="0" hiddenButton="0"/>' +
      '<filterColumn colId="1" hiddenButton="1"/>' +
      '<filterColumn colId="2" hiddenButton="0"/>' +
      '</autoFilter>' +
      '<tableColumns count="3">' +
      '<tableColumn id="1" name="Col1"/>' +
      '<tableColumn id="2" name="Col2"><calculatedColumnFormula>foo</calculatedColumnFormula></tableColumn>' +
      '<tableColumn id="3" name="Col3"/>' +
      '</tableColumns>' +
      '</table>',
    parsedModel: {
      name: 'TestTable',
      displayName: 'TestTable',
      tableRef: 'A1:C5',
      autoFilterRef: 'A1:C5',
      totalsRow: false,
      headerRow: true,
      columns: [
        {name: 'Col1', filterButton: true},
        {name: 'Col2', filterButton: false},
        {name: 'Col3', filterButton: true},
      ],
      style: null,
    },
    tests: ['parse'],
  },
  {
    title: 'table with omitted totalsRowCount and headerRowCount (defaults)',
    create() {
      return new TableXform();
    },
    initialModel: null,
    xml:
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<table xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" id="1" name="TestTable" displayName="TestTable" ref="A1:C5">' +
      '<tableColumns count="3">' +
      '<tableColumn id="1" name="Col1"/>' +
      '<tableColumn id="2" name="Col2"/>' +
      '<tableColumn id="3" name="Col3"/>' +
      '</tableColumns>' +
      '</table>',
    parsedModel: {
      name: 'TestTable',
      displayName: 'TestTable',
      tableRef: 'A1:C5',
      columns: [{name: 'Col1'}, {name: 'Col2'}, {name: 'Col3'}],
      style: null,
    },
    tests: ['parse'],
  },
  {
    title: 'table with headerRow false omits autoFilter on render',
    create() {
      return new TableXform();
    },
    initialModel: null,
    preparedModel: {
      id: 1,
      name: 'NoHeaderTable',
      displayName: 'NoHeaderTable',
      tableRef: 'A1:B2',
      totalsRow: false,
      headerRow: false,
      columns: [
        {id: 1, name: 'Col1'},
        {id: 2, name: 'Col2'},
      ],
      style: {
        theme: 'TableStyleMedium2',
        showFirstColumn: false,
        showLastColumn: false,
        showRowStripes: true,
        showColumnStripes: false,
      },
    },
    xml:
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<table xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ' +
      'xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="xr xr3" ' +
      'xmlns:xr="http://schemas.microsoft.com/office/spreadsheetml/2014/revision" ' +
      'xmlns:xr3="http://schemas.microsoft.com/office/spreadsheetml/2016/revision3" ' +
      'id="1" name="NoHeaderTable" displayName="NoHeaderTable" ref="A1:B2" totalsRowCount="0" headerRowCount="0">' +
      '<tableColumns count="2">' +
      '<tableColumn id="1" name="Col1"/>' +
      '<tableColumn id="2" name="Col2"/>' +
      '</tableColumns>' +
      '<tableStyleInfo name="TableStyleMedium2" showFirstColumn="0" showLastColumn="0" showRowStripes="1" showColumnStripes="0"/>' +
      '</table>',
    tests: ['render', 'renderIn'],
  },
];

describe('TableXform', () => {
  testXformHelper(expectations);
});
