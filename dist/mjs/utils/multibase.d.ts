/**
 * Multibase is an abstract class for encoding and decoding data using various encoding schemes.
 */
export default abstract class Multibase {
    /**
     * Convert the data to a Uint8Array.
     */
    abstract toBytes(): Uint8Array;
    /**
     * Decode a multibase string into a Uint8Array.
     * @param data The multibase string to decode.
     * @throws {Error} If the multibase encoding is not supported.
     * @returns The decoded Uint8Array.
     */
    static decodeString(data: string): Uint8Array;
    /**
     * Convert the data to a hexadecimal string.
     * @returns The hexadecimal string.
     */
    toHex(): string;
    /**
     * Convert the data to a base32 string.
     * @returns The base32 string.
     */
    toBase32(): string;
    /**
     * Convert the data to a base64url string.
     * @returns The base64url string.
     */
    toBase64Url(): string;
    /**
     * Convert the data to a base58 string.
     * @returns The base58 string.
     */
    toBase58(): string;
    /**
     * Convert the data to a base58 string (alias for toBase58).
     * @returns The base58 string.
     */
    toString(): string;
}
//# sourceMappingURL=multibase.d.ts.map