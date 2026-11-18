const {Writable} = require('readable-stream');

function isReadableStream(stream) {
  return Boolean(stream && typeof stream.getReader === 'function');
}

function isWritableStream(stream) {
  return Boolean(stream && typeof stream.getWriter === 'function');
}

async function readWebStreamToBuffer(stream) {
  const reader = stream.getReader();
  const chunks = [];
  try {
    /* eslint-disable no-await-in-loop */
    let {done, value} = await reader.read();
    while (!done) {
      chunks.push(typeof value === 'string' ? Buffer.from(value) : value);
      ({done, value} = await reader.read());
    }
    /* eslint-enable no-await-in-loop */
    return Buffer.concat(chunks);
  } finally {
    reader.releaseLock();
  }
}

function pipeWebReadableStream(webStream, nodeWritable, onError) {
  const reader = webStream.getReader();
  (async () => {
    try {
      /* eslint-disable no-await-in-loop */
      let {done, value} = await reader.read();
      while (!done) {
        if (!nodeWritable.write(value)) {
          await new Promise(resolve => {
            nodeWritable.once('drain', resolve);
          });
        }
        ({done, value} = await reader.read());
      }
      nodeWritable.end();
      /* eslint-enable no-await-in-loop */
    } catch (err) {
      onError(err);
    } finally {
      reader.releaseLock();
    }
  })();
}

function wrapWebWritableStream(webWritableStream) {
  const writer = webWritableStream.getWriter();
  return new Writable({
    write(chunk, encoding, callback) {
      writer.write(chunk).then(
        () => callback(),
        err => {
          writer.releaseLock();
          callback(err);
        }
      );
    },
    final(callback) {
      writer.close().then(
        () => {
          writer.releaseLock();
          callback();
        },
        err => {
          writer.releaseLock();
          callback(err);
        }
      );
    },
    destroy(err, callback) {
      const done = closeErr => {
        writer.releaseLock();
        callback(closeErr || err);
      };
      if (err) {
        writer.abort(err).then(() => done(), done);
      } else {
        writer.close().then(() => done(), done);
      }
    },
  });
}

module.exports = {
  isReadableStream,
  isWritableStream,
  readWebStreamToBuffer,
  pipeWebReadableStream,
  wrapWebWritableStream,
};
