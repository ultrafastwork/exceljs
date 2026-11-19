import fs from 'node:fs';
import path from 'node:path';
import ExcelJS from '../../../lib/exceljs.nodejs.js';

describe('PR #2672 - Fix unsafe-eval CSP Issue', () => {
  it('should not contain "new Function" in browser bundles', () => {
    const bundlePaths = [
      path.resolve(import.meta.dirname, '../../../dist/exceljs.js'),
      path.resolve(import.meta.dirname, '../../../dist/exceljs.min.js'),
      path.resolve(import.meta.dirname, '../../../dist/exceljs.bare.js'),
      path.resolve(import.meta.dirname, '../../../dist/exceljs.bare.min.js'),
    ];

    bundlePaths.forEach(file => {
      const code = fs.readFileSync(file, 'utf8');
      expect(code.includes('new Function')).to.be.false();
    });
  });

  it('should read and write xlsx workbooks successfully without invoking new Function', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('CSP_Test');
    ws.addRow(['ID', 'Name', 'Status']);
    ws.addRow([1, 'Strict CSP', 'Allowed']);
    ws.addRow([2, 'No eval', 'Allowed']);

    const buffer = await wb.xlsx.writeBuffer();
    expect(buffer).to.be.instanceof(Buffer);
    expect(buffer.length).to.be.greaterThan(0);

    const wbRead = new ExcelJS.Workbook();
    await wbRead.xlsx.load(buffer);
    const wsRead = wbRead.getWorksheet('CSP_Test');
    expect(wsRead).to.not.be.undefined();
    expect(wsRead.rowCount).to.equal(3);
    expect(wsRead.getRow(2).getCell(2).value).to.equal('Strict CSP');
  });
});
