import path from 'node:path';
import HrStopwatch from './utils/hr-stopwatch.js';
import exceljsNodejs from '../lib/exceljs.nodejs.js';

const {Workbook} = exceljsNodejs;

const filename = process.argv[2];

const wb = new Workbook();
const ws = wb.addWorksheet('blort');

const imageId = wb.addImage({
  filename: path.join(import.meta.dirname, 'data/image2.png'),
  extension: 'png',
});
ws.addImage(
  imageId,
  {
    tl: {col: 0.1125, row: 0.4},
    br: {col: 2.101046875, row: 3.4},
    editAs: 'oneCell',
  },
  {
    title: 'Image title',
    decorative: 1,
    description: 'this is image alternative text',
  }
);

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
    console.error(error.stack);
  });
