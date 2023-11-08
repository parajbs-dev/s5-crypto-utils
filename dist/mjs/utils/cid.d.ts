import Multibase from "./multibase";
import { Multihash } from "./multihash";
/**
 * Class representing a CID (Content Identifier).
 */
export default class CID extends Multibase {
    type: number;
    hash: Multihash;
    size?: number;
    /**
     * Create a new CID instance.
     * @param {number} type - The type of the CID.
     * @param {Multihash} hash - The Multihash of the CID.
     * @param {number | undefined} size - The size of the CID (optional).
     */
    constructor(type: number, hash: Multihash, size?: number);
    /**
     * Decode a CID from its string representation.
     * @param {string} cid - The CID string to decode.
     * @returns {CID} A new CID instance.
     */
    static decode(cid: string): CID;
    /**
     * Create a CID from registry bytes.
     * @param {Uint8Array} bytes - The registry bytes.
     * @returns {CID} A new CID instance.
     * @throws {Error} If the registry type is invalid.
     */
    static fromRegistry(bytes: Uint8Array): CID;
    /**
     * Create a CID from raw bytes.
     * @param {Uint8Array} bytes - The raw bytes.
     * @returns {CID} A new CID instance.
     */
    static fromBytes(bytes: Uint8Array): CID;
    /**
     * Create a CID from a registry public key.
     * @param {string | Uint8Array} pubkey - The public key.
     * @returns {CID} A new CID instance.
     */
    static fromRegistryPublicKey(pubkey: string | Uint8Array): CID;
    /**
     * Create a CID from a hash.
     * @param {string | Uint8Array} bytes - The hash bytes.
     * @param {number} size - The size of the CID.
     * @param {number} type - The type of the CID.
     * @returns {CID} A new CID instance.
     * @throws {Error} If the CID type is invalid.
     */
    static fromHash(bytes: string | Uint8Array, size: number, type?: number): CID;
    /**
     * Verify if a given value is a valid CID.
     * @param {string | Uint8Array} bytes - The value to verify.
     * @returns {boolean} True if the value is a valid CID, false otherwise.
     */
    static verify(bytes: string | Uint8Array): boolean;
    /**
     * Initialize a CID from bytes.
     * @param {Uint8Array} bytes - The input bytes.
     * @throws {Error} Throws an error if the input is invalid.
     * @returns {CID} The initialized CID.
     */
    private static _init;
    /**
     * Create a copy of this CID with optional type and size.
     * @param {object} options - Options for creating the copy.
     * @param {number} options.type - The type of the copy.
     * @param {number} options.size - The size of the copy.
     * @throws {Error} Throws an error if the input is invalid.
     * @returns {CID} The copied CID.
     */
    copyWith({ size, type }: {
        type?: number;
        size?: number;
    }): CID;
    /**
     * Convert CID to a Uint8Array of bytes.
     * @returns {Uint8Array} The bytes representation of the CID.
     */
    toBytes(): Uint8Array;
    /**
     * Get the prefix bytes for the CID.
     * @returns {Uint8Array} The prefix bytes.
     * @private
     */
    private _getPrefixBytes;
    /**
     * Convert CID to a registry entry as Uint8Array.
     * @returns {Uint8Array} The registry entry as bytes.
     */
    toRegistryEntry(): Uint8Array;
    /**
     * Convert CID to a registry CID as Uint8Array.
     * @returns {Uint8Array} The registry CID as bytes.
     */
    toRegistryCID(): Uint8Array;
    /**
     * Convert CID to a string representation.
     * @returns {string} The string representation of the CID.
     */
    toString(): string;
    /**
     * Check if two CIDs are equal.
     * @param {CID} other - The other CID to compare with.
     * @returns {boolean} True if the CIDs are equal, false otherwise.
     */
    equals(other: CID): boolean;
    /**
     * Compute the hash code for the CID.
     * @returns {number} The hash code for the CID.
     */
    hashCode(): number;
}
/**
 * Encode a Content Identifier (CID).
 * @param {Uint8Array} hash - The hash to encode.
 * @param {number} size - The size of the content.
 * @param {number} [type] - The CID type (optional, defaults to cidTypeRaw).
 * @param {number} [hashType] - The hash type (optional, defaults to mhashBlake3Default).
 * @returns {string} The encoded CID.
 * @throws {Error} If the hash is not a Uint8Array or if size is missing.
 */
export declare function encodeCid(hash: Uint8Array, size: number, type?: number, hashType?: number): string;
//# sourceMappingURL=cid.d.ts.map