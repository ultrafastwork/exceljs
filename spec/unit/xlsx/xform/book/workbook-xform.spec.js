const fs = require('fs');

const testXformHelper = require('../test-xform-helper');

const WorkbookXform = verquire('xlsx/xform/book/workbook-xform');

const expectations = [
  {
    title: 'book.1',
    create() {
      return new WorkbookXform();
    },
    preparedModel: require('./data/book.1.1.json'),
    xml: fs.readFileSync(`${__dirname}/data/book.1.2.xml`).toString().replace(/\r\n/g, '\n'),
    parsedModel: require('./data/book.1.3.json'),
    tests: ['render', 'renderIn', 'parse'],
  },
  {
    title: 'book.2 - no properties',
    create() {
      return new WorkbookXform();
    },
    xml: fs.readFileSync(`${__dirname}/data/book.2.2.xml`).toString().replace(/\r\n/g, '\n'),
    parsedModel: require('./data/book.2.3.json'),
    tests: ['parse'],
  },
];

describe('WorkbookXform', () => {
  testXformHelper(expectations);

  it('prepares and reconciles multiple print areas in a single definedName (PR #1516, PR #1971)', () => {
    const xform = new WorkbookXform();
    const model = {
      worksheets: [
        {
          id: 1,
          name: 'Sheet1',
          pageSetup: {
            printArea: 'A1:B5&&A6:B10',
          },
        },
      ],
      definedNames: [],
      media: [],
    };

    xform.prepare(model);
    expect(model.definedNames).to.deep.equal([
      {
        name: '_xlnm.Print_Area',
        localSheetId: 0,
        ranges: ["'Sheet1'!$A1:$B5", "'Sheet1'!$A6:$B10"],
      },
    ]);

    const reconcileModel = {
      sheets: [{id: 1, name: 'Sheet1', rId: 'rId1'}],
      workbookRels: [{Id: 'rId1', Target: 'worksheets/sheet1.xml'}],
      worksheetHash: {'xl/worksheets/sheet1.xml': {}},
      definedNames: [
        {
          name: '_xlnm.Print_Area',
          localSheetId: 0,
          ranges: ["'Sheet1'!$A$1:$B$5", "'Sheet1'!$A$6:$B$10"],
        },
      ],
      media: [],
    };

    xform.reconcile(reconcileModel);
    expect(reconcileModel.worksheetHash['xl/worksheets/sheet1.xml'].pageSetup.printArea).to.equal(
      'A1:B5&&A6:B10',
    );
  });
});
