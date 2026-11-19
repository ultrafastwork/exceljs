import path from 'node:path';
import Excel from '../lib/exceljs.nodejs.js';
import HrStopwatch from './utils/hr-stopwatch.js';

const [, , filename] = process.argv;

const wb = new Excel.stream.xlsx.WorkbookWriter({filename});

const imageId = wb.addImage({
  filename: path.join(import.meta.dirname, 'data/image2.png'),
  extension: 'png',
});

const ws = wb.addWorksheet('Foo');
ws.addBackgroundImage(imageId);

const stopwatch = new HrStopwatch();
stopwatch.start();

wb.commit()
  .then(() => {
    const micros = stopwatch.microseconds;
    console.log('Done.');
    console.log('Time taken:', micros);
  })
  .catch(error => {
    console.log(error.message);
  });
