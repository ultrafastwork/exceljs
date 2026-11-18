const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

const ExcelJS = verquire('exceljs');

const TEST_XLSX_FILE_NAME = path.resolve(__dirname, '../../out/wb-pr-2685.test.xlsx');

describe('PR #2685 - Fix error saving files when streaming using autofilter and sheet protection', function() {
  this.timeout(10000);

  afterEach(() => {
    try {
      if (fs.existsSync(TEST_XLSX_FILE_NAME)) {
        fs.unlinkSync(TEST_XLSX_FILE_NAME);
      }
    } catch (e) {
      // ignore
    }
  });

  it('should write sheetProtection before autoFilter in XML and allow reading back successfully', async () => {
    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
      filename: TEST_XLSX_FILE_NAME,
      useStyles: true,
    });

    const worksheet = workbook.addWorksheet('test');
    worksheet.addRow([3, 'Sam', new Date(2024, 0, 1)]).commit();
    worksheet.autoFilter = {from: 'A1', to: 'C1'};
    await worksheet.protect('test', {
      formatColumns: true,
      formatRows: true,
      autoFilter: true,
      pivotTables: true,
    });
    worksheet.commit();
    await workbook.commit();

    // 1. Inspect raw XML via JSZip to verify correct OpenXML schema sequence
    const fileBuffer = fs.readFileSync(TEST_XLSX_FILE_NAME);
    const zip = await JSZip.loadAsync(fileBuffer);
    const sheetXml = await zip.file('xl/worksheets/sheet1.xml').async('text');

    const sheetDataEndIndex = sheetXml.indexOf('</sheetData>');
    const sheetProtectionIndex = sheetXml.indexOf('<sheetProtection');
    const autoFilterIndex = sheetXml.indexOf('<autoFilter');

    expect(sheetDataEndIndex).to.be.greaterThan(-1);
    expect(sheetProtectionIndex).to.be.greaterThan(-1);
    expect(autoFilterIndex).to.be.greaterThan(-1);

    // OpenXML CT_Worksheet schema sequence: </sheetData> -> <sheetProtection .../> -> <autoFilter .../>
    expect(sheetDataEndIndex).to.be.lessThan(sheetProtectionIndex);
    expect(sheetProtectionIndex).to.be.lessThan(autoFilterIndex);

    // 2. Read back via ExcelJS.Workbook to verify compatibility
    const checkBook = new ExcelJS.Workbook();
    await checkBook.xlsx.readFile(TEST_XLSX_FILE_NAME);

    const checkSheet = checkBook.getWorksheet('test');
    expect(checkSheet).to.exist();
    expect(checkSheet.autoFilter).to.equal('A1:C1');
    expect(checkSheet.sheetProtection).to.exist();
    expect(checkSheet.sheetProtection.sheet).to.equal(true);
    expect(checkSheet.sheetProtection.formatColumns).to.equal(true);
    expect(checkSheet.sheetProtection.formatRows).to.equal(true);
    expect(checkSheet.sheetProtection.autoFilter).to.equal(true);
    expect(checkSheet.sheetProtection.pivotTables).to.equal(true);
    expect(checkSheet.getCell('A1').value).to.equal(3);
    expect(checkSheet.getCell('B1').value).to.equal('Sam');
  });

  it('should preserve element sequence with autoFilter, sheetProtection, and mergeCells', async () => {
    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
      filename: TEST_XLSX_FILE_NAME,
      useStyles: true,
    });

    const worksheet = workbook.addWorksheet('test');
    worksheet.mergeCells('A1:B1');
    worksheet.getCell('A1').value = 'Merged Header';
    worksheet.getCell('C1').value = 'Col 3';
    worksheet.addRow(['Data 1', 'Data 2', 'Data 3']).commit();

    worksheet.autoFilter = 'A1:C2';
    await worksheet.protect('secret', {
      selectLockedCells: true,
      selectUnlockedCells: true,
    });

    worksheet.commit();
    await workbook.commit();

    const fileBuffer = fs.readFileSync(TEST_XLSX_FILE_NAME);
    const zip = await JSZip.loadAsync(fileBuffer);
    const sheetXml = await zip.file('xl/worksheets/sheet1.xml').async('text');

    const sheetProtectionIndex = sheetXml.indexOf('<sheetProtection');
    const autoFilterIndex = sheetXml.indexOf('<autoFilter');
    const mergeCellsIndex = sheetXml.indexOf('<mergeCells');

    expect(sheetProtectionIndex).to.be.greaterThan(-1);
    expect(autoFilterIndex).to.be.greaterThan(-1);
    expect(mergeCellsIndex).to.be.greaterThan(-1);

    // Order must be sheetProtection -> autoFilter -> mergeCells
    expect(sheetProtectionIndex).to.be.lessThan(autoFilterIndex);
    expect(autoFilterIndex).to.be.lessThan(mergeCellsIndex);
  });
});
