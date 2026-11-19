import events from 'node:events';
import JSZip from 'jszip';
import StreamBuf from './stream-buf.js';

const textEncoder = new TextEncoder();

// =============================================================================
// The ZipWriter class
// Packs streamed data into an output zip stream
class ZipWriter extends events.EventEmitter {
  constructor(options) {
    super();
    this.options = {type: 'nodebuffer', compression: 'DEFLATE', ...options};

    this.zip = new JSZip();
    this.stream = new StreamBuf();
  }

  append(data, options) {
    if (options.base64) {
      this.zip.file(options.name, data, {base64: true});
    } else {
      // native UTF-8 encoding is much faster than JSZip's own encoder in browsers
      this.zip.file(options.name, typeof data === 'string' ? textEncoder.encode(data) : data);
    }
  }

  async finalize() {
    const content = await this.zip.generateAsync(this.options);
    this.stream.end(content);
    this.emit('finish');
  }

  // ==========================================================================
  // Stream.Readable interface
  read(size) {
    return this.stream.read(size);
  }

  setEncoding(encoding) {
    return this.stream.setEncoding(encoding);
  }

  pause() {
    return this.stream.pause();
  }

  resume() {
    return this.stream.resume();
  }

  isPaused() {
    return this.stream.isPaused();
  }

  pipe(destination, options) {
    return this.stream.pipe(destination, options);
  }

  unpipe(destination) {
    return this.stream.unpipe(destination);
  }

  unshift(chunk) {
    return this.stream.unshift(chunk);
  }

  wrap(stream) {
    return this.stream.wrap(stream);
  }
}

// =============================================================================

export {ZipWriter};
