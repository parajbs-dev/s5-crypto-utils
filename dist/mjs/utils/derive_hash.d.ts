/**
 * Derives a Blake3 hash based on a base and tweak using the given crypto implementation.
 * @param {number[]} base - The base data (32 bytes).
 * @param {number[]} tweak - The tweak data.
 * @returns {Uint8Array} - The derived Blake3 hash.
 * @throws {string} - If the base length is not 32.
 */
export declare function deriveHashBlake3(base: Uint8Array, tweak: number[]): Uint8Array;
/**
 * Derives a Blake3 hash based on a base and integer tweak using the given crypto implementation.
 * @param {number[]} base - The base data (32 bytes).
 * @param {number} tweak - The integer tweak.
 * @returns {Uint8Array} - The derived Blake3 hash.
 * @throws {string} - If the base length is not 32.
 */
export declare function deriveHashBlake3Int(base: Uint8Array, tweak: number): Uint8Array;
//# sourceMappingURL=derive_hash.d.ts.map