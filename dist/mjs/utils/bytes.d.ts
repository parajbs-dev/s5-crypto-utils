/**
 * Compares two Uint8Array objects for equality.
 * @param {Uint8Array} b1 - The first Uint8Array to compare.
 * @param {Uint8Array} b2 - The second Uint8Array to compare.
 * @returns {boolean} True if the Uint8Arrays are equal, false otherwise.
 */
export declare function equalBytes(b1: Uint8Array, b2: Uint8Array): boolean;
/**
 * Concatenates multiple Uint8Array instances into a single Uint8Array.
 * @param arrays - An array of Uint8Array instances to concatenate.
 * @returns A new Uint8Array containing the concatenated data.
 */
export declare function concatBytes(...arrays: Uint8Array[]): Uint8Array;
/**
 * Converts a hex string to bytes.
 * @param hex - The input hex string to convert.
 * @returns - The resulting Uint8Array containing the bytes.
 * @throws {Error} If the input is not a valid hex string or contains non-hex characters.
 */
export declare function hexToBytes(hex: string): Uint8Array;
/**
 * Converts an array of bytes to a hexadecimal string.
 * @param {Uint8Array} bytes - The array of bytes to convert.
 * @throws {Error} If the input is not a Uint8Array.
 * @returns {string} The hexadecimal representation of the input bytes.
 */
export declare function bytesToHex(bytes: Uint8Array): string;
/**
 * Converts a UTF-8 string to bytes.
 * @param {string} str - The input string to convert to bytes.
 * @returns {Uint8Array} Uint8Array containing the UTF-8 encoded bytes.
 * @throws {Error} If the input is not a string.
 */
export declare function utf8ToBytes(str: string): Uint8Array;
//# sourceMappingURL=bytes.d.ts.map