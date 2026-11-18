const XmlStream = verquire('utils/xml-stream');
const testXformHelper = require('../test-xform-helper');

const SheetPropertiesXform = verquire(
  'xlsx/xform/sheet/sheet-properties-xform'
);

const expectations = [
  {
    title: 'empty',
    create() {
      return new SheetPropertiesXform();
    },
    preparedModel: {},
    xml: '',
    parsedModel: {},
    tests: ['render', 'renderIn'],
  },
  {
    title: 'tabColor',
    create() {
      return new SheetPropertiesXform();
    },
    preparedModel: {tabColor: {argb: 'FFFF0000'}},
    xml: '<sheetPr><tabColor rgb="FFFF0000"/></sheetPr>',
    parsedModel: {tabColor: {argb: 'FFFF0000'}},
    tests: ['render', 'renderIn', 'parse'],
  },
  {
    title: 'pageSetup',
    create() {
      return new SheetPropertiesXform();
    },
    preparedModel: {pageSetup: {fitToPage: true}},
    xml: '<sheetPr><pageSetUpPr fitToPage="1"/></sheetPr>',
    parsedModel: {pageSetup: {fitToPage: true}},
    tests: ['render', 'renderIn', 'parse'],
  },
  {
    title: 'outlineProperties',
    create() {
      return new SheetPropertiesXform();
    },
    preparedModel: {outlineProperties: {summaryBelow: false}},
    xml: '<sheetPr><outlinePr summaryBelow="0"/></sheetPr>',
    parsedModel: {outlineProperties: {summaryBelow: false}},
    tests: ['render', 'renderIn', 'parse'],
  },
  {
    title: 'tabColor + pageSetup',
    create() {
      return new SheetPropertiesXform();
    },
    preparedModel: {
      tabColor: {argb: 'FFFF0000'},
      pageSetup: {fitToPage: true},
    },
    xml:
      '<sheetPr><tabColor rgb="FFFF0000"/><pageSetUpPr fitToPage="1"/></sheetPr>',
    parsedModel: {
      tabColor: {argb: 'FFFF0000'},
      pageSetup: {fitToPage: true},
    },
    tests: ['render', 'renderIn', 'parse'],
  },
  {
    title: 'tabColor + outlineProperties',
    create() {
      return new SheetPropertiesXform();
    },
    preparedModel: {
      tabColor: {argb: 'FFFF0000'},
      outlineProperties: {summaryBelow: false},
    },
    xml:
      '<sheetPr><tabColor rgb="FFFF0000"/><outlinePr summaryBelow="0"/></sheetPr>',
    parsedModel: {
      tabColor: {argb: 'FFFF0000'},
      outlineProperties: {summaryBelow: false},
    },
    tests: ['render', 'renderIn', 'parse'],
  },
  {
    title: 'pageSetup + outlineProperties',
    create() {
      return new SheetPropertiesXform();
    },
    preparedModel: {
      pageSetup: {fitToPage: true},
      outlineProperties: {summaryBelow: false},
    },
    xml:
      '<sheetPr><outlinePr summaryBelow="0"/><pageSetUpPr fitToPage="1"/></sheetPr>',
    parsedModel: {
      pageSetup: {fitToPage: true},
      outlineProperties: {summaryBelow: false},
    },
    tests: ['render', 'renderIn', 'parse'],
  },
  {
    title: 'tabColor + outlineProperties + pageSetup',
    create() {
      return new SheetPropertiesXform();
    },
    preparedModel: {
      tabColor: {argb: 'FFFF0000'},
      outlineProperties: {summaryBelow: false},
      pageSetup: {fitToPage: true},
    },
    xml:
      '<sheetPr><tabColor rgb="FFFF0000"/><outlinePr summaryBelow="0"/><pageSetUpPr fitToPage="1"/></sheetPr>',
    parsedModel: {
      tabColor: {argb: 'FFFF0000'},
      outlineProperties: {summaryBelow: false},
      pageSetup: {fitToPage: true},
    },
    tests: ['render', 'renderIn', 'parse'],
  },
];

describe('SheetPropertiesXform', () => {
  testXformHelper(expectations);

  it('renders pageSetUpPr at the end of sheetPr in exact OOXML element order', () => {
    const xform = new SheetPropertiesXform();

    const xmlStream1 = new XmlStream();
    xform.render(xmlStream1, {
      pageSetup: {fitToPage: true},
      outlineProperties: {summaryBelow: false},
    });
    expect(xmlStream1.xml).to.equal(
      '<sheetPr><outlinePr summaryBelow="0"/><pageSetUpPr fitToPage="1"/></sheetPr>'
    );

    const xmlStream2 = new XmlStream();
    xform.render(xmlStream2, {
      tabColor: {argb: 'FFFF0000'},
      outlineProperties: {summaryBelow: false},
      pageSetup: {fitToPage: true},
    });
    expect(xmlStream2.xml).to.equal(
      '<sheetPr><tabColor rgb="FFFF0000"/><outlinePr summaryBelow="0"/><pageSetUpPr fitToPage="1"/></sheetPr>'
    );
  });
});
