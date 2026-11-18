const fs = require('fs');

const testXformHelper = require('../test-xform-helper');

const StylesXform = verquire('xlsx/xform/style/styles-xform');
const XmlStream = verquire('utils/xml-stream');

const expectations = [
  {
    title: 'Styles with fonts',
    create() {
      return new StylesXform();
    },
    preparedModel: require('./data/styles.1.1.json'),
    xml: fs.readFileSync(`${__dirname}/data/styles.1.2.xml`).toString(),
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
      const expectedXml = fs
        .readFileSync(`${__dirname}/data/styles.2.2.xml`)
        .toString();

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
  });
});
