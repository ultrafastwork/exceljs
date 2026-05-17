const {PassThrough} = require('readable-stream');

const parseSax = verquire('utils/parse-sax');

describe('parse-sax-utf8-characters', () => {
  it('should parse split UTF-8 character across chunk boundaries without corrupting', async () => {
    const stream = new PassThrough();
    const parser = parseSax(stream);

    const xml = '<test>中</test>';
    const buf = Buffer.from(xml, 'utf8');

    // Split buf into two chunks:
    // Chunk 1 has <test> plus the first 2 bytes of '中' (6 + 2 = 8 bytes)
    // Chunk 2 has the 3rd byte of '中' plus </test>
    const chunk1 = buf.slice(0, 8);
    const chunk2 = buf.slice(8);

    stream.write(chunk1);
    stream.write(chunk2);
    stream.end();

    const events = [];
    for await (const chunkEvents of parser) {
      events.push(...chunkEvents);
    }

    // Find the text event:
    const textEvent = events.find(e => e.eventType === 'text');
    expect(textEvent).to.not.be.undefined();
    expect(textEvent.value).to.equal('中');
  });
});
