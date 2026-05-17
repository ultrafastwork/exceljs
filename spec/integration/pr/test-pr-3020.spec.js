const ExcelJS = verquire('exceljs');
const JSZip = require('jszip');

describe('pr 3020 - Support HAN CELL Excel files', () => {
  it('should load a programmatically mocked HAN CELL file with x: namespace prefixes and unknown tags', async () => {
    const zip = new JSZip();

    // 1. [Content_Types].xml
    zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>
</Types>`);

    // 2. _rels/.rels
    zip.file('_rels/.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`);

    // 3. xl/_rels/workbook.xml.rels
    zip.file('xl/_rels/workbook.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>
</Relationships>`);

    // 4. xl/workbook.xml (with x: namespace prefix)
    zip.file('xl/workbook.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<x:workbook xmlns:x="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <x:sheets>
    <x:sheet name="HanCellSheet" sheetId="1" r:id="rId1"/>
  </x:sheets>
</x:workbook>`);

    // 5. xl/sharedStrings.xml (with x: namespace prefix and unknown/custom tags)
    zip.file('xl/sharedStrings.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<x:sst xmlns:x="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="2" uniqueCount="2">
  <x:customSstElement>
    <x:nestedCustomElement>some metadata</x:nestedCustomElement>
  </x:customSstElement>
  <x:si>
    <x:t>Hello</x:t>
  </x:si>
  <x:si>
    <x:t>World</x:t>
  </x:si>
</x:sst>`);

    // 6. xl/worksheets/sheet1.xml (with x: namespace prefix)
    zip.file('xl/worksheets/sheet1.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<x:worksheet xmlns:x="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <x:customWorksheetElement>
    <x:nested>value</x:nested>
  </x:customWorksheetElement>
  <x:sheetData>
    <x:row r="1">
      <x:c r="A1" t="s">
        <x:v>0</x:v>
      </x:c>
      <x:c r="B1" t="s">
        <x:v>1</x:v>
      </x:c>
    </x:row>
  </x:sheetData>
</x:worksheet>`);

    // 7. docProps/app.xml (missing properties or unexpected elements)
    zip.file('docProps/app.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties">
  <Application>HAN CELL</Application>
  <CustomAppProperty>custom value</CustomAppProperty>
</Properties>`);

    // 8. docProps/core.xml (with unknown tags inside coreProperties)
    zip.file('docProps/core.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:creator>Bagus</dc:creator>
  <cp:customCoreTag>
    <cp:nestedCore>nested value</cp:nestedCore>
  </cp:customCoreTag>
  <dcterms:created xsi:type="dcterms:W3CDTF">2026-05-17T23:50:48Z</dcterms:created>
</cp:coreProperties>`);

    const buffer = await zip.generateAsync({type: 'nodebuffer'});
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(buffer);

    // Verify worksheet loading and details
    const worksheet = wb.getWorksheet('HanCellSheet');
    expect(worksheet).to.not.be.undefined();
    expect(worksheet.name).to.equal('HanCellSheet');

    // Verify cell values loaded successfully via shared strings
    expect(worksheet.getCell('A1').value).to.equal('Hello');
    expect(worksheet.getCell('B1').value).to.equal('World');

    // Verify properties loaded successfully from core.xml
    expect(wb.creator).to.equal('Bagus');
  });
});
