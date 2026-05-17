const {SaxesParser} = require('saxes');
const {PassThrough} = require('readable-stream');
const {StringDecoder} = require('string_decoder');

const VML_TAGS = new Set([
  'x:ClientData',
  'x:Anchor',
  'x:Locked',
  'x:LockText',
  'x:SizeWithCells',
  'x:MoveWithCells',
  'x:AutoFill',
  'x:Row',
  'x:Column',
]);

function shouldStripPrefix(name) {
  return name && name.startsWith('x:') && !VML_TAGS.has(name);
}

module.exports = async function* (iterable) {
  // TODO: Remove once node v8 is deprecated
  // Detect and upgrade old streams
  if (iterable.pipe && !iterable[Symbol.asyncIterator]) {
    iterable = iterable.pipe(new PassThrough());
  }
  const saxesParser = new SaxesParser();
  let error;
  saxesParser.on('error', err => {
    error = err;
  });
  let events = [];
  saxesParser.on('opentag', value => {
    let newValue = value;
    if (shouldStripPrefix(value.name)) {
      newValue = Object.assign({}, value, {name: value.name.slice(2)});
    }
    events.push({eventType: 'opentag', value: newValue});
  });
  saxesParser.on('text', value => events.push({eventType: 'text', value}));
  saxesParser.on('closetag', value => {
    let newValue = value;
    if (shouldStripPrefix(value.name)) {
      newValue = Object.assign({}, value, {name: value.name.slice(2)});
    }
    events.push({eventType: 'closetag', value: newValue});
  });

  const decoder = new StringDecoder('utf-8');
  for await (const chunk of iterable) {
    const chunkStr = typeof chunk === 'string' ? chunk : decoder.write(chunk);
    saxesParser.write(chunkStr);
    // saxesParser.write and saxesParser.on() are synchronous,
    // so we can only reach the below line once all events have been emitted
    if (error) throw error;
    // As a performance optimization, we gather all events instead of passing
    // them one by one, which would cause each event to go through the event queue
    yield events;
    events = [];
  }

  const remaining = decoder.end();
  if (remaining) {
    saxesParser.write(remaining);
    if (error) throw error;
    if (events.length > 0) {
      yield events;
    }
  }
};
