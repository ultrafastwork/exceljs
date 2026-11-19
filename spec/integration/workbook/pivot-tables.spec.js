// *Note*: `fs.promises` not supported before Node.js 11.14.0;
// ExcelJS version range '>=8.3.0' (as of 2023-10-08).
const fs = require('fs');
const {promisify} = require('util');

const fsReadFileAsync = promisify(fs.readFile);

const JSZip = require('jszip');

const ExcelJS = verquire('exceljs');

const PIVOT_TABLE_FILEPATHS = [
  'xl/pivotCache/pivotCacheRecords1.xml',
  'xl/pivotCache/pivotCacheDefinition1.xml',
  'xl/pivotCache/_rels/pivotCacheDefinition1.xml.rels',
  'xl/pivotTables/pivotTable1.xml',
  'xl/pivotTables/_rels/pivotTable1.xml.rels',
];

const TEST_XLSX_FILEPATH = './spec/out/wb.test.xlsx';

const TEST_DATA = [
  ['A', 'B', 'C', 'D', 'E'],
  ['a1', 'b1', 'c1', 4, 5],
  ['a1', 'b2', 'c1', 4, 5],
  ['a2', 'b1', 'c2', 14, 24],
  ['a2', 'b2', 'c2', 24, 35],
  ['a3', 'b1', 'c3', 34, 45],
  ['a3', 'b2', 'c3', 44, 45],
];

// =============================================================================
// Tests

describe('Workbook', () => {
  describe('Pivot Tables', () => {
    it('if pivot table added, then certain xml and rels files are added', async () => {
      const workbook = new ExcelJS.Workbook();

      const worksheet1 = workbook.addWorksheet('Sheet1');
      worksheet1.addRows(TEST_DATA);

      const worksheet2 = workbook.addWorksheet('Sheet2');
      worksheet2.addPivotTable({
        sourceSheet: worksheet1,
        rows: ['A', 'B'],
        columns: ['C'],
        values: ['E'],
        metric: 'sum',
      });

      return workbook.xlsx.writeFile(TEST_XLSX_FILEPATH).then(async () => {
        const buffer = await fsReadFileAsync(TEST_XLSX_FILEPATH);
        const zip = await JSZip.loadAsync(buffer);
        for (const filepath of PIVOT_TABLE_FILEPATHS) {
          expect(zip.files[filepath]).to.not.be.undefined();
        }
      });
    });

    it('if pivot table NOT added, then certain xml and rels files are not added', () => {
      const workbook = new ExcelJS.Workbook();

      const worksheet1 = workbook.addWorksheet('Sheet1');
      worksheet1.addRows(TEST_DATA);

      workbook.addWorksheet('Sheet2');

      return workbook.xlsx.writeFile(TEST_XLSX_FILEPATH).then(async () => {
        const buffer = await fsReadFileAsync(TEST_XLSX_FILEPATH);
        const zip = await JSZip.loadAsync(buffer);
        for (const filepath of PIVOT_TABLE_FILEPATHS) {
          expect(zip.files[filepath]).to.be.undefined();
        }
      });
    });

    it('defaults applyWidthHeightFormats to "1" in pivotTable1.xml', async () => {
      const workbook = new ExcelJS.Workbook();

      const worksheet1 = workbook.addWorksheet('Sheet1');
      worksheet1.addRows(TEST_DATA);

      const worksheet2 = workbook.addWorksheet('Sheet2');
      worksheet2.addPivotTable({
        sourceSheet: worksheet1,
        rows: ['A', 'B'],
        columns: ['C'],
        values: ['E'],
        metric: 'sum',
      });

      await workbook.xlsx.writeFile(TEST_XLSX_FILEPATH);
      const buffer = await fsReadFileAsync(TEST_XLSX_FILEPATH);
      const zip = await JSZip.loadAsync(buffer);
      const pivotXml = await zip.files['xl/pivotTables/pivotTable1.xml'].async('string');
      expect(pivotXml).to.include('applyWidthHeightFormats="1"');
    });

    it('sets applyWidthHeightFormats to "0" and preserves custom column widths', async () => {
      const workbook = new ExcelJS.Workbook();

      const worksheet1 = workbook.addWorksheet('Sheet1');
      worksheet1.addRows(TEST_DATA);

      const worksheet2 = workbook.addWorksheet('Sheet2');
      worksheet2.getColumn(1).width = 30;
      worksheet2.getColumn(2).width = 15;
      worksheet2.addPivotTable({
        sourceSheet: worksheet1,
        rows: ['A', 'B'],
        columns: ['C'],
        values: ['E'],
        metric: 'sum',
        applyWidthHeightFormats: '0',
      });

      await workbook.xlsx.writeFile(TEST_XLSX_FILEPATH);
      const buffer = await fsReadFileAsync(TEST_XLSX_FILEPATH);
      const zip = await JSZip.loadAsync(buffer);
      const pivotXml = await zip.files['xl/pivotTables/pivotTable1.xml'].async('string');
      expect(pivotXml).to.include('applyWidthHeightFormats="0"');

      const wb2 = new ExcelJS.Workbook();
      await wb2.xlsx.readFile(TEST_XLSX_FILEPATH);
      const ws2 = wb2.getWorksheet('Sheet2');
      expect(ws2.getColumn(1).width).to.equal(30);
      expect(ws2.getColumn(2).width).to.equal(15);
    });

    it('escapes XML special characters in pivot table cache fields and records', async () => {
      const workbook = new ExcelJS.Workbook();

      const worksheet1 = workbook.addWorksheet('Sheet1');
      worksheet1.addRows([
        ['Company & Name', 'Category <Type>', 'Notes', 'Sales & Revenue'],
        ['Smith & Co', 'Price < $100', 'Size > 10"', 100],
        ["Ben & Jerry's", '<tag>', 'The "best" option', 200],
      ]);

      const worksheet2 = workbook.addWorksheet('Sheet2');
      worksheet2.addPivotTable({
        sourceSheet: worksheet1,
        rows: ['Company & Name'],
        columns: ['Category <Type>'],
        values: ['Sales & Revenue'],
        metric: 'sum',
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const zip = await JSZip.loadAsync(buffer);

      const cacheDefXml =
        await zip.files['xl/pivotCache/pivotCacheDefinition1.xml'].async('string');
      expect(cacheDefXml).to.include('name="Company &amp; Name"');
      expect(cacheDefXml).to.include('name="Category &lt;Type&gt;"');
      expect(cacheDefXml).to.include('name="Sales &amp; Revenue"');
      expect(cacheDefXml).to.include('<s v="Smith &amp; Co" />');
      expect(cacheDefXml).to.include('<s v="Ben &amp; Jerry&apos;s" />');
      expect(cacheDefXml).to.include('<s v="Price &lt; $100" />');
      expect(cacheDefXml).to.include('<s v="&lt;tag&gt;" />');

      const cacheRecordsXml =
        await zip.files['xl/pivotCache/pivotCacheRecords1.xml'].async('string');
      expect(cacheRecordsXml).to.include('<s v="Size &gt; 10&quot;" />');
      expect(cacheRecordsXml).to.include('<s v="The &quot;best&quot; option" />');

      const pivotXml = await zip.files['xl/pivotTables/pivotTable1.xml'].async('string');
      expect(pivotXml).to.include('name="Sum of Sales &amp; Revenue"');
    });

    it('handles null and undefined values in pivot table source data', async () => {
      const workbook = new ExcelJS.Workbook();

      const worksheet1 = workbook.addWorksheet('Sheet1');
      worksheet1.addRows([
        ['Product', 'Category', 'Region', 'Amount'],
        ['Widget', null, 'North', 100],
        ['Gadget', undefined, 'South', 200],
        [null, 'Electronics', undefined, null],
      ]);

      const worksheet2 = workbook.addWorksheet('Sheet2');
      worksheet2.addPivotTable({
        sourceSheet: worksheet1,
        rows: ['Product', 'Category'],
        columns: ['Region'],
        values: ['Amount'],
        metric: 'sum',
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const zip = await JSZip.loadAsync(buffer);

      const cacheDefXml =
        await zip.files['xl/pivotCache/pivotCacheDefinition1.xml'].async('string');
      expect(cacheDefXml).to.not.include('<s v="null" />');
      expect(cacheDefXml).to.not.include('<s v="undefined" />');
      expect(cacheDefXml).to.include('<s v="Widget" />');
      expect(cacheDefXml).to.include('<s v="Gadget" />');
      expect(cacheDefXml).to.include('<s v="Electronics" />');

      const cacheRecordsXml =
        await zip.files['xl/pivotCache/pivotCacheRecords1.xml'].async('string');
      expect(cacheRecordsXml).to.include('<m />');
    });

    it('supports multiple pivot tables from the same source data', async () => {
      const workbook = new ExcelJS.Workbook();

      const sourceSheet = workbook.addWorksheet('Sales Data');
      sourceSheet.addRows([
        ['Region', 'Quarter', 'Product', 'Amount', 'Units'],
        ['East', 'Q1', 'Widget', 1000, 10],
        ['West', 'Q2', 'Gadget', 2000, 20],
        ['North', 'Q1', 'Widget', 1500, 15],
        ['South', 'Q3', 'Doohickey', 2500, 25],
      ]);

      const pivotSheet1 = workbook.addWorksheet('By Region');
      pivotSheet1.addPivotTable({
        sourceSheet,
        rows: ['Region'],
        columns: ['Quarter'],
        values: ['Amount'],
        metric: 'sum',
      });

      const pivotSheet2 = workbook.addWorksheet('By Product');
      pivotSheet2.addPivotTable({
        sourceSheet,
        rows: ['Product'],
        columns: ['Quarter'],
        values: ['Units'],
        metric: 'sum',
      });

      const pivotSheet3 = workbook.addWorksheet('By Region and Product');
      pivotSheet3.addPivotTable({
        sourceSheet,
        rows: ['Region', 'Product'],
        columns: ['Quarter'],
        values: ['Amount'],
        metric: 'sum',
      });

      // Verify source sheet data was not mutated
      expect(sourceSheet.getColumn(1).values.slice(1)).to.deep.equal([
        'Region',
        'East',
        'West',
        'North',
        'South',
      ]);

      const buffer = await workbook.xlsx.writeBuffer();
      const zip = await JSZip.loadAsync(buffer);

      const contentTypesXml = await zip.files['[Content_Types].xml'].async('string');
      const workbookXml = await zip.files['xl/workbook.xml'].async('string');
      const workbookRelsXml = await zip.files['xl/_rels/workbook.xml.rels'].async('string');

      const xmlContents = await Promise.all(
        [1, 2, 3].map(async n => ({
          n,
          sheetRelsXml:
            await zip.files[`xl/worksheets/_rels/sheet${n + 1}.xml.rels`].async('string'),
          pivotTableXml: await zip.files[`xl/pivotTables/pivotTable${n}.xml`].async('string'),
        })),
      );

      const uids = new Set();
      for (const {n, sheetRelsXml, pivotTableXml} of xmlContents) {
        const expectedFiles = [
          `xl/pivotCache/pivotCacheRecords${n}.xml`,
          `xl/pivotCache/pivotCacheDefinition${n}.xml`,
          `xl/pivotCache/_rels/pivotCacheDefinition${n}.xml.rels`,
          `xl/pivotTables/pivotTable${n}.xml`,
          `xl/pivotTables/_rels/pivotTable${n}.xml.rels`,
        ];
        for (const filepath of expectedFiles) {
          expect(zip.files[filepath], `missing ${filepath}`).to.not.be.undefined();
        }

        expect(contentTypesXml).to.include(
          `PartName="/xl/pivotCache/pivotCacheDefinition${n}.xml"`,
        );
        expect(contentTypesXml).to.include(`PartName="/xl/pivotCache/pivotCacheRecords${n}.xml"`);
        expect(contentTypesXml).to.include(`PartName="/xl/pivotTables/pivotTable${n}.xml"`);

        const cacheId = String(9 + n);
        expect(workbookXml).to.include(`cacheId="${cacheId}"`);
        expect(workbookRelsXml).to.include(`Target="pivotCache/pivotCacheDefinition${n}.xml"`);

        expect(sheetRelsXml).to.include(`Target="../pivotTables/pivotTable${n}.xml"`);

        expect(pivotTableXml).to.include(`name="PivotTable${n}"`);
        expect(pivotTableXml).to.include(`cacheId="${cacheId}"`);

        const uidMatch = pivotTableXml.match(/xr:uid="(\{[0-9A-F-]+\})"/);
        expect(uidMatch).to.not.be.null();
        uids.add(uidMatch[1]);
      }

      expect(uids.size).to.equal(3);
    });

    it('supports multiple pivot tables on the same destination worksheet', async () => {
      const workbook = new ExcelJS.Workbook();

      const sourceSheet = workbook.addWorksheet('Sheet1');
      sourceSheet.addRows(TEST_DATA);

      const pivotSheet = workbook.addWorksheet('Sheet2');
      pivotSheet.addPivotTable({
        sourceSheet,
        rows: ['A'],
        columns: ['C'],
        values: ['E'],
        metric: 'sum',
      });
      pivotSheet.addPivotTable({
        sourceSheet,
        rows: ['B'],
        columns: ['C'],
        values: ['D'],
        metric: 'sum',
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const zip = await JSZip.loadAsync(buffer);

      const sheetRelsXml = await zip.files['xl/worksheets/_rels/sheet2.xml.rels'].async('string');
      expect(sheetRelsXml).to.include('Target="../pivotTables/pivotTable1.xml"');
      expect(sheetRelsXml).to.include('Target="../pivotTables/pivotTable2.xml"');
    });

    it('supports the "count" metric in pivotTable1.xml', async () => {
      const workbook = new ExcelJS.Workbook();

      const worksheet1 = workbook.addWorksheet('Sheet1');
      worksheet1.addRows(TEST_DATA);

      const worksheet2 = workbook.addWorksheet('Sheet2');
      worksheet2.addPivotTable({
        sourceSheet: worksheet1,
        rows: ['A', 'B'],
        columns: ['C'],
        values: ['E'],
        metric: 'count',
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const zip = await JSZip.loadAsync(buffer);
      const pivotXml = await zip.files['xl/pivotTables/pivotTable1.xml'].async('string');
      expect(pivotXml).to.include('name="Count of E"');
      expect(pivotXml).to.include('subtotal="count"');
    });

    it('defaults to "sum" metric when metric is omitted', async () => {
      const workbook = new ExcelJS.Workbook();

      const worksheet1 = workbook.addWorksheet('Sheet1');
      worksheet1.addRows(TEST_DATA);

      const worksheet2 = workbook.addWorksheet('Sheet2');
      worksheet2.addPivotTable({
        sourceSheet: worksheet1,
        rows: ['A', 'B'],
        columns: ['C'],
        values: ['E'],
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const zip = await JSZip.loadAsync(buffer);
      const pivotXml = await zip.files['xl/pivotTables/pivotTable1.xml'].async('string');
      expect(pivotXml).to.include('name="Sum of E"');
      expect(pivotXml).to.not.include('subtotal="count"');
    });

    it('throws an error for unsupported pivot table metrics', () => {
      const workbook = new ExcelJS.Workbook();

      const worksheet1 = workbook.addWorksheet('Sheet1');
      worksheet1.addRows(TEST_DATA);

      const worksheet2 = workbook.addWorksheet('Sheet2');
      expect(() => {
        worksheet2.addPivotTable({
          sourceSheet: worksheet1,
          rows: ['A', 'B'],
          columns: ['C'],
          values: ['E'],
          metric: 'average',
        });
      }).to.throw('Only the "sum" and "count" metrics are supported at this time.');
    });

    it('supports multiple values when columns are not specified (PR #2578)', async () => {
      const workbook = new ExcelJS.Workbook();

      const worksheet1 = workbook.addWorksheet('Sheet1');
      worksheet1.addRows(TEST_DATA);

      const worksheet2 = workbook.addWorksheet('Sheet2');
      worksheet2.addPivotTable({
        sourceSheet: worksheet1,
        rows: ['A', 'B'],
        values: ['D', 'E'],
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const zip = await JSZip.loadAsync(buffer);
      const pivotXml = await zip.files['xl/pivotTables/pivotTable1.xml'].async('string');

      expect(pivotXml).to.include('<colFields count="1">');
      expect(pivotXml).to.include('<field x="-2" />');
      expect(pivotXml).to.include('<dataFields count="2">');
      expect(pivotXml).to.include('name="Sum of D"');
      expect(pivotXml).to.include('name="Sum of E"');
    });

    it('throws an error when multiple values and columns are specified (PR #2578)', () => {
      const workbook = new ExcelJS.Workbook();

      const worksheet1 = workbook.addWorksheet('Sheet1');
      worksheet1.addRows(TEST_DATA);

      const worksheet2 = workbook.addWorksheet('Sheet2');
      expect(() => {
        worksheet2.addPivotTable({
          sourceSheet: worksheet1,
          rows: ['A', 'B'],
          columns: ['C'],
          values: ['D', 'E'],
        });
      }).to.throw(
        'It is currently not possible to have multiple values when columns are specified.',
      );
    });

    it('throws an error when no values are specified (PR #2578)', () => {
      const workbook = new ExcelJS.Workbook();

      const worksheet1 = workbook.addWorksheet('Sheet1');
      worksheet1.addRows(TEST_DATA);

      const worksheet2 = workbook.addWorksheet('Sheet2');
      expect(() => {
        worksheet2.addPivotTable({
          sourceSheet: worksheet1,
          rows: ['A', 'B'],
          columns: ['C'],
          values: [],
        });
      }).to.throw('Must have at least one value.');
    });
  });
});
