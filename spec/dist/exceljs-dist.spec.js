const fs = require('fs');

const exists = path =>
  new Promise(resolve => {
    fs.access(path, fs.constants.F_OK, err => resolve(!err));
  });

describe('ExcelJS', () => {
  describe('dist folder', () => {
    it('should include LICENSE', async () => {
      expect(await exists('./dist/LICENSE')).to.be.true();
    });
    it('should include exceljs.js', async () => {
      expect(await exists('./dist/exceljs.js')).to.be.true();
    });
    it('should include exceljs.min.js', async () => {
      expect(await exists('./dist/exceljs.min.js')).to.be.true();
    });
    it('should include exceljs.bare.js', async () => {
      expect(await exists('./dist/exceljs.bare.js')).to.be.true();
    });
    it('should include exceljs.bare.min.js', async () => {
      expect(await exists('./dist/exceljs.bare.min.js')).to.be.true();
    });
    it('should include es5/index', async () => {
      expect(await exists('./dist/es5/index.js')).to.be.true();
    });
  });

  describe('CSP compliance (PR #2672)', () => {
    const bundles = [
      './dist/exceljs.js',
      './dist/exceljs.min.js',
      './dist/exceljs.bare.js',
      './dist/exceljs.bare.min.js',
    ];

    bundles.forEach(bundlePath => {
      it(`${bundlePath} should not contain "new Function" (unsafe-eval CSP violation)`, () => {
        const content = fs.readFileSync(bundlePath, 'utf8');
        expect(content.includes('new Function')).to.be.false();
      });
    });
  });
});
