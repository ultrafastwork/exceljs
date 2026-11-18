const DxfXform = verquire('xlsx/xform/style/dxf-xform');
const XmlStream = verquire('utils/xml-stream');

describe('DxfXform', () => {
  it('renders numFmt when numFmt is a string', () => {
    const dxfXform = new DxfXform();
    const xmlStream = new XmlStream();

    dxfXform.render(xmlStream, {
      numFmt: '0.00%',
      numFmtId: 10,
    });

    expect(xmlStream.xml).xml.to.equal(
      '<dxf><numFmt numFmtId="10" formatCode="0.00%"/></dxf>'
    );
  });

  it('renders numFmt when numFmt is an object with formatCode', () => {
    const dxfXform = new DxfXform();
    const xmlStream = new XmlStream();

    dxfXform.render(xmlStream, {
      numFmt: {id: 164, formatCode: '"$"#,##0.00'},
      numFmtId: 164,
    });

    expect(xmlStream.xml).to.not.include('[object Object]');
    expect(xmlStream.xml).xml.to.equal(
      '<dxf><numFmt numFmtId="164" formatCode="&quot;$&quot;#,##0.00"/></dxf>'
    );
  });
});
