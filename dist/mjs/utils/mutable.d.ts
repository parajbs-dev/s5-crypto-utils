/// <reference types="node" />
import { Buffer } from "buffer";
export declare const encryptionKeyLength = 32;
export declare const encryptionNonceLength = 24;
export declare const encryptionOverheadLength = 16;
/**
 * Encrypts mutable bytes using XChaCha20-Poly1305.
 * @param data - The data to be encrypted.
 * @param key - The encryption key.
 * @returns The encrypted data.
 */
export declare function encryptMutableBytes(data: Uint8Array, key: Uint8Array): Promise<Buffer>;
/**
 * Decrypts a Uint8List using the provided key and crypto implementation.
 * @param data - The data to decrypt.
 * @param key - The decryption key.
 * @returns A Promise that resolves to the decrypted Uint8List.
 * @throws Error if the key length is incorrect or if the data is invalid.
 */
export declare function decryptMutableBytes(data: Uint8Array, key: Uint8Array): Promise<Uint8Array>;
//# sourceMappingURL=mutable.d.ts.map