// `#crypto` resolves to native node:crypto on Node.js and a pure-JS
// implementation in browser builds (see "imports" in package.json).
import {createHash, getHashes, randomBytes} from '#crypto';

const Encryptor = {
  /**
   * Calculate a hash of the concatenated buffers with the given algorithm.
   * @param {string} algorithm - The hash algorithm.
   * @returns {Buffer} The hash
   */
  hash(algorithm, ...buffers) {
    const hash = createHash(algorithm);
    for (const buffer of buffers) hash.update(buffer);
    return hash.digest();
  },
  /**
   * Convert a password into an encryption key
   * @param {string} password - The password
   * @param {string} hashAlgorithm - The hash algoritm
   * @param {string} saltValue - The salt value
   * @param {number} spinCount - The spin count
   * @returns {string} The base64 encoded hash
   */
  convertPasswordToHash(password, hashAlgorithm, saltValue, spinCount) {
    hashAlgorithm = hashAlgorithm.toLowerCase();
    if (!getHashes().includes(hashAlgorithm)) {
      throw new Error(`Hash algorithm '${hashAlgorithm}' not supported!`);
    }

    // Password must be in unicode buffer
    const passwordBuffer = Buffer.from(password, 'utf16le');
    // Generate the initial hash
    let key = this.hash(hashAlgorithm, Buffer.from(saltValue, 'base64'), passwordBuffer);
    // Now regenerate until spin count
    const iterator = Buffer.alloc(4);
    for (let i = 0; i < spinCount; i++) {
      // this is the 'special' element of Excel password hashing
      // that stops us from using crypto.pbkdf2()
      iterator.writeUInt32LE(i, 0);
      key = createHash(hashAlgorithm).update(key).update(iterator).digest();
    }
    return key.toString('base64');
  },
  /**
   * Generates cryptographically strong pseudo-random data.
   * @param size The size argument is a number indicating the number of bytes to generate.
   */
  randomBytes(size) {
    return randomBytes(size);
  },
};

export default Encryptor;
