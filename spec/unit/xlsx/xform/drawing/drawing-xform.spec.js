import fs from 'node:fs';
import testXformHelper from '../test-xform-helper.js';
import DrawingXform from '../../../../../lib/xlsx/xform/drawing/drawing-xform.js';
import drawing10 from './data/drawing.1.0.js';
import drawing11 from './data/drawing.1.1.js';
import drawing13 from './data/drawing.1.3.js';
import drawing14 from './data/drawing.1.4.js';
import drawing20 from './data/drawing.2.0.js';
import drawing21 from './data/drawing.2.1.js';
import drawing23 from './data/drawing.2.3.js';

const options = {
  rels: {
    rId1: {Target: '../media/image1.jpg'},
    rId2: {Target: '../media/image2.jpg'},
  },
  mediaIndex: {image1: 0, image2: 1},
  media: [{}, {}],
};

const expectations = [
  {
    title: 'Drawing 1',
    create() {
      return new DrawingXform({tag: 'xdr:from'});
    },
    initialModel: drawing10,
    preparedModel: drawing11,
    xml: fs.readFileSync(`${import.meta.dirname}/data/drawing.1.2.xml`).toString(),
    parsedModel: drawing13,
    reconciledModel: drawing14,
    tests: ['prepare', 'render', 'renderIn', 'parse', 'reconcile'],
    options,
  },
  {
    title: 'Drawing 2 (Shapes)',
    create() {
      return new DrawingXform();
    },
    initialModel: drawing20,
    preparedModel: drawing21,
    xml: fs.readFileSync(`${import.meta.dirname}/data/drawing.2.2.xml`).toString(),
    parsedModel: drawing23,
    reconciledModel: drawing23,
    tests: ['prepare', 'render', 'renderIn', 'parse', 'reconcile'],
    options,
  },
];

describe('DrawingXform', () => {
  testXformHelper(expectations);
});
