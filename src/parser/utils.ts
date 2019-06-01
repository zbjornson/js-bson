/**
 * Normalizes our expected stringified form of a function across versions of node
 * @param {Function} fn The function to stringify
 */
export function normalizedFunctionString(fn: Function): string {
  return fn.toString().replace('function(', 'function (');
}

function insecureRandomBytes(size: number): Uint8Array {
  const result = new Uint8Array(size);
  for (let i = 0; i < size; ++i) result[i] = Math.floor(Math.random() * 256);
  return result;
}

declare const window: any;

let randomBytes = insecureRandomBytes;
/* global window */
if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
  randomBytes = size => window.crypto.getRandomValues(new Uint8Array(size));
} else {
  try {
    randomBytes = require('crypto').randomBytes;
  } catch (e) {
    // keep the fallback
  }

  // NOTE: in transpiled cases the above require might return null/undefined
  if (randomBytes == null) {
    randomBytes = insecureRandomBytes;
  }
}

export { randomBytes };
