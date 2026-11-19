import testXformHelper from '../test-xform-helper.js';
import VmlTextboxXform from '../../../../../lib/xlsx/xform/comment/vml-textbox-xform.js';

const expectations = [
  {
    title: 'default without autoShape',
    create() {
      return new VmlTextboxXform();
    },
    preparedModel: {
      note: {
        margins: {
          inset: [0.13, 0.13, 0.25, 0.25],
        },
      },
    },
    xml: '<v:textbox inset="1.3mm,1.3mm,2.5mm,2.5mm" style="mso-direction-alt:auto"><div style="text-align:left"/></v:textbox>',
    parsedModel: {
      inset: [0.13, 0.13, 0.25, 0.25],
    },
    tests: ['render', 'renderIn', 'parse'],
  },
  {
    title: 'with autoShape enabled',
    create() {
      return new VmlTextboxXform();
    },
    preparedModel: {
      note: {
        margins: {
          inset: [0.13, 0.13, 0.25, 0.25],
        },
        autoShape: true,
      },
    },
    xml: '<v:textbox inset="1.3mm,1.3mm,2.5mm,2.5mm" style="mso-direction-alt:auto;mso-fit-shape-to-text:t"><div style="text-align:left"/></v:textbox>',
    tests: ['render', 'renderIn'],
  },
];

describe('VmlTextboxXform', () => {
  testXformHelper(expectations);
});
