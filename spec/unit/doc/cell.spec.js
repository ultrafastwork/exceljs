const colCache = verquire('utils/col-cache');
const Cell = verquire('doc/cell');
const Enums = verquire('doc/enums');

const sheetMock = {
  reset() {
    this.rows = [];
    this.columns = [];
  },
  findRow(num) {
    return this.rows[num];
  },
  getRow(num) {
    return this.rows[num] || this.createRow(num);
  },
  findColumn(num) {
    return this.columns[num];
  },
  getColumn(num) {
    return this.columns[num] || this.createColumn(num);
  },
  createRow(num) {
    this.rows[num] = {
      cells: [],
      findCell(col) {
        return this.cells[col];
      },
      getCell(col) {
        return this.cells[col] || this.createCell(col);
      },
      createCell(col) {
        const address = colCache.encodeAddress(this.number, col);
        const column = sheetMock.getColumn(col);
        return (this.cells[col] = new Cell(this, column, address));
      },
      number: num,
      get worksheet() {
        return sheetMock;
      },
    };
    return this.rows[num];
  },
  createColumn(num) {
    this.columns[num] = {
      number: num,
      letter: colCache.n2l(num),
    };
    return this.columns[num];
  },
  getCell(address) {
    const fullAddress = colCache.decodeAddress(address);
    const row = this.getRow(fullAddress.row);
    return row.getCell(fullAddress.col);
  },
  findCell(address) {
    const fullAddress = colCache.decodeAddress(address);
    const row = this.getRow(fullAddress.row);
    return row && row.findCell(fullAddress.col);
  },
};
const fonts = {
  arialBlackUI14: {
    name: 'Arial Black',
    family: 2,
    size: 14,
    underline: true,
    italic: true,
  },
  comicSansUdB16: {
    name: 'Comic Sans MS',
    family: 4,
    size: 16,
    underline: 'double',
    bold: true,
  },
  broadwayRedOutline20: {
    name: 'Broadway',
    family: 5,
    size: 20,
    outline: true,
    color: {argb: 'FFFF0000'},
  },
};

describe('Cell', () => {
  beforeEach(() => {
    sheetMock.reset();
  });
  it('stores values', () => {
    sheetMock.getRow(1);
    sheetMock.getColumn(1);

    const a1 = sheetMock.getCell('A1');

    expect(a1.address).to.equal('A1');
    expect(a1.$col$row).to.equal('$A$1');

    expect(a1.type).to.equal(Enums.ValueType.Null);

    expect((a1.value = 5)).to.equal(5);
    expect(a1.value).to.equal(5);
    expect(a1.type).to.equal(Enums.ValueType.Number);

    const strValue = 'Hello, World!';
    expect((a1.value = strValue)).to.equal(strValue);
    expect(a1.value).to.equal(strValue);
    expect(a1.type).to.equal(Enums.ValueType.String);

    const dateValue = new Date();
    expect((a1.value = dateValue)).to.equal(dateValue);
    expect(a1.value).to.equal(dateValue);
    expect(a1.type).to.equal(Enums.ValueType.Date);

    let formulaValue = {formula: 'A2', result: 5};
    expect((a1.value = formulaValue)).to.deep.equal(formulaValue);
    expect(a1.value).to.deep.equal(formulaValue);
    expect(a1.type).to.equal(Enums.ValueType.Formula);

    // no result
    formulaValue = {formula: 'A3'};
    expect((a1.value = formulaValue)).to.deep.equal(formulaValue);
    expect(a1.value).to.deep.equal({formula: 'A3'});
    expect(a1.type).to.equal(Enums.ValueType.Formula);

    const hyperlinkValue = {
      hyperlink: 'http://www.link.com',
      text: 'www.link.com',
    };
    expect((a1.value = hyperlinkValue)).to.deep.equal(hyperlinkValue);
    expect(a1.value).to.deep.equal(hyperlinkValue);
    expect(a1.type).to.equal(Enums.ValueType.Hyperlink);

    expect((a1.value = null)).to.be.null();
    expect(a1.type).to.equal(Enums.ValueType.Null);

    expect((a1.value = {json: 'data'})).to.deep.equal({json: 'data'});
    expect(a1.type).to.equal(Enums.ValueType.String);
  });
  it('validates options on construction', () => {
    const row = sheetMock.getRow(1);
    const column = sheetMock.getColumn(1);

    expect(() => {
      new Cell();
    }).to.throw(Error);
    expect(() => {
      new Cell(row);
    }).to.throw(Error);
    expect(() => {
      new Cell(row, 'A');
    }).to.throw(Error);
    expect(() => {
      new Cell(row, 'Hello, World!');
    }).to.throw(Error);
    expect(() => {
      new Cell(null, null, 'A1');
    }).to.throw(Error);
    expect(() => {
      new Cell(row, null, 'A1');
    }).to.throw(Error);
    expect(() => {
      new Cell(null, column, 'A1');
    }).to.throw(Error);
  });
  it('merges', () => {
    const a1 = sheetMock.getCell('A1');
    const a2 = sheetMock.getCell('A2');

    a1.value = 5;
    a2.value = 'Hello, World!';

    a2.merge(a1);

    expect(a2.value).to.equal(5);
    expect(a2.type).to.equal(Enums.ValueType.Merge);
    expect(a1._mergeCount).to.equal(1);
    expect(a1.isMerged).to.be.ok();
    expect(a2.isMerged).to.be.ok();
    expect(a2.isMergedTo(a1)).to.be.ok();
    expect(a2.master).to.equal(a1);
    expect(a1.master).to.equal(a1);

    // assignment of slaves write to the master
    a2.value = 7;
    expect(a1.value).to.equal(7);

    // assignment of strings should add 1 ref
    const strValue = 'Boo!';
    a2.value = strValue;
    expect(a1.value).to.equal(strValue);

    // unmerge should work also
    a2.unmerge();
    expect(a2.type).to.equal(Enums.ValueType.Null);
    expect(a1._mergeCount).to.equal(0);
    expect(a1.isMerged).to.not.be.ok();
    expect(a2.isMerged).to.not.be.ok();
    expect(a2.isMergedTo(a1)).to.not.be.ok();
    expect(a2.master).to.equal(a2);
    expect(a1.master).to.equal(a1);
  });

  it('upgrades from string to hyperlink', () => {
    sheetMock.getRow(1);
    sheetMock.getColumn(1);

    const a1 = sheetMock.getCell('A1');

    const strValue = 'www.link.com';
    const linkValue = 'http://www.link.com';

    a1.value = strValue;

    a1._upgradeToHyperlink(linkValue);

    expect(a1.type).to.equal(Enums.ValueType.Hyperlink);
  });

  it('doesn\'t upgrade from non-string to hyperlink', () => {
    sheetMock.getRow(1);
    sheetMock.getColumn(1);

    const a1 = sheetMock.getCell('A1');

    const linkValue = 'http://www.link.com';

    // null
    a1._upgradeToHyperlink(linkValue);
    expect(a1.type).to.equal(Enums.ValueType.Null);

    // number
    a1.value = 5;
    a1._upgradeToHyperlink(linkValue);
    expect(a1.type).to.equal(Enums.ValueType.Number);

    // date
    a1.value = new Date();
    a1._upgradeToHyperlink(linkValue);
    expect(a1.type).to.equal(Enums.ValueType.Date);

    // formula
    a1.value = {formula: 'A2'};
    a1._upgradeToHyperlink(linkValue);
    expect(a1.type).to.equal(Enums.ValueType.Formula);

    // hyperlink
    a1.value = {hyperlink: 'http://www.link2.com', text: 'www.link2.com'};
    a1._upgradeToHyperlink(linkValue);
    expect(a1.type).to.deep.equal(Enums.ValueType.Hyperlink);

    // cleanup
    a1.value = null;
  });

  it('inherits column styles', () => {
    sheetMock.getRow(1);
    const column = sheetMock.getColumn(1);

    column.style = {
      font: fonts.arialBlackUI14,
    };

    const a1 = sheetMock.getCell('A1');
    expect(a1.font).to.deep.equal(fonts.arialBlackUI14);
  });

  it('inherits row styles', () => {
    const row = sheetMock.getRow(1);
    sheetMock.getColumn(1);

    row.style = {
      font: fonts.broadwayRedOutline20,
    };

    const a1 = sheetMock.getCell('A1');
    expect(a1.font).to.deep.equal(fonts.broadwayRedOutline20);
  });

  it('has effective types', () => {
    sheetMock.getRow(1);
    sheetMock.getColumn(1);

    const a1 = sheetMock.getCell('A1');

    expect(a1.type).to.equal(Enums.ValueType.Null);
    expect(a1.effectiveType).to.equal(Enums.ValueType.Null);

    a1.value = 5;
    expect(a1.type).to.equal(Enums.ValueType.Number);
    expect(a1.effectiveType).to.equal(Enums.ValueType.Number);

    a1.value = 'Hello, World!';
    expect(a1.type).to.equal(Enums.ValueType.String);
    expect(a1.effectiveType).to.equal(Enums.ValueType.String);

    a1.value = new Date();
    expect(a1.type).to.equal(Enums.ValueType.Date);
    expect(a1.effectiveType).to.equal(Enums.ValueType.Date);

    a1.value = {formula: 'A2', result: 5};
    expect(a1.type).to.deep.equal(Enums.ValueType.Formula);
    expect(a1.effectiveType).to.equal(Enums.ValueType.Number);

    a1.value = {formula: 'A2', result: 'Hello, World!'};
    expect(a1.type).to.deep.equal(Enums.ValueType.Formula);
    expect(a1.effectiveType).to.equal(Enums.ValueType.String);

    a1.value = {hyperlink: 'http://www.link.com', text: 'www.link.com'};
    expect(a1.type).to.deep.equal(Enums.ValueType.Hyperlink);
    expect(a1.effectiveType).to.equal(Enums.ValueType.Hyperlink);
  });

  it('shares formulas', () => {
    const a1 = sheetMock.getCell('A1');
    const b1 = sheetMock.getCell('B1');
    const c1 = sheetMock.getCell('C1');

    a1.value = 1;
    b1.value = {formula: 'A1+1', result: 2};
    c1.value = {sharedFormula: 'B1', result: 3};

    expect(b1.type).to.equal(Enums.ValueType.Formula);
    expect(b1.formulaType).to.equal(Enums.FormulaType.Master);
    expect(c1.type).to.equal(Enums.ValueType.Formula);
    expect(c1.formulaType).to.equal(Enums.FormulaType.Shared);
    expect(c1.formula).to.equal('B1+1');
  });

  it('escapes dangerous html', () => {
    const a1 = sheetMock.getCell('A1');

    a1.value = '<script>alert("yoohoo")</script>';

    expect(a1.html).to.equal(
      '&lt;script&gt;alert(&quot;yoohoo&quot;)&lt;/script&gt;'
    );
  });
  it('can set comment', () => {
    const a1 = sheetMock.getCell('A1');

    const comment = {
      texts: [
        {
          font: {
            size: 12,
            color: {theme: 0},
            name: 'Calibri',
            family: 2,
            scheme: 'minor',
          },
          text: 'This is ',
        },
      ],
      margins: {
        insetmode: 'auto',
        inset: [0.13, 0.13, 0.25, 0.25],
      },
      protection: {
        locked: 'True',
        lockText: 'True',
      },
      editAs: 'twoCells',
    };

    a1.note = comment;
    a1.value = 'test set value';

    expect(a1.model.comment.type).to.equal('note');
    expect(a1.model.comment.note).to.deep.equal(comment);
  });

  it('can remove comment', () => {
    const a1 = sheetMock.getCell('A1');

    const comment = {
      texts: [
        {
          font: {
            size: 12,
            color: {theme: 0},
            name: 'Calibri',
            family: 2,
            scheme: 'minor',
          },
          text: 'This is ',
        },
      ],
      margins: {
        insetmode: 'auto',
        inset: [0.13, 0.13, 0.25, 0.25],
      },
      protection: {
        locked: 'True',
        lockText: 'True',
      },
      editAs: 'twoCells',
    };

    a1.note = comment;
    a1.value = 'test set value';

    expect(a1.model.comment.type).to.equal('note');
    expect(a1.model.comment.note).to.deep.equal(comment);

    a1.removeNote();

    expect(a1.note).to.be.undefined();
    expect(a1.model.comment).to.be.undefined();
  });

  it('Cell comments supports setting margins, protection, and position properties', () => {
    const a1 = sheetMock.getCell('A1');

    const comment = {
      texts: [
        {
          font: {
            size: 12,
            color: {theme: 0},
            name: 'Calibri',
            family: 2,
            scheme: 'minor',
          },
          text: 'This is ',
        },
      ],
      protection: {
        locked: 'False',
        lockText: 'True',
      },
    };

    a1.note = comment;
    a1.value = 'test set value';

    expect(a1.model.comment.type).to.equal('note');
    expect(a1.model.comment.note.texts).to.deep.equal(comment.texts);
    expect(a1.model.comment.note.protection).to.deep.equal(comment.protection);
    expect(a1.model.comment.note.margins.insetmode).to.equal('auto');
    expect(a1.model.comment.note.margins.inset).to.deep.equal([
      0.13,
      0.13,
      0.25,
      0.25,
    ]);
    expect(a1.model.comment.note.editAs).to.equal('absolute');
  });

  it('supports quotePrefix on cell and inherits row/column style', () => {
    const a1 = sheetMock.getCell('A1');
    a1.value = '=SUM(B1:B2)';
    a1.quotePrefix = true;
    expect(a1.quotePrefix).to.equal(true);
    expect(a1.style.quotePrefix).to.equal(true);

    const row2 = sheetMock.getRow(2);
    row2.style = {quotePrefix: true};
    expect(sheetMock.getCell('A2').quotePrefix).to.equal(true);

    const col3 = sheetMock.getColumn(3);
    col3.style = {quotePrefix: true};
    expect(sheetMock.getCell('C3').quotePrefix).to.equal(true);
  });

  it('clones style object when setting style attributes on shared styles', () => {
    const cases = [
      {attr: 'numFmt', initial: '0.00', updated: '#,##0'},
      {
        attr: 'font',
        initial: fonts.arialBlackUI14,
        updated: fonts.comicSansUdB16,
      },
      {
        attr: 'alignment',
        initial: {horizontal: 'left'},
        updated: {horizontal: 'center'},
      },
      {
        attr: 'border',
        initial: {top: {style: 'thin'}},
        updated: {bottom: {style: 'thick'}},
      },
      {
        attr: 'fill',
        initial: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {argb: 'FFFF0000'},
        },
        updated: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {argb: 'FF00FF00'},
        },
      },
      {
        attr: 'protection',
        initial: {locked: true},
        updated: {locked: false},
      },
      {attr: 'quotePrefix', initial: false, updated: true},
    ];

    cases.forEach(({attr, initial, updated}) => {
      const sharedStyle = {[attr]: initial};
      const a1 = sheetMock.getCell('A1');
      const b1 = sheetMock.getCell('B1');
      a1.style = sharedStyle;
      b1.style = sharedStyle;

      a1[attr] = updated;

      expect(a1.style).to.not.equal(b1.style);
      expect(a1[attr]).to.deep.equal(updated);
      expect(b1[attr]).to.deep.equal(initial);
    });
  });

  it('merges style via setStyle without mutating shared style object (PR #1378)', () => {
    const sharedStyle = {
      font: fonts.arialBlackUI14,
      numFmt: '0.00',
    };
    const a1 = sheetMock.getCell('A1');
    const b1 = sheetMock.getCell('B1');
    a1.style = sharedStyle;
    b1.style = sharedStyle;

    a1.setStyle({
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {argb: 'FF789ABC'},
      },
    });

    expect(a1.style).to.not.equal(b1.style);
    expect(a1.numFmt).to.equal('0.00');
    expect(a1.fill).to.deep.equal({
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FF789ABC'},
    });
    expect(b1.fill).to.be.undefined();
  });
});
