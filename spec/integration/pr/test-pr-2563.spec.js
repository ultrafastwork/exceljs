import ExcelJS from '../../../lib/exceljs.nodejs.js';
import JSZip from 'jszip';

const COMMENTS_AND_HTIMAGE_XLSX_FILE_NAME = './spec/out/comments-headerImage.test.xlsx';
const COMMENTS_AND_HTIMAGE_AND_SHEETIMAGE_XLSX_FILE_NAME =
  './spec/out/comments-headerImage-sheetimage.test.xlsx';
const TEST_HF_IMAGE_OUT = './spec/out/test-hf-image.xlsx';
const IMAGE_FILENAME = `${import.meta.dirname}/../data/image.png`;

describe('pull request 2563', () => {
  it('pull request 2563 - header and footer support image', async () => {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile('./spec/integration/data/comments-headerImage.xlsx');
    const ws = wb.getWorksheet(1);
    expect(ws.hfImages).to.be.an('array');
    expect(ws.hfImages.length).to.be.greaterThan(0);
    await wb.xlsx.writeFile(COMMENTS_AND_HTIMAGE_XLSX_FILE_NAME);

    const wb2 = new ExcelJS.Workbook();
    await wb2.xlsx.readFile(COMMENTS_AND_HTIMAGE_XLSX_FILE_NAME);
    const ws2 = wb2.getWorksheet(1);
    expect(ws2.hfImages.length).to.equal(ws.hfImages.length);
  });

  it('pull request 2563 - sheet image and hf image', async () => {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile('./spec/integration/data/comments-headerImage-sheetimage.xlsx');
    const ws = wb.getWorksheet(1);
    expect(ws.hfImages).to.be.an('array');
    expect(ws.hfImages.length).to.be.greaterThan(0);
    expect(ws.getImages().length).to.be.greaterThan(0);
    await wb.xlsx.writeFile(COMMENTS_AND_HTIMAGE_AND_SHEETIMAGE_XLSX_FILE_NAME);

    const wb2 = new ExcelJS.Workbook();
    await wb2.xlsx.readFile(COMMENTS_AND_HTIMAGE_AND_SHEETIMAGE_XLSX_FILE_NAME);
    const ws2 = wb2.getWorksheet(1);
    expect(ws2.hfImages.length).to.equal(ws.hfImages.length);
    expect(ws2.getImages().length).to.equal(ws.getImages().length);
  });

  it('supports programmatic addHFImage writing and reading', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('HFSheet');
    ws.getCell('A1').value = 'Test HF Image';
    ws.headerFooter.oddHeader = '&R&G image';

    const imageId = wb.addImage({
      filename: IMAGE_FILENAME,
      extension: 'png',
    });
    ws.addHFImage(imageId, {id: 'HF', width: '15pt', height: '15pt'});

    const buffer = await wb.xlsx.writeBuffer();
    const zip = await JSZip.loadAsync(buffer);

    // Verify vml file and rels file are created in zip
    expect(zip.files['xl/drawings/vmlDrawing1.vml']).to.not.be.undefined();
    expect(zip.files['xl/drawings/_rels/vmlDrawing1.vml.rels']).to.not.be.undefined();

    const sheetXml = await zip.files['xl/worksheets/sheet1.xml'].async('string');
    expect(sheetXml).to.include('<legacyDrawingHF');

    await wb.xlsx.writeFile(TEST_HF_IMAGE_OUT);

    const wb2 = new ExcelJS.Workbook();
    await wb2.xlsx.readFile(TEST_HF_IMAGE_OUT);
    const ws2 = wb2.getWorksheet('HFSheet');
    expect(ws2.hfImages).to.be.an('array');
    expect(ws2.hfImages.length).to.equal(1);
    expect(ws2.hfImages[0].id).to.equal('HF');
    expect(ws2.hfImages[0].style.width).to.equal('15pt');
    expect(ws2.hfImages[0].style.height).to.equal('15pt');
  });
});
