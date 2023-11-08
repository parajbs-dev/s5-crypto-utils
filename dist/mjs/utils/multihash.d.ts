/**
 * Represents a Multihash.
 */
export declare class Multihash {
    fullBytes: Uint8Array;
    /**
     * Creates a new instance of Multihash.
     * @param fullBytes - The full bytes of the Multihash.
     */
    constructor(fullBytes: Uint8Array);
    /**
     * Gets the function type of the Multihash.
     * @returns {number} The function type.
     */
    get functionType(): number;
    /**
     * Gets the hash bytes of the Multihash.
     * @returns {Uint8Array} The hash bytes.
     */
    get hashBytes(): Uint8Array;
    /**
     * Creates a Multihash from a base64 URL-encoded string.
     * @param hash - The base64 URL-encoded hash string.
     * @returns A Multihash instance.
     */
    static fromBase64Url(hash: string): Multihash;
    /**
     * Converts the Multihash to a base64 URL-encoded string.
     * @returns The base64 URL-encoded hash string.
     */
    toBase64Url(): string;
    /**
     * Converts the Multihash to a base32-encoded string.
     * @returns The base32-encoded hash string.
     */
    toBase32(): string;
    /**
     * Converts the Multihash to a string representation.
     * @returns The string representation of the Multihash.
     */
    toString(): string;
    /**
     * Checks if the Multihash is equal to another object.
     * @param other - The other object to compare.
     * @returns True if the Multihash is equal to the other object, false otherwise.
     */
    equals(other: any): boolean;
    /**
     * Gets the hash code of the Multihash.
     * @returns {number} The hash code.
     */
    get hashCode(): number;
}
//# sourceMappingURL=multihash.d.ts.map