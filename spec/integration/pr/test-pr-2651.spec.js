const ExcelJS = verquire('exceljs');
const JSZip = require('jszip');

describe('github issues', () => {
  it('pull request 2651 - renders negativeFillColor before negativeBorderColor in x14:dataBar', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('dataBar-ext-order');

    ws.addConditionalFormatting({
      ref: 'A1:A10',
      rules: [
        {
          type: 'dataBar',
          priority: 1,
          gradient: false,
          cfvo: [{type: 'min'}, {type: 'max'}],
          color: {argb: 'FF50FF50'},
          negativeFillColor: {argb: 'FFFF5050'},
          border: true,
          negativeBarColorSameAsPositive: false,
          negativeBarBorderColorSameAsPositive: false,
          borderColor: {argb: 'FF50FF50'},
          negativeBorderColor: {argb: 'FFFF5050'},
          axisColor: {argb: 'FF0000FF'},
        },
      ],
    });

    const buffer = await wb.xlsx.writeBuffer();

    // Inspect raw worksheet XML to ensure x14:negativeFillColor precedes x14:negativeBorderColor
    const zip = await JSZip.loadAsync(buffer);
    const sheetXml = await zip.file('xl/worksheets/sheet1.xml').async('string');

    const borderColorIndex = sheetXml.indexOf('<x14:borderColor');
    const fillIndex = sheetXml.indexOf('<x14:negativeFillColor');
    const borderIndex = sheetXml.indexOf('<x14:negativeBorderColor');
    const axisIndex = sheetXml.indexOf('<x14:axisColor');

    expect(borderColorIndex).to.be.greaterThan(-1);
    expect(fillIndex).to.be.greaterThan(borderColorIndex);
    expect(borderIndex).to.be.greaterThan(fillIndex);
    expect(axisIndex).to.be.greaterThan(borderIndex);

    // Round-trip read verification
    const wb2 = new ExcelJS.Workbook();
    await wb2.xlsx.load(buffer);
    const ws2 = wb2.getWorksheet('dataBar-ext-order');

    expect(ws2.conditionalFormattings).to.have.length(1);
    const rule = ws2.conditionalFormattings[0].rules[0];
    expect(rule.type).to.equal('dataBar');
    expect(rule.borderColor).to.deep.equal({argb: 'FF50FF50'});
    expect(rule.negativeFillColor).to.deep.equal({argb: 'FFFF5050'});
    expect(rule.negativeBorderColor).to.deep.equal({argb: 'FFFF5050'});
    expect(rule.axisColor).to.deep.equal({argb: 'FF0000FF'});
  });
});
