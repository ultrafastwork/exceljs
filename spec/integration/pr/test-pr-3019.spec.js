const ExcelJS = verquire('exceljs');

describe('github issues', () => {
  it('pull request 3019 - default values for data bar conditional formatting when minimal options are provided', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('dataBar-test');

    // minimal options: no cfvo and no color
    ws.addConditionalFormatting({
      ref: 'A1:A10',
      rules: [
        {
          type: 'dataBar',
          priority: 1,
        },
      ],
    });

    const filename = './spec/out/test-pr-3019.xlsx';
    await wb.xlsx.writeFile(filename);

    // Read back and verify the defaults are written and read successfully
    const wb2 = new ExcelJS.Workbook();
    await wb2.xlsx.readFile(filename);
    const ws2 = wb2.getWorksheet('dataBar-test');

    expect(ws2.conditionalFormattings).to.not.be.undefined();
    expect(ws2.conditionalFormattings.length).to.equal(1);
    const cf = ws2.conditionalFormattings[0];
    expect(cf.ref).to.equal('A1:A10');
    expect(cf.rules.length).to.equal(1);
    const rule = cf.rules[0];
    expect(rule.type).to.equal('dataBar');

    // Check that default values (cfvo and color) were rendered correctly and read back
    expect(rule.cfvo).to.deep.equal([
      {type: 'min', value: undefined},
      {type: 'max', value: undefined},
    ]);
    expect(rule.color).to.deep.equal({argb: 'FF638EC6'});
  });

  it('pull request 3019 - default values for data bar conditional formatting with WorkbookWriter', async () => {
    const filename = './spec/out/test-pr-3019-writer.xlsx';
    const wb = new ExcelJS.stream.xlsx.WorkbookWriter({
      filename,
      useStyles: true,
    });
    const ws = wb.addWorksheet('dataBar-test');

    ws.addConditionalFormatting({
      ref: 'A1:A10',
      rules: [
        {
          type: 'dataBar',
          priority: 1,
        },
      ],
    });

    await wb.commit();

    // Read back and verify
    const wb2 = new ExcelJS.Workbook();
    await wb2.xlsx.readFile(filename);
    const ws2 = wb2.getWorksheet('dataBar-test');

    expect(ws2.conditionalFormattings).to.not.be.undefined();
    expect(ws2.conditionalFormattings.length).to.equal(1);
    const cf = ws2.conditionalFormattings[0];
    const rule = cf.rules[0];
    expect(rule.type).to.equal('dataBar');
    expect(rule.cfvo).to.deep.equal([
      {type: 'min', value: undefined},
      {type: 'max', value: undefined},
    ]);
    expect(rule.color).to.deep.equal({argb: 'FF638EC6'});
  });
});
