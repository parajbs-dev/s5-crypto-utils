/// <reference types="node" />
import { Buffer } from "buffer";
export declare const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
/**
 * Encodes a buffer of bytes using Base58 encoding (specifically designed for Bitcoin addresses).
 * @param bytes The buffer of bytes to encode.
 * @returns The Base58-encoded string representation of the input bytes.
 */
export declare function encodeBase58BTC(bytes: Buffer): string;
/**
 * Encodes a buffer into a Base64URL string.
 * @param input - The buffer to be encoded.
 * @returns The Base64URL-encoded string.
 */
export declare function encodeBase64URL(input: Buffer): string;
//# sourceMappingURL=tools.d.ts.map