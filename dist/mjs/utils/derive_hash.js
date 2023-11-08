import { CryptoImplementation } from "./crypto";
import { encodeEndian } from "./endian";
import { Buffer } from "buffer";
/**
 * Derives a Blake3 hash based on a base and tweak using the given crypto implementation.
 * @param {number[]} base - The base data (32 bytes).
 * @param {number[]} tweak - The tweak data.
 * @returns {Uint8Array} - The derived Blake3 hash.
 * @throws {string} - If the base length is not 32.
 */
export function deriveHashBlake3(base, tweak) {
    if (base.length !== 32) {
        throw 'Invalid base length';
    }
    const crypto = new CryptoImplementation();
    return crypto.hashBlake3Sync(Buffer.from([...base, ...crypto.hashBlake3Sync(Buffer.from(tweak))]));
}
/**
 * Derives a Blake3 hash based on a base and integer tweak using the given crypto implementation.
 * @param {number[]} base - The base data (32 bytes).
 * @param {number} tweak - The integer tweak.
 * @returns {Uint8Array} - The derived Blake3 hash.
 * @throws {string} - If the base length is not 32.
 */
export function deriveHashBlake3Int(base, tweak) {
    if (base.length !== 32) {
        throw 'Invalid base length';
    }
    const crypto = new CryptoImplementation();
    return crypto.hashBlake3Sync(Buffer.from([...base, ...encodeEndian(tweak, 32)]));
}
