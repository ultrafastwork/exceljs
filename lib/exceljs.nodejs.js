import Workbook from './doc/workbook.js';
import ModelContainer from './doc/modelcontainer.js';
import WorkbookWriter from './stream/xlsx/workbook-writer.js';
import WorkbookReader from './stream/xlsx/workbook-reader.js';
import * as Enums from './doc/enums.js';

export * from './doc/enums.js';
export {Workbook, ModelContainer};
export const stream = {xlsx: {WorkbookWriter, WorkbookReader}};

const ExcelJS = {Workbook, ModelContainer, stream, ...Enums};
export default ExcelJS;
