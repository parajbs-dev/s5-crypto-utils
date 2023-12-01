/**
 * Decode little-endian bytes to a number.
 * @param bytes An array of bytes in little-endian order.
 * @returns The decoded number.
 */
export function decodeEndian(bytes: Uint8Array): number {
  let total = 0;

  for (let i = 0; i < bytes.length; i++) {
    total += bytes[i] * Math.pow(256, i);
  }

  return total;
}

/**
 * Encode a number to little-endian bytes.
 * @param value The number to encode.
 * @param length The number of bytes to use for encoding.
 * @returns An array of bytes representing the encoded value.
 */
export function encodeEndian(value: number, length: number): Uint8Array {
  const res = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    res[i] = value & 0xff;
    value = value >> 8;
  }

  return res;
}

/**
 * Decode little-endian bytes to a BigInt.
 * @param bytes An array of bytes in little-endian order.
 * @returns The decoded BigInt.
 */
export function decodeEndianN(bytes: number[]): number {
  let total = 0n;

  for (let i = 0; i < bytes.length; i++) {
    total += BigInt(bytes[i]) * (256n ** BigInt(i));
  }

  return Number(total);
}

/**
 * Encodes a number into a little-endian byte array.
 * @param value1 - The number to encode.
 * @param length - The length of the byte array.
 * @returns A Uint8Array containing the little-endian byte representation of the number.
 */
export function encodeEndianN(value1: number, length: number): Uint8Array {
  const res = new Uint8Array(length);

  let lastIndex = length - 1;
  let value = BigInt(value1);
  
  for (let i = 0; i <= lastIndex; i++) {
    // Check if the value is zero
    if (value === 0n) {
      lastIndex = i - 1;
      break;
    }
    
    res[i] = Number(value & 0xffn);
    value = value >> 8n;
  }
  return res;
}
