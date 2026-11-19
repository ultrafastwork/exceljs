import ExcelJS from '../../../lib/exceljs.nodejs.js';
import ColumnFlatter from '../../../lib/utils/column-flatter.js';

describe('ColumnFlatter / worksheet.makeColumns (PR #1889)', () => {
  const input = [
    {
      id: 1,
      title: 'Some',
    },
    {id: 2, title: 'Qwe'},
    {id: 3, title: 'Foo'},
    {
      id: 4,
      title: 'Zoo',
      children: [
        {id: 41, title: 'Zoo 1', width: 15},
        {id: 42, title: 'Zoo 2', width: 20},
        {id: 44, title: 'Zoo 3'},
        {id: 45, title: 'Zoo 4'},
      ],
    },
  ];

  it('flattens nested columns, calculates merges, and populates worksheet headers', () => {
    const flatter = new ColumnFlatter(input);
    expect(flatter.getColumns()).to.have.lengthOf(7);
    expect(flatter.getMerges()).to.deep.equal(['A1:A2', 'B1:B2', 'C1:C2', 'D1:G1']);

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('NestedCols');
    const result = ws.makeColumns(input);

    expect(result.rows).to.have.lengthOf(2);
    expect(ws.views[0]).to.deep.equal({state: 'frozen', ySplit: 2});
    expect(ws.getCell('A1').value).to.equal('Some');
    expect(ws.getCell('A2').isMerged).to.equal(true);
    expect(ws.getCell('A2').master.address).to.equal('A1');
    expect(ws.getCell('D1').value).to.equal('Zoo');
    expect(ws.getCell('G1').isMerged).to.equal(true);
    expect(ws.getCell('G1').master.address).to.equal('D1');
    expect(ws.getCell('D2').value).to.equal('Zoo 1');
    expect(ws.getCell('G2').value).to.equal('Zoo 4');
    expect(ws.getColumn(4).width).to.equal(15);
    expect(ws.getColumn(5).width).to.equal(20);
  });
});
