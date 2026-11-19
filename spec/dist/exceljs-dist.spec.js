import fs from 'node:fs';

const bundles = [
  './dist/exceljs.js',
  './dist/exceljs.min.js',
  './dist/exceljs.bare.js',
  './dist/exceljs.bare.min.js',
  './dist/exceljs.browser.mjs',
];

describe('ExcelJS', () => {
  describe('dist folder', () => {
    for (const file of ['./dist/LICENSE', ...bundles]) {
      it(`should include ${file}`, () => {
        expect(fs.existsSync(file)).to.be.true();
      });
    }
  });

  describe('CSP compliance (PR #2672)', () => {
    for (const bundlePath of bundles) {
      it(`${bundlePath} should not contain "new Function" (unsafe-eval CSP violation)`, () => {
        const content = fs.readFileSync(bundlePath, 'utf8');
        expect(content.includes('new Function')).to.be.false();
      });
    }
  });

  describe('browser bundles', () => {
    for (const bundlePath of bundles) {
      it(`${bundlePath} should not reference Node.js built-ins`, () => {
        const content = fs.readFileSync(bundlePath, 'utf8');
        expect(content).to.not.match(/\b(require|import)\(["']node:/);
      });
    }
  });
});
