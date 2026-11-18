const {EventEmitter} = require('events');
const {PassThrough, Readable} = require('readable-stream');

const iterateStream = verquire('utils/iterate-stream');

describe('iterateStream', () => {
  it('yields all chunks from an async stream', async () => {
    const stream = new PassThrough();
    setTimeout(() => {
      stream.write('chunk1');
      setTimeout(() => {
        stream.write('chunk2');
        stream.end();
      }, 10);
    }, 10);

    const chunks = [];
    for await (const chunk of iterateStream(stream)) {
      chunks.push(chunk.toString());
    }

    expect(chunks).to.deep.equal(['chunk1', 'chunk2']);
  });

  it('handles pre-buffered stream that emits synchronously on data listener attachment', async () => {
    const stream = new Readable({
      read() {
        this.push('hello');
        this.push('world');
        this.push(null);
      },
    });

    const chunks = [];
    for await (const chunk of iterateStream(stream)) {
      chunks.push(chunk.toString());
    }

    expect(chunks).to.deep.equal(['hello', 'world']);
  });

  it('handles synchronous data and end emission inside resume()', async () => {
    const stream = new EventEmitter();
    let resumed = 0;
    stream.resume = () => {
      resumed++;
      if (resumed === 1) {
        stream.emit('data', Buffer.from('sync1'));
      } else if (resumed === 2) {
        stream.emit('data', Buffer.from('sync2'));
        stream.emit('end');
      }
    };

    const chunks = [];
    for await (const chunk of iterateStream(stream)) {
      chunks.push(chunk.toString());
    }

    expect(chunks).to.deep.equal(['sync1', 'sync2']);
  });

  it('returns immediately if stream is already readableEnded', async () => {
    const {PassThrough: NativePassThrough} = require('stream');
    const stream = new NativePassThrough();
    const ended = new Promise(resolve => stream.once('end', resolve));
    stream.end();
    stream.resume();
    await ended;

    const chunks = [];
    for await (const chunk of iterateStream(stream)) {
      chunks.push(chunk);
    }

    expect(chunks).to.deep.equal([]);
  });

  it('propagates stream errors', async () => {
    const stream = new PassThrough();
    setTimeout(() => {
      stream.destroy(new Error('stream failure'));
    }, 10);

    let caught = null;
    try {
      // eslint-disable-next-line no-unused-vars
      for await (const chunk of iterateStream(stream)) {
        // no-op
      }
    } catch (err) {
      caught = err;
    }

    expect(caught).to.be.an('error');
    expect(caught.message).to.equal('stream failure');
  });

  it('handles close event without end event', async () => {
    const stream = new EventEmitter();
    stream.resume = () => {
      setTimeout(() => {
        stream.emit('data', Buffer.from('partial'));
        stream.emit('close');
      }, 10);
    };

    const chunks = [];
    for await (const chunk of iterateStream(stream)) {
      chunks.push(chunk.toString());
    }

    expect(chunks).to.deep.equal(['partial']);
  });

  it('cleans up all listeners on completion or early break', async () => {
    const stream = new EventEmitter();
    stream.resume = () => {
      setTimeout(() => {
        stream.emit('data', Buffer.from('first'));
        stream.emit('data', Buffer.from('second'));
      }, 10);
    };

    const chunks = [];
    for await (const chunk of iterateStream(stream)) {
      chunks.push(chunk.toString());
      break;
    }

    expect(chunks).to.deep.equal(['first']);
    expect(stream.listenerCount('data')).to.equal(0);
    expect(stream.listenerCount('end')).to.equal(0);
    expect(stream.listenerCount('error')).to.equal(0);
    expect(stream.listenerCount('close')).to.equal(0);
  });
});
