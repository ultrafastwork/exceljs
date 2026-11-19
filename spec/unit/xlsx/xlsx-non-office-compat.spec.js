const JSZip = require('jszip');

const ExcelJS = verquire('exceljs.nodejs');

describe('XLSX non-Office compatibility', () => {
  let originalWarn;
  let warnings;

  beforeEach(() => {
    originalWarn = console.warn;
    warnings = [];
    console.warn = (...args) => {
      warnings.push(args.join(' '));
    };
  });

  afterEach(() => {
    console.warn = originalWarn;
  });

  async function createBaseXlsxBuffer() {
    const wb = new ExcelJS.Workbook();
    wb.creator = 'TestCreator';
    wb.company = 'TestCompany';
    const ws = wb.addWorksheet('Sheet1');
    ws.getCell('A1').value = 'hello';
    ws.getCell('B2').value = 42;
    return wb.xlsx.writeBuffer();
  }

  it('loads valid xlsx without warnings', async () => {
    const buffer = await createBaseXlsxBuffer();
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(buffer);

    const ws = wb.getWorksheet('Sheet1');
    expect(ws.getCell('A1').value).to.equal('hello');
    expect(ws.getCell('B2').value).to.equal(42);
    expect(wb.creator).to.equal('TestCreator');
    expect(wb.company).to.equal('TestCompany');
    expect(warnings).to.have.lengthOf(0);
  });

  it('warns and continues loading when docProps/app.xml is malformed', async () => {
    const baseBuffer = await createBaseXlsxBuffer();
    const zip = await JSZip.loadAsync(baseBuffer);
    zip.file('docProps/app.xml', '<Properties><Company>A</Wrong></Properties>');
    const modifiedBuffer = await zip.generateAsync({type: 'nodebuffer'});

    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(modifiedBuffer);

    const ws = wb.getWorksheet('Sheet1');
    expect(ws.getCell('A1').value).to.equal('hello');
    expect(ws.getCell('B2').value).to.equal(42);
    expect(warnings.some(w => w.includes('Invalid docProps/app.xml:'))).to.be.true();
  });

  it('continues loading when docProps/core.xml has unexpected root element', async () => {
    const baseBuffer = await createBaseXlsxBuffer();
    const zip = await JSZip.loadAsync(baseBuffer);
    zip.file(
      'docProps/core.xml',
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><invalidCore><dc:creator>3rdParty</dc:creator></invalidCore>',
    );
    const modifiedBuffer = await zip.generateAsync({type: 'nodebuffer'});

    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(modifiedBuffer);

    const ws = wb.getWorksheet('Sheet1');
    expect(ws.getCell('A1').value).to.equal('hello');
    expect(ws.getCell('B2').value).to.equal(42);
  });

  it('warns and continues loading when docProps/core.xml is malformed', async () => {
    const baseBuffer = await createBaseXlsxBuffer();
    const zip = await JSZip.loadAsync(baseBuffer);
    zip.file('docProps/core.xml', '<cp:coreProperties><dc:creator>A</Wrong></cp:coreProperties>');
    const modifiedBuffer = await zip.generateAsync({type: 'nodebuffer'});

    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(modifiedBuffer);

    const ws = wb.getWorksheet('Sheet1');
    expect(ws.getCell('A1').value).to.equal('hello');
    expect(ws.getCell('B2').value).to.equal(42);
    expect(warnings.some(w => w.includes('Invalid docProps/core.xml:'))).to.be.true();
  });

  it('inserts default theme1.xml when saving workbook loaded without themes', async () => {
    const baseBuffer = await createBaseXlsxBuffer();
    const zip = await JSZip.loadAsync(baseBuffer);
    zip.remove('xl/theme/theme1.xml');
    zip.remove('xl/theme');
    const withoutThemeBuffer = await zip.generateAsync({type: 'nodebuffer'});

    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(withoutThemeBuffer);
    expect(wb.model.themes).to.deep.equal({});

    const savedBuffer = await wb.xlsx.writeBuffer();
    const savedZip = await JSZip.loadAsync(savedBuffer);
    expect(savedZip.file('xl/theme/theme1.xml')).to.not.be.null();
  });
});
