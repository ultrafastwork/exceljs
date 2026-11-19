const parseSax = verquire('utils/parse-sax');

const asciiEncode = ascii => Array.from(ascii).map(c => c.codePointAt(0));

const utf8Encoder = {
  encode(text) {
    const bytes = [];
    const frags = encodeURIComponent(text).split('%');
    if (frags[0]) {
      bytes.push(...asciiEncode(frags[0]));
    }
    frags.shift();
    frags.forEach(frag => {
      bytes.push(parseInt(frag.substring(0, 2), 16));
      if (frag.length > 2) {
        bytes.push(...asciiEncode(frag));
      }
    });
    return new Uint8Array(bytes);
  },
};

const parse = async chunks => {
  chunks = [[60, 116, 62]].concat(chunks); // <t>
  chunks = chunks.concat([[60, 47, 116, 62]]); // </t>
  chunks = chunks.map(chunk => Buffer.from(chunk));

  const a = [];
  for await (const events of parseSax(chunks)) {
    events.forEach(({eventType, value}) => {
      if (eventType === 'text') {
        a.push(value);
      }
    });
  }
  return a.join('');
};

const utf8FragTest = async text => {
  /* eslint-disable n/no-unsupported-features/node-builtins */
  const encoder = typeof TextEncoder === 'undefined' ? utf8Encoder : new TextEncoder('utf-8');
  /* eslint-enable n/no-unsupported-features/node-builtins */

  const bytes = encoder.encode(text);

  const promises = [];
  promises.push(parse([bytes]));

  // split text to 2 or 3 chunks
  for (let i = 1; i < bytes.length; i++) {
    for (let j = i; j < bytes.length; j++) {
      const chunks = [bytes.subarray(0, i)];
      if (j !== i) {
        chunks.push(bytes.subarray(i, j));
      }
      chunks.push(bytes.subarray(j, bytes.length));
      promises.push(parse(chunks));
    }
  }

  // split same length
  for (let len = 1; len < bytes.length; len++) {
    const chunks = [];
    for (let p = 0; p < bytes.length; p += len) {
      chunks.push(bytes.subarray(p, p + len < bytes.length ? p + len : bytes.length));
    }
    promises.push(parse(chunks));
  }
  const results = await Promise.all(promises);
  results.forEach(result => expect(result).to.equal(text));
};

describe('parse-sax (PR #1665 and PR #2081)', () => {
  it('converts single byte UTF-8 chars properly across chunk boundaries', async () => {
    await utf8FragTest('abcdefghijklmn');
  });

  it('converts 2 byte UTF-8 chars properly across chunk boundaries', async () => {
    await utf8FragTest('αβγδεζηθικ');
  });

  it('converts 3 byte UTF-8 chars properly across chunk boundaries', async () => {
    await utf8FragTest('あいうえお');
  });

  it('converts 4 byte UTF-8 chars properly across chunk boundaries', async () => {
    await utf8FragTest('😀😁😂😃😄');
  });

  it('handles multi-byte Chinese characters across arbitrary chunk sizes (issue #2063 / PR #2081)', async () => {
    const testString = '凡是能够说的，都能够说清楚；凡是不能说的，必须保持沉默';
    const testBuffer = Buffer.from(`<t>${testString}</t>`, 'utf8');

    /* eslint-disable no-await-in-loop */
    for (const chunkSize of [1, 2, 3, 5, 7, 16, 32]) {
      const chunks = [];
      let start = 0;
      while (start < testBuffer.length) {
        const end = Math.min(start + chunkSize, testBuffer.length);
        chunks.push(testBuffer.subarray(start, end));
        start = end;
      }

      const textParts = [];
      for await (const events of parseSax(chunks)) {
        events.forEach(({eventType, value}) => {
          if (eventType === 'text') {
            textParts.push(value);
          }
        });
      }
      expect(textParts.join('')).to.equal(testString);
    }
    /* eslint-enable no-await-in-loop */
  });
});
