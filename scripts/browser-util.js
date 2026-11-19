// Minimal `util` for browser bundles: fast-csv only uses promisify().
export function promisify(fn) {
  return (...args) =>
    new Promise((resolve, reject) => {
      fn(...args, (err, value) => (err ? reject(err) : resolve(value)));
    });
}

export default {promisify};
