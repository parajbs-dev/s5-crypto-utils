/**
 * Compares two Uint8Array objects for equality.
 * @param {Uint8Array} b1 - The first Uint8Array to compare.
 * @param {Uint8Array} b2 - The second Uint8Array to compare.
 * @returns {boolean} True if the Uint8Arrays are equal, false otherwise.
 */
export function equalBytes(b1: Uint8Array, b2: Uint8Array) {
  // We don't care about timing attacks here
  if (b1.length !== b2.length) return false;
  for (let i = 0; i < b1.length; i++) if (b1[i] !== b2[i]) return false;
  return true;
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const u8a = (a: any): a is Uint8Array => a instanceof Uint8Array;

/**
 * Concatenates multiple Uint8Array instances into a single Uint8Array.
 * @param arrays - An array of Uint8Array instances to concatenate.
 * @returns A new Uint8Array containing the concatenated data.
 */
export function concatBytes(...arrays: Uint8Array[]): Uint8Array {
  const r = new Uint8Array(arrays.reduce((sum, a) => sum + a.length, 0));
  let pad = 0; // walk through each item, ensure they have proper type
  arrays.forEach((a) => {
    if (!u8a(a)) throw new Error('Uint8Array expected');
    r.set(a, pad);
    pad += a.length;
  });
  return r;
}

// We use optimized technique to convert hex string to byte array
const asciis = { _0: 48, _9: 57, _A: 65, _F: 70, _a: 97, _f: 102 } as const;

/**
 * Converts an ASCII character to its hexadecimal representation.
 * @param char - The ASCII character code to convert.
 * @returns The hexadecimal representation as a number, or undefined if the input is not a valid hexadecimal character.
 */
function asciiToBase16(char: number): number | undefined {
  if (char >= asciis._0 && char <= asciis._9) return char - asciis._0;
  if (char >= asciis._A && char <= asciis._F) return char - (asciis._A - 10);
  if (char >= asciis._a && char <= asciis._f) return char - (asciis._a - 10);
  return;
}

/**
 * Converts a hex string to bytes.
 * @param hex - The input hex string to convert.
 * @returns - The resulting Uint8Array containing the bytes.
 * @throws {Error} If the input is not a valid hex string or contains non-hex characters.
 */
export function hexToBytes(hex: string): Uint8Array {
  if (typeof hex !== 'string') throw new Error('hex string expected, got ' + typeof hex);
  const hl = hex.length;
  const al = hl / 2;
  if (hl % 2) throw new Error('padded hex string expected, got unpadded hex of length ' + hl);
  const array = new Uint8Array(al);
  for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
    const n1 = asciiToBase16(hex.charCodeAt(hi));
    const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
    if (n1 === undefined || n2 === undefined) {
      const char = hex[hi] + hex[hi + 1];
      throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
    }
    array[ai] = n1 * 16 + n2;
  }
  return array;
}

// Array where index 0xf0 (240) is mapped to string 'f0'
const hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) =>
  i.toString(16).padStart(2, '0')
);

/**
 * Converts an array of bytes to a hexadecimal string.
 * @param {Uint8Array} bytes - The array of bytes to convert.
 * @throws {Error} If the input is not a Uint8Array.
 * @returns {string} The hexadecimal representation of the input bytes.
 */
export function bytesToHex(bytes: Uint8Array): string {
  if (!u8a(bytes)) throw new Error('Uint8Array expected');
  // pre-caching improves the speed 6x
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += hexes[bytes[i]];
  }
  return hex;
}

/**
 * Converts a UTF-8 string to bytes.
 * @param {string} str - The input string to convert to bytes.
 * @returns {Uint8Array} Uint8Array containing the UTF-8 encoded bytes.
 * @throws {Error} If the input is not a string.
 */
export function utf8ToBytes(str: string): Uint8Array {
  if (typeof str !== 'string') throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
  return new Uint8Array(new TextEncoder().encode(str)); // https://bugzil.la/1681809
}
