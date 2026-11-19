import fs from 'node:fs';
import testXformHelper from '../test-xform-helper.js';
import StylesXform from '../../../../../lib/xlsx/xform/style/styles-xform.js';
import XmlStream from '../../../../../lib/utils/xml-stream.js';
import styles11 from './data/styles.1.1.json' with {type: 'json'};

const expectations = [
  {
    title: 'Styles with fonts',
    create() {
      return new StylesXform();
    },
    preparedModel: styles11,
    xml: fs.readFileSync(`${import.meta.dirname}/data/styles.1.2.xml`).toString(),
    get parsedModel() {
      return this.preparedModel;
    },
    tests: ['render', 'renderIn', 'parse'],
  },
];

describe('StylesXform', () => {
  testXformHelper(expectations);

  describe('As StyleManager', () => {
    it('Renders empty model', () => {
      const stylesXform = new StylesXform(true);
      const expectedXml = fs.readFileSync(`${import.meta.dirname}/data/styles.2.2.xml`).toString();

      const xmlStream = new XmlStream();
      stylesXform.render(xmlStream);

      expect(xmlStream.xml).xml.to.equal(expectedXml);
    });

    it('Extracts formatCode when addDxfStyle receives numFmt as an object', () => {
      const stylesXform = new StylesXform(true);
      const dxfId = stylesXform.addDxfStyle({
        numFmt: {id: 164, formatCode: '"$"#,##0.00'},
      });

      expect(dxfId).to.equal(0);

      const xmlStream = new XmlStream();
      stylesXform.render(xmlStream);

      expect(xmlStream.xml).to.not.include('[object Object]');
      expect(xmlStream.xml).to.include('formatCode="&quot;$&quot;#,##0.00"');
    });

    it('Renders dxf numFmt when addDxfStyle receives numFmt as a string', () => {
      const stylesXform = new StylesXform(true);
      const dxfId = stylesXform.addDxfStyle({
        numFmt: '0.00%',
      });

      expect(dxfId).to.equal(0);

      const xmlStream = new XmlStream();
      stylesXform.render(xmlStream);

      expect(xmlStream.xml).to.include('formatCode="0.00%"');
    });

    it('Supports stylesCacheMode FAST_MAP, JSON_MAP, WEAK_MAP, and NO_CACHE (PR #2867)', () => {
      ['WEAK_MAP', 'JSON_MAP', 'FAST_MAP', 'NO_CACHE'].forEach(mode => {
        const stylesXform = new StylesXform(true, mode);
        const style1 = {
          font: {name: 'Arial', size: 12, bold: true},
          numFmt: '0.00',
        };
        const style2 = {
          font: {name: 'Arial', size: 12, bold: true},
          numFmt: '0.00',
        };

        const id1 = stylesXform.addStyleModel(style1);
        const id2 = stylesXform.addStyleModel(style2);

        expect(id1).to.equal(id2);
        expect(stylesXform.model.styles.length).to.equal(2);
      });
    });
  });
});
