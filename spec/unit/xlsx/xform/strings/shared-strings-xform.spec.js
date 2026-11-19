import fs from 'node:fs';
import testXformHelper from '../test-xform-helper.js';
import SharedStringsXform from '../../../../../lib/xlsx/xform/strings/shared-strings-xform.js';
import sharedStrings2 from './data/sharedStrings.json' with {type: 'json'};

const expectations = [
  {
    title: 'Shared Strings',
    create() {
      return new SharedStringsXform();
    },
    preparedModel: sharedStrings2,
    xml: fs.readFileSync(`${import.meta.dirname}/data/sharedStrings.xml`).toString(),
    get parsedModel() {
      return this.preparedModel;
    },
    tests: ['render', 'renderIn', 'parse'],
  },
];

describe('SharedStringsXform', () => {
  testXformHelper(expectations);
});
