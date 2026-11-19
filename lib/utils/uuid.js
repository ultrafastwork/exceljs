'use strict';

// RFC 4122 version 4 UUID generator.
// Uses the Web Crypto API (available as globalThis.crypto in Node.js and browsers).
// crypto.randomUUID() is only exposed in secure contexts in browsers, so fall back
// to crypto.getRandomValues() (and finally Math.random()) when it is missing.

function getCrypto() {
  if (typeof globalThis !== 'undefined' && globalThis.crypto) {
    return globalThis.crypto;
  }
  return undefined;
}

function fillRandom(bytes) {
  const crypto = getCrypto();
  if (crypto && typeof crypto.getRandomValues === 'function') {
    crypto.getRandomValues(bytes);
    return;
  }
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Math.floor(Math.random() * 256);
  }
}

function uuidv4() {
  const crypto = getCrypto();
  if (crypto && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  const bytes = new Uint8Array(16);
  fillRandom(bytes);
  // Per RFC 4122 section 4.4: set version (4) and variant (10xx) bits
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = [];
  for (let i = 0; i < bytes.length; i++) {
    hex.push((bytes[i] + 0x100).toString(16).slice(1));
  }
  return [
    hex.slice(0, 4).join(''),
    hex.slice(4, 6).join(''),
    hex.slice(6, 8).join(''),
    hex.slice(8, 10).join(''),
    hex.slice(10, 16).join(''),
  ].join('-');
}

module.exports = {v4: uuidv4};
