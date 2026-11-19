import fs from 'node:fs';
import JSZip from 'jszip';
import ExcelJS from '../../../lib/exceljs.nodejs.js';

const TEST_XLSX_FILE_1 = './spec/out/test-pr-2698-1.xlsx';
const TEST_XLSX_FILE_2 = './spec/out/test-pr-2698-2.xlsx';

describe('github issues', () => {
  it('pull request 2698 - style.xml has [object Object] as formatCode on round-trip', async () => {
    const formatCode = '"Custom" 0.00';

    const wb1 = new ExcelJS.Workbook();
    const ws1 = wb1.addWorksheet('Sheet1');
    ws1.getCell('A1').value = 'NO';
    ws1.addConditionalFormatting({
      ref: 'A1:C1',
      rules: [
        {
          type: 'expression',
          priority: 1,
          formulae: ['$A$1="NO"'],
          style: {
            numFmt: formatCode,
            fill: {
              type: 'pattern',
              pattern: 'solid',
              bgColor: {argb: 'FFFFFF00'},
            },
          },
        },
      ],
    });

    await wb1.xlsx.writeFile(TEST_XLSX_FILE_1);

    const wb2 = new ExcelJS.Workbook();
    await wb2.xlsx.readFile(TEST_XLSX_FILE_1);
    await wb2.xlsx.writeFile(TEST_XLSX_FILE_2);

    const data = fs.readFileSync(TEST_XLSX_FILE_2);
    const zip = await JSZip.loadAsync(data);
    const stylesXml = await zip.file('xl/styles.xml').async('string');

    expect(stylesXml).to.not.include('[object Object]');
    expect(stylesXml).to.include('formatCode="&quot;Custom&quot; 0.00"');

    const wb3 = new ExcelJS.Workbook();
    await wb3.xlsx.readFile(TEST_XLSX_FILE_2);
    const ws3 = wb3.getWorksheet('Sheet1');
    expect(ws3.conditionalFormattings).to.have.lengthOf(1);
    expect(ws3.conditionalFormattings[0].rules[0].style.numFmt).to.exist();
    expect(ws3.conditionalFormattings[0].rules[0].style.numFmt.formatCode).to.equal(formatCode);
  });
});
