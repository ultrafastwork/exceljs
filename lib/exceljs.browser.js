// Browser entry point: no file-system or Node.js stream APIs.
// Streaming reads take a Blob instead of a file path or Node.js stream.
import Workbook from './doc/workbook.js';
import WorkbookReader from './stream/xlsx/workbook-reader-blob.js';
import * as Enums from './doc/enums.js';

export * from './doc/enums.js';
export {Workbook};
export const stream = {xlsx: {WorkbookReader}};

const ExcelJS = {Workbook, stream, ...Enums};
export default ExcelJS;
