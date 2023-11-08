/**
 * Decode little-endian bytes to a number.
 * @param bytes An array of bytes in little-endian order.
 * @returns The decoded number.
 */
export declare function decodeEndian(bytes: Uint8Array): number;
/**
 * Encode a number to little-endian bytes.
 * @param value The number to encode.
 * @param length The number of bytes to use for encoding.
 * @returns An array of bytes representing the encoded value.
 */
export declare function encodeEndian(value: number, length: number): Uint8Array;
/**
 * Decode little-endian bytes to a BigInt.
 * @param bytes An array of bytes in little-endian order.
 * @returns The decoded BigInt.
 */
export declare function decodeEndianN(bytes: number[]): number;
/**
 * Encodes a number into a little-endian byte array.
 * @param value1 - The number to encode.
 * @param length - The length of the byte array.
 * @returns A Uint8Array containing the little-endian byte representation of the number.
 */
export declare function encodeEndianN(value1: number, length: number): Uint8Array;
//# sourceMappingURL=endian.d.ts.map