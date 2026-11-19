const fs = require('fs');
const {PassThrough, Readable} = require('readable-stream');
const nodeStream = require('stream');
const unzip = require('unzipper');
const tmp = require('tmp');
const AbstractWorkbookReader = require('./abstract-workbook-reader');
const iterateStream = require('../../utils/iterate-stream');

tmp.setGracefulCleanup();

class WorkbookReader extends AbstractWorkbookReader {
  constructor(input, options = {}) {
    super(input, options);
  }

  _getStream(input) {
    if (
      input instanceof nodeStream.Readable ||
      input instanceof Readable ||
      (input && typeof input.pipe === 'function')
    ) {
      return input;
    }
    if (typeof input === 'string') {
      return fs.createReadStream(input);
    }
    throw new Error(`Could not recognise input: ${input}`);
  }

  async *[Symbol.asyncIterator]() {
    for await (const {eventType, value} of this.parse()) {
      if (eventType === 'worksheet') {
        yield value;
      }
    }
  }

  async *parse(input, options) {
    if (options) this.options = options;
    const stream = (this.stream = this._getStream(input || this.input));
    const zip = stream.pipe(unzip.Parse({forceStream: true}));

    // worksheets, deferred for parsing after shared strings reading
    const waitingWorkSheets = [];

    try {
      for await (const entry of zip) {
        let match;
        let sheetNo;
        switch (entry.path) {
          case '_rels/.rels':
            break;
          case 'xl/_rels/workbook.xml.rels':
            await this._parseRels(entry);
            break;
          case 'xl/workbook.xml':
            await this._parseWorkbook(entry);
            break;
          case 'xl/sharedStrings.xml':
            yield* this._parseSharedStrings(entry);
            break;
          case 'xl/styles.xml':
            await this._parseStyles(entry);
            break;
          default:
            if (entry.path.match(/xl\/worksheets\/sheet\d+[.]xml/)) {
              match = entry.path.match(/xl\/worksheets\/sheet(\d+)[.]xml/);
              sheetNo = match[1];
              if (waitingWorkSheets.length === 0 && this.isDirectReady()) {
                yield* this._parseWorksheet(iterateStream(entry), sheetNo);
              } else {
                // create temp file for each worksheet
                await new Promise((resolve, reject) => {
                  tmp.file((err, path, fd, tempFileCleanupCallback) => {
                    if (err) {
                      return reject(err);
                    }
                    waitingWorkSheets.push({
                      sheetNo,
                      path,
                      tempFileCleanupCallback,
                      cleanedUp: false,
                    });

                    const tempStream = fs.createWriteStream(path);
                    tempStream.on('error', reject);
                    entry.pipe(tempStream);
                    return tempStream.on('finish', () => {
                      return resolve();
                    });
                  });
                });
              }
            } else if (entry.path.match(/xl\/worksheets\/_rels\/sheet\d+[.]xml.rels/)) {
              match = entry.path.match(/xl\/worksheets\/_rels\/sheet(\d+)[.]xml.rels/);
              sheetNo = match[1];
              yield* this._parseHyperlinks(iterateStream(entry), sheetNo);
            }
            break;
        }
        entry.autodrain();
      }

      for (const waitingWorkSheet of waitingWorkSheets) {
        let fileStream = fs.createReadStream(waitingWorkSheet.path);
        // TODO: Remove once node v8 is deprecated
        // Detect and upgrade old fileStreams
        if (!fileStream[Symbol.asyncIterator]) {
          fileStream = fileStream.pipe(new PassThrough());
        }
        try {
          yield* this._parseWorksheet(fileStream, waitingWorkSheet.sheetNo);
        } finally {
          if (fileStream.close) {
            fileStream.close();
          }
        }
        waitingWorkSheet.tempFileCleanupCallback();
        waitingWorkSheet.cleanedUp = true;
      }
    } finally {
      for (const waitingWorkSheet of waitingWorkSheets) {
        if (!waitingWorkSheet.cleanedUp) {
          waitingWorkSheet.tempFileCleanupCallback();
          waitingWorkSheet.cleanedUp = true;
        }
      }
    }
  }
}

// for reference - these are the valid values for options
WorkbookReader.Options = AbstractWorkbookReader.Options;

module.exports = WorkbookReader;
