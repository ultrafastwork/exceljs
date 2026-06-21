const testXformHelper = require('../../test-xform-helper');

const DatabarXform = verquire('xlsx/xform/sheet/cf/databar-xform');

const expectations = [
  {
    title: 'Empty/Minimal (Defaults)',
    create() {
      return new DatabarXform();
    },
    preparedModel: {},
    xml: `
      <dataBar>
        <cfvo type="min" />
        <cfvo type="max" />
        <color rgb="FF638EC6" />
      </dataBar>
    `,
    parsedModel: {
      cfvo: [{type: 'min'}, {type: 'max'}],
      color: {argb: 'FF638EC6'},
    },
    tests: ['render'],
  },
  {
    title: 'Explicit Values',
    create() {
      return new DatabarXform();
    },
    preparedModel: {
      cfvo: [
        {type: 'percent', value: 10},
        {type: 'percent', value: 90},
      ],
      color: {argb: 'FF000000'},
    },
    xml: `
      <dataBar>
        <cfvo type="percent" val="10" />
        <cfvo type="percent" val="90" />
        <color rgb="FF000000" />
      </dataBar>
    `,
    parsedModel: {
      cfvo: [
        {type: 'percent', value: 10},
        {type: 'percent', value: 90},
      ],
      color: {argb: 'FF000000'},
    },
    tests: ['render', 'parse'],
  },
];

describe('DatabarXform', () => {
  testXformHelper(expectations);
});
