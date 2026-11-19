import {Writable} from 'node:stream';

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
    let {done, value} = await reader.read();
    while (!done) {
      chunks.push(typeof value === 'string' ? Buffer.from(value) : value);
      ({done, value} = await reader.read());
    }
    return Buffer.concat(chunks);
  } finally {
    reader.releaseLock();
  }
}

function pipeWebReadableStream(webStream, nodeWritable, onError) {
  const reader = webStream.getReader();
  (async () => {
    try {
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
    } catch (err) {
      onError(err);
    } finally {
      reader.releaseLock();
    }
  })();
}

function wrapWebWritableStream(webWritableStream) {
  const writer = webWritableStream.getWriter();
  // readable-stream v4 enables autoDestroy, so destroy() also runs after a
  // failed write or a successful final(). Release the lock only once and
  // never let a cleanup error mask the original error.
  let released = false;
  const release = () => {
    if (!released) {
      released = true;
      writer.releaseLock();
    }
  };
  return new Writable({
    write(chunk, encoding, callback) {
      writer.write(chunk).then(
        () => callback(),
        err => {
          release();
          callback(err);
        },
      );
    },
    final(callback) {
      writer.close().then(
        () => {
          release();
          callback();
        },
        err => {
          release();
          callback(err);
        },
      );
    },
    destroy(err, callback) {
      if (released) {
        callback(err);
        return;
      }
      const done = closeErr => {
        release();
        callback(err || closeErr);
      };
      if (err) {
        writer.abort(err).then(() => done(), done);
      } else {
        writer.close().then(() => done(), done);
      }
    },
  });
}

export {
  isReadableStream,
  isWritableStream,
  readWebStreamToBuffer,
  pipeWebReadableStream,
  wrapWebWritableStream,
};
