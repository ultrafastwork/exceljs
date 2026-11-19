import WorksheetWriter from '../../../lib/stream/xlsx/worksheet-writer.js';
import StylesXform from '../../../lib/xlsx/xform/style/styles-xform.js';
import StreamBuf from '../../../lib/utils/stream-buf.js';

describe('Workbook Writer', () => {
  it('generates valid xml even when there is no data', () =>
    // issue: https://github.com/guyonroche/exceljs/issues/99
    // PR: https://github.com/guyonroche/exceljs/pull/255
    new Promise((resolve, reject) => {
      const mockWorkbook = {
        _openStream() {
          return this.stream;
        },
        stream: new StreamBuf(),
      };
      mockWorkbook.stream.on('finish', () => {
        try {
          const xml = mockWorkbook.stream.read().toString();
          expect(xml).xml.to.be.valid();
          resolve();
        } catch (error) {
          reject(error);
        }
      });

      const writer = new WorksheetWriter({
        id: 1,
        workbook: mockWorkbook,
      });

      writer.commit();
    }));

  it('writes conditionalFormatting and dataValidations before hyperlinks', () =>
    new Promise((resolve, reject) => {
      const sheetStream = new StreamBuf();
      const mockWorkbook = {
        _openStream(path) {
          if (path === '/xl/worksheets/sheet1.xml') {
            return sheetStream;
          }
          return new StreamBuf();
        },
        styles: new StylesXform(true),
      };

      sheetStream.on('finish', () => {
        try {
          const xml = sheetStream.read().toString();
          expect(xml).xml.to.be.valid();

          const iConditionalFormatting = xml.indexOf('<conditionalFormatting');
          const iDataValidations = xml.indexOf('<dataValidations');
          const iHyperlinks = xml.indexOf('<hyperlinks>');

          expect(iConditionalFormatting).to.not.equal(-1);
          expect(iDataValidations).to.not.equal(-1);
          expect(iHyperlinks).to.not.equal(-1);

          expect(iConditionalFormatting).to.be.lessThan(iDataValidations);
          expect(iDataValidations).to.be.lessThan(iHyperlinks);
          resolve();
        } catch (error) {
          reject(error);
        }
      });

      const writer = new WorksheetWriter({
        id: 1,
        workbook: mockWorkbook,
        useStyles: true,
      });

      writer.addRow([
        'test',
        {
          text: 'Link',
          hyperlink: 'https://example.com',
          tooltip: 'https://example.com',
        },
      ]);
      writer.addConditionalFormatting({
        ref: 'A1:B1',
        rules: [
          {
            priority: 1,
            type: 'expression',
            formulae: ['MOD(ROW(),2)=0'],
            style: {
              fill: {
                type: 'pattern',
                pattern: 'solid',
                bgColor: {argb: 'FFEDEDED'},
              },
            },
          },
        ],
      });
      writer.dataValidations.add('A1', {
        type: 'list',
        formulae: ['"One,Two"'],
      });

      writer.commit();
    }));

  it('defaults and writes outlineProperties', () =>
    new Promise((resolve, reject) => {
      const sheetStream = new StreamBuf();
      const mockWorkbook = {
        _openStream(path) {
          if (path === '/xl/worksheets/sheet1.xml') {
            return sheetStream;
          }
          return new StreamBuf();
        },
        styles: new StylesXform(true),
      };

      sheetStream.on('finish', () => {
        try {
          const xml = sheetStream.read().toString();
          expect(xml).xml.to.be.valid();
          expect(xml).to.include('<outlinePr summaryBelow="0" summaryRight="0"/>');
          resolve();
        } catch (error) {
          reject(error);
        }
      });

      const writer = new WorksheetWriter({
        id: 1,
        workbook: mockWorkbook,
        properties: {
          outlineProperties: {
            summaryBelow: false,
            summaryRight: false,
          },
        },
      });

      expect(writer.properties.outlineProperties).to.deep.equal({
        summaryBelow: false,
        summaryRight: false,
      });

      writer.commit();
    }));
});
