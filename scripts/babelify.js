'use strict';

// Minimal browserify transform for Babel 8.
// Replaces the unmaintained `babelify` package (last release 2018), which relies on
// synchronous Babel APIs that were removed in Babel 8.

const path = require('path');
const {Transform} = require('stream');
const babel = require('@babel/core');

const BROWSERIFY_ONLY_OPTIONS = ['_', '_flags', 'basedir', 'global'];

function configure(presetOptions = {}) {
  return function babelify(filename, transformOptions = {}) {
    const options = {...presetOptions};
    Object.keys(transformOptions).forEach(key => {
      if (!BROWSERIFY_ONLY_OPTIONS.includes(key) && transformOptions[key] !== undefined) {
        options[key] = transformOptions[key];
      }
    });

    const extensions = options.extensions || babel.DEFAULT_EXTENSIONS;
    delete options.extensions;
    if (!extensions.includes(path.extname(filename))) {
      return new Transform({
        transform(chunk, encoding, callback) {
          callback(null, chunk);
        },
      });
    }

    const basedir = path.resolve(
      (transformOptions._flags && transformOptions._flags.basedir) || '.',
    );
    const chunks = [];

    return new Transform({
      transform(chunk, encoding, callback) {
        chunks.push(chunk);
        callback();
      },
      flush(callback) {
        // Concatenate before decoding to avoid splitting multi-byte characters.
        const source = Buffer.concat(chunks).toString();
        babel
          .transformAsync(source, {
            ...options,
            cwd: options.cwd || basedir,
            filename: path.resolve(basedir, filename),
            caller: {name: 'babelify', ...options.caller},
            // browserify can only consume inline source maps
            sourceMaps: options.sourceMaps === false ? false : 'inline',
          })
          .then(result => callback(null, result ? result.code : source), callback);
      },
    });
  };
}

module.exports = configure();
module.exports.configure = configure;
