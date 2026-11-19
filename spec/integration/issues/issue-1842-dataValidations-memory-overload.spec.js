import {join} from 'node:path';
import {readFileSync} from 'node:fs';
import ExcelJS from '../../../lib/exceljs.nodejs.js';

const fileName = './spec/integration/data/test-issue-1842.xlsx';

describe('github issues', () => {
  describe('issue 1842 - Memory overload when unnecessary dataValidations apply', () => {
    it('when using readFile', async () => {
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.readFile(fileName, {
        ignoreNodes: ['dataValidations'],
      });

      // arriving here is success
      expect(true).to.equal(true);
    });

    it('when loading an in memory buffer', async () => {
      const filePath = join(process.cwd(), fileName);
      const buffer = readFileSync(filePath);
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.load(buffer, {
        ignoreNodes: ['dataValidations'],
      });

      // arriving here is success
      expect(true).to.equal(true);
    });

    it('when using readFile without ignoring dataValidations', async () => {
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.readFile(fileName);

      expect(wb.worksheets.length).to.equal(1);
    });

    it('when loading an in memory buffer without ignoring dataValidations', async () => {
      const filePath = join(process.cwd(), fileName);
      const buffer = readFileSync(filePath);
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.load(buffer);

      expect(wb.worksheets.length).to.equal(1);
    });

    it('clamps large validation ranges to highest data row on load', async () => {
      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet('Sheet1');
      ws.getCell('A1').value = 'Header';
      ws.getCell('A2').value = 'Row 2';
      ws.getCell('A3').value = 'Row 3';

      const dv = {
        type: 'list',
        allowBlank: true,
        formulae: ['"One,Two,Three"'],
      };
      ws.dataValidations.add('A1:A1048576', dv);

      const buffer = await wb.xlsx.writeBuffer();
      const wb2 = new ExcelJS.Workbook();
      await wb2.xlsx.load(buffer);

      const ws2 = wb2.getWorksheet('Sheet1');
      expect(ws2.getCell('A1').dataValidation).to.deep.equal(dv);
      expect(ws2.getCell('A2').dataValidation).to.deep.equal(dv);
      expect(ws2.getCell('A3').dataValidation).to.deep.equal(dv);
      expect(ws2.getCell('A4').dataValidation).to.be.undefined();
    });
  });
});
