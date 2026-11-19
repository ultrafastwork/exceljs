import Excel from '../lib/exceljs.nodejs.js';
import HrStopwatch from './utils/hr-stopwatch.js';

const [, , filename] = process.argv;

const wb = new Excel.Workbook();
const ws = wb.addWorksheet('Foo');
ws.getCell('B2').value = 'Hello, World!';

ws.headerFooter.oddHeader = '&CHello, Header!';
ws.headerFooter.oddFooter = '&CPage &P of &N';

const stopwatch = new HrStopwatch();
stopwatch.start();
wb.xlsx
  .writeFile(filename)
  .then(() => {
    const micros = stopwatch.microseconds;
    console.log('Done.');
    console.log('Time taken:', micros);
  })
  .catch(error => {
    console.log(error.message);
  });
