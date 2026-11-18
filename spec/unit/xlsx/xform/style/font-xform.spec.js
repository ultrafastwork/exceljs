const testXformHelper = require('../test-xform-helper');

const FontXform = verquire('xlsx/xform/style/font-xform');

const expectations = [
  {
    title: 'green bold',
    create() {
      return new FontXform();
    },
    preparedModel: {
      bold: true,
      size: 14,
      color: {argb: 'FF00FF00'},
      name: 'Calibri',
      family: 2,
      scheme: 'minor',
    },
    xml:
      '<font><b/><color rgb="FF00FF00"/><family val="2"/><scheme val="minor"/><sz val="14"/><name val="Calibri"/></font>',
    get parsedModel() {
      return this.preparedModel;
    },
    tests: ['render', 'renderIn', 'parse'],
  },
  {
    title: 'rPr tag',
    create() {
      return new FontXform({tagName: 'rPr', fontNameTag: 'rFont'});
    },
    preparedModel: {
      italic: true,
      size: 14,
      color: {argb: 'FF00FF00'},
      name: 'Calibri',
      family: 2,
      scheme: 'minor',
    },
    xml:
      '<rPr><i/><color rgb="FF00FF00"/><family val="2"/><scheme val="minor"/><sz val="14"/><rFont val="Calibri"/></rPr>',
    get parsedModel() {
      return this.preparedModel;
    },
    tests: ['render', 'renderIn', 'parse'],
  },
  {
    title: 'strike',
    create() {
      return new FontXform();
    },
    parsedModel: {
      strike: true,
    },
    xml: '<font><strike/></font>',
    tests: ['parse'],
  },
  {
    title: 'strike val="1"',
    create() {
      return new FontXform();
    },
    parsedModel: {
      strike: true,
    },
    xml: '<font><strike val="1"/></font>',
    tests: ['parse'],
  },
  {
    title: 'strike val="0"',
    create() {
      return new FontXform();
    },
    parsedModel: {},
    xml: '<font><strike val="0"/></font>',
    tests: ['parse'],
  },
  {
    title: 'bold val="1" italic val="0"',
    create() {
      return new FontXform();
    },
    parsedModel: {
      bold: true,
    },
    xml: '<font><b val="1"/><i val="0"/></font>',
    tests: ['parse'],
  },
  {
    title: 'bold val="0" italic val="1"',
    create() {
      return new FontXform();
    },
    parsedModel: {
      italic: true,
    },
    xml: '<font><b val="0"/><i val="1"/></font>',
    tests: ['parse'],
  },
];

describe('FontXform', () => {
  testXformHelper(expectations);
});
