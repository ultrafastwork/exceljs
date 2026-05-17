const ExcelJS = verquire('exceljs');

describe('github issues', () => {
  it('issue 2961 - Invalid row number in model when r attribute missing', () => {
    const wb = new ExcelJS.Workbook();
    return wb.xlsx
      .readFile('./spec/integration/data/test-issue-2961.xlsx')
      .then(() => {
        const ws = wb.getWorksheet('Sheet1');
        
        // Assertions on Row 1 (A1, B1, C1)
        const a1 = ws.getCell('A1');
        const b1 = ws.getCell('B1');
        const c1 = ws.getCell('C1');
        
        expect(a1.value).to.equal('Hello');
        expect(b1.value).to.equal(100);
        expect(c1.value).to.equal(true);
        
        // Assertions on Row 2 (A2, B2, C2)
        const a2 = ws.getCell('A2');
        const b2 = ws.getCell('B2');
        const c2 = ws.getCell('C2');
        
        expect(a2.value).to.equal('World');
        expect(b2.value).to.equal(200.5);
        expect(c2.value).to.equal(false);
      });
  });

  it('issue 2961 - WorkbookReader - Invalid row number in model when r attribute missing', () => {
    const wbReader = new ExcelJS.stream.xlsx.WorkbookReader('./spec/integration/data/test-issue-2961.xlsx');
    const rows = [];
    return new Promise((resolve, reject) => {
      wbReader.read();
      wbReader.on('worksheet', worksheet => {
        worksheet.on('row', row => {
          rows.push({
            number: row.number,
            values: row.values,
          });
        });
      });
      wbReader.on('end', () => {
        try {
          expect(rows.length).to.equal(2);
          expect(rows[0].number).to.equal(1);
          // Row values array is 1-indexed, element at index 0 is undefined
          expect(rows[0].values[1]).to.equal('Hello');
          expect(rows[0].values[2]).to.equal(100);
          expect(rows[0].values[3]).to.equal(true);

          expect(rows[1].number).to.equal(2);
          expect(rows[1].values[1]).to.equal('World');
          expect(rows[1].values[2]).to.equal(200.5);
          expect(rows[1].values[3]).to.equal(false);
          resolve();
        } catch (err) {
          reject(err);
        }
      });
      wbReader.on('error', reject);
    });
  });
});
