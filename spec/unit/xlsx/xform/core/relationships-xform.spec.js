import fs from 'node:fs';
import testXformHelper from '../test-xform-helper.js';
import RelationshipsXform from '../../../../../lib/xlsx/xform/core/relationships-xform.js';
import worksheetRels1 from './data/worksheet.rels.1.json' with {type: 'json'};

const expectations = [
  {
    title: 'worksheet.rels',
    create() {
      return new RelationshipsXform();
    },
    preparedModel: worksheetRels1,
    xml: fs
      .readFileSync(`${import.meta.dirname}/data/worksheet.rels.xml`)
      .toString()
      .replace(/\r\n/g, '\n'),
    get parsedModel() {
      return this.preparedModel;
    },
    tests: ['render', 'renderIn', 'parse'],
  },
];

describe('RelationshipsXform', () => {
  testXformHelper(expectations);
});
