const {PassThrough} = require('readable-stream');

const ExcelJS = verquire('exceljs');
const StylesXform = verquire('xlsx/xform/style/styles-xform');
const parseSax = verquire('utils/parse-sax');

describe('PR #2095 - conditional formatting font styles preservation', () => {
  it('parses dxf font styles with val="0" as false/undefined in StylesXform', async () => {
    const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts>
  <fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>
  <borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs>
  <dxfs count="1">
    <dxf>
      <font>
        <b val="0"/>
        <i val="1"/>
        <strike val="0"/>
        <color rgb="FFFF0000"/>
      </font>
    </dxf>
  </dxfs>
</styleSheet>`;

    const stylesXform = new StylesXform();
    const stream = new PassThrough();
    stream.write(xml);
    stream.end();
    const model = await stylesXform.parse(parseSax(stream));

    expect(model.dxfs).to.be.an('array');
    expect(model.dxfs.length).to.equal(1);
    const dxf = model.dxfs[0];
    expect(dxf.font).to.be.an('object');
    expect(dxf.font.bold).to.be.undefined();
    expect(dxf.font.italic).to.equal(true);
    expect(dxf.font.strike).to.be.undefined();
    expect(dxf.font.color).to.deep.equal({argb: 'FFFF0000'});
  });

  it('preserves conditional formatting font styles round-trip through workbook save/load', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('CF-Font');
    ws.getCell('A1').value = 10;
    ws.getCell('A2').value = 20;

    ws.addConditionalFormatting({
      ref: 'A1:A2',
      rules: [
        {
          priority: 1,
          type: 'expression',
          formulae: ['A1>15'],
          style: {
            font: {
              italic: true,
              color: {argb: 'FF00AA00'},
            },
          },
        },
      ],
    });

    const buffer = await wb.xlsx.writeBuffer();

    const wb2 = new ExcelJS.Workbook();
    await wb2.xlsx.load(buffer);
    const ws2 = wb2.getWorksheet('CF-Font');

    expect(ws2.conditionalFormattings.length).to.equal(1);
    const cf = ws2.conditionalFormattings[0];
    expect(cf.rules.length).to.equal(1);
    const rule = cf.rules[0];
    expect(rule.style).to.be.an('object');
    expect(rule.style.font).to.be.an('object');
    expect(rule.style.font.italic).to.equal(true);
    expect(rule.style.font.bold).to.be.undefined();
  });
});
