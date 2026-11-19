import path from 'node:path';
import ExcelJS from '../../../lib/exceljs.nodejs.js';

const IMAGE_FILENAME = path.resolve(import.meta.dirname, '../data/image.png');

describe('PR #2614 - fix: addImage position is wrong', () => {
  it('correctly calculates image anchor position with defaultRowHeight and defaultColWidth', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('image-pos');
    ws.properties.defaultRowHeight = 100;
    ws.properties.defaultColWidth = 20;

    const imageId = wb.addImage({
      filename: IMAGE_FILENAME,
      extension: 'png',
    });

    ws.addImage(imageId, {
      tl: {col: 0.5, row: 0.5},
      ext: {width: 100, height: 100},
    });

    const images = ws.getImages();
    expect(images.length).to.equal(1);
    const {tl} = images[0].range;

    const expectedColWidth = Math.floor(20 * (640000 / 8.43));
    const expectedRowHeight = Math.floor(100 * (180000 / 15));

    expect(tl.colWidth).to.equal(expectedColWidth);
    expect(tl.rowHeight).to.equal(expectedRowHeight);
    expect(tl.nativeCol).to.equal(0);
    expect(tl.nativeRow).to.equal(0);
    expect(tl.nativeColOff).to.equal(Math.floor(0.5 * expectedColWidth));
    expect(tl.nativeRowOff).to.equal(Math.floor(0.5 * expectedRowHeight));

    const buffer = await wb.xlsx.writeBuffer();
    const wb2 = new ExcelJS.Workbook();
    await wb2.xlsx.load(buffer);
    const ws2 = wb2.getWorksheet('image-pos');
    const images2 = ws2.getImages();
    expect(images2.length).to.equal(1);
    expect(images2[0].range.tl.nativeCol).to.equal(0);
    expect(images2[0].range.tl.nativeRow).to.equal(0);
  });

  it('correctly calculates image anchor position with custom column width and row height', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('image-pos-custom');
    ws.getRow(1).height = 80;
    ws.getColumn(1).width = 25;

    const imageId = wb.addImage({
      filename: IMAGE_FILENAME,
      extension: 'png',
    });

    ws.addImage(imageId, {
      tl: {col: 0.5, row: 0.5},
      ext: {width: 100, height: 100},
    });

    const images = ws.getImages();
    expect(images.length).to.equal(1);
    const {tl} = images[0].range;

    const expectedColWidth = Math.floor(25 * (640000 / 8.43));
    const expectedRowHeight = Math.floor(80 * (180000 / 15));

    expect(tl.colWidth).to.equal(expectedColWidth);
    expect(tl.rowHeight).to.equal(expectedRowHeight);
    expect(tl.nativeColOff).to.equal(Math.floor(0.5 * expectedColWidth));
    expect(tl.nativeRowOff).to.equal(Math.floor(0.5 * expectedRowHeight));
  });

  it('PR #1688 - correctly positions two-cell anchor image with non-integer coordinates when cells are resized', async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('image-pos-two-cell');
    ws.getColumn(2).width = 20;
    ws.getRow(6).height = 40;
    ws.getColumn(9).width = 30;
    ws.getRow(11).height = 50;

    const imageId = wb.addImage({
      filename: IMAGE_FILENAME,
      extension: 'png',
    });

    ws.addImage(imageId, {
      tl: {col: 1.1, row: 5.83},
      br: {col: 8.85, row: 10.2},
    });

    const images = ws.getImages();
    expect(images.length).to.equal(1);
    const {tl, br} = images[0].range;

    const expectedTlColWidth = Math.floor(20 * (640000 / 8.43));
    const expectedTlRowHeight = Math.floor(40 * (180000 / 15));
    const expectedBrColWidth = Math.floor(30 * (640000 / 8.43));
    const expectedBrRowHeight = Math.floor(50 * (180000 / 15));

    expect(tl.nativeCol).to.equal(1);
    expect(tl.nativeRow).to.equal(5);
    expect(tl.nativeColOff).to.equal(Math.floor((1.1 - 1) * expectedTlColWidth));
    expect(tl.nativeRowOff).to.equal(Math.floor((5.83 - 5) * expectedTlRowHeight));

    expect(br.nativeCol).to.equal(8);
    expect(br.nativeRow).to.equal(10);
    expect(br.nativeColOff).to.equal(Math.floor((8.85 - 8) * expectedBrColWidth));
    expect(br.nativeRowOff).to.equal(Math.floor((10.2 - 10) * expectedBrRowHeight));
  });
});
