/**
 * Derives a Blake3 hash based on the given base and tweak.
 * @param base - The base Uint8Array with a length of 32.
 * @param tweak - The tweak Uint8Array.
 * @returns The derived Blake3 hash as a Uint8Array.
 * @throws Throws an error if the base length is invalid.
 */
export declare function deriveHashBlake3(base: Uint8Array, tweak: Uint8Array): Uint8Array;
/**
 * Derives a hash using Blake3 with a given base and tweak.
 * @param base - The base Uint8Array for hash derivation (must have a length of 32).
 * @param tweak - The tweak number used in hash derivation.
 * @returns The derived Uint8Array hash.
 * @throws Throws an error if the base length is not 32.
 */
export declare function deriveHashBlake3Int(base: Uint8Array, tweak: number): Uint8Array;
//# sourceMappingURL=derive_hash.d.ts.map