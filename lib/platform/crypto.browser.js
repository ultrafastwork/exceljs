// Browsers: Web Crypto's digest() is async-only, but sheet protection hashes
// synchronously, so the hash algorithms Excel may use come from @noble/hashes.
import {sha256, sha384, sha512} from '@noble/hashes/sha2.js';
import {md5, ripemd160, sha1} from '@noble/hashes/legacy.js';

const algorithms = {md5, sha1, sha256, sha384, sha512, ripemd160};

export function getHashes() {
  return Object.keys(algorithms);
}

export function createHash(algorithm) {
  const hash = algorithms[algorithm].create();
  return {
    update(data) {
      hash.update(data);
      return this;
    },
    digest() {
      return Buffer.from(hash.digest());
    },
  };
}

export function randomBytes(size) {
  return Buffer.from(globalThis.crypto.getRandomValues(new Uint8Array(size)));
}
