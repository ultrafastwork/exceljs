import testXformHelper from '../test-xform-helper.js';
import SharedStringXform from '../../../../../lib/xlsx/xform/strings/shared-string-xform.js';

const expectations = [
  {
    title: 'text',
    create() {
      return new SharedStringXform();
    },
    preparedModel: 'Hello, World!',
    xml: '<si><t>Hello, World!</t></si>',
    parsedModel: 'Hello, World!',
    tests: ['render', 'renderIn', 'parse'],
  },
  {
    title: 'rich text',
    create() {
      return new SharedStringXform();
    },
    preparedModel: {
      richText: [
        {
          font: {
            size: 11,
            bold: true,
            color: {theme: 1},
            name: 'Calibri',
            family: 2,
            scheme: 'minor',
          },
          text: 'Bold,',
        },
      ],
    },
    xml: '<si><r><rPr><b/><color theme="1"/><family val="2"/><scheme val="minor"/><sz val="11"/><rFont val="Calibri"/></rPr><t>Bold,</t></r></si>',
    parsedModel: {
      richText: [
        {
          font: {
            size: 11,
            bold: true,
            color: {theme: 1},
            name: 'Calibri',
            family: 2,
            scheme: 'minor',
          },
          text: 'Bold,',
        },
      ],
    },
    tests: ['render', 'renderIn', 'parse'],
  },
  {
    title: 'richText is empty',
    create() {
      return new SharedStringXform();
    },
    preparedModel: {
      richText: [],
    },
    xml: '<si><t></t></si>',
    parsedModel: '',
    tests: ['parse'],
  },
  {
    title: 'text + phonetic',
    create() {
      return new SharedStringXform();
    },
    preparedModel: {
      text: 'Hello, World!',
      phoneticText: {text: 'Helow woruld'},
    },
    xml: '<si><t>Hello, World!</t><rPh eb="0" sb="0"><t>Helow woruld</t></rPh></si>',
    parsedModel: 'Hello, World!',
    tests: ['parse'],
  },
  {
    title: 'Kanji + Katakana',
    create() {
      return new SharedStringXform();
    },
    preparedModel: {
      text: '役割',
      phoneticText: {
        sb: 0,
        eb: 2,
        text: 'ヤクワリ',
        properties: {fontId: 1},
      },
    },
    xml: '<si><t>役割</t><rPh sb="0" eb="2"><t>ヤクワリ</t></rPh><phoneticPr fontId="1" /></si>',
    parsedModel: '役割',
    tests: ['parse'],
  },
  {
    title: 'text with newline',
    create() {
      return new SharedStringXform();
    },
    preparedModel: 'Hello,\nWorld!',
    xml: '<si><t xml:space="preserve">Hello,\nWorld!</t></si>',
    parsedModel: 'Hello,\nWorld!',
    tests: ['render', 'renderIn', 'parse'],
  },
  {
    title: 'rich text with empty substring',
    create() {
      return new SharedStringXform();
    },
    preparedModel: {
      richText: [
        {
          font: {size: 10, color: {argb: 'FFFF0000'}},
          text: 'Test 1',
        },
        {
          font: {size: 10, color: {argb: 'FF00FF00'}},
          text: '',
        },
        {
          font: {size: 10, color: {argb: 'FF0000FF'}},
          text: 'Test 2',
        },
      ],
    },
    xml: '<si><r><rPr><color rgb="FFFF0000"/><sz val="10"/></rPr><t>Test 1</t></r><r><rPr><color rgb="FF0000FF"/><sz val="10"/></rPr><t>Test 2</t></r></si>',
    tests: ['render', 'renderIn'],
  },
  {
    title: 'rich text with whitespace-only substring',
    create() {
      return new SharedStringXform();
    },
    preparedModel: {
      richText: [{text: 'Test 1'}, {text: ' '}, {text: 'Test 2'}],
    },
    xml: '<si><r><t>Test 1</t></r><r><t xml:space="preserve"> </t></r><r><t>Test 2</t></r></si>',
    tests: ['render', 'renderIn'],
  },
  {
    title: 'rich text with all empty substrings',
    create() {
      return new SharedStringXform();
    },
    preparedModel: {
      richText: [{font: {size: 10}, text: ''}, {text: ''}],
    },
    xml: '<si><t/></si>',
    tests: ['render', 'renderIn'],
  },
  {
    title: 'rich text preceded by empty t tag',
    create() {
      return new SharedStringXform();
    },
    xml: '<si><t></t><r><rPr><sz val="10"/><color theme="10"/><rFont val="Calibri"/><family val="2"/></rPr><t>https://github.com/exceljs/exceljs</t></r></si>',
    parsedModel: {
      richText: [
        {
          font: {
            size: 10,
            color: {theme: 10},
            name: 'Calibri',
            family: 2,
          },
          text: 'https://github.com/exceljs/exceljs',
        },
      ],
    },
    tests: ['parse'],
  },
];

describe('SharedStringXform', () => {
  testXformHelper(expectations);
});
