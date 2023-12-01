/// <reference types="node" />
/// <reference types="node" />
import { Buffer } from "buffer";
/**
 * Represents an Ed25519 key pair.
 */
export declare class KeyPairEd25519 {
    private _bytes;
    /**
     * Creates an instance of KeyPairEd25519.
     * @param {Uint8Array} bytes - The bytes for the key pair.
     */
    constructor(bytes: Uint8Array);
    /**
     * Gets the public key for this key pair.
     * @returns {Promise<Uint8Array>} The public key.
     */
    publicKey(): Promise<Uint8Array>;
    /**
     * Gets the raw public key for this key pair.
     * @returns {Promise<Uint8Array>} The raw public key.
     */
    publicKeyRaw(): Promise<Uint8Array>;
    /**
     * Extracts the bytes of this key pair.
     * @returns {Uint8Array} The bytes of the key pair.
     */
    extractBytes(): Promise<Uint8Array>;
}
/**
 * Class representing a CryptoImplementation for cryptographic operations.
 */
export declare class CryptoImplementation {
    /**
     * Generates random bytes of the specified length.
     * @param length The length of the random bytes to generate.
     * @returns A Promise that resolves to a Buffer containing the random bytes.
     */
    generateRandomBytes(length: number): Promise<Buffer>;
    /**
     * Computes the Blake3 hash of the input data asynchronously.
     * @param input The input data to hash.
     * @returns A Promise that resolves to a Buffer containing the hash.
     */
    hashBlake3(input: Buffer): Promise<Buffer>;
    /**
     * Computes the Blake3 hash of the input data synchronously.
     * @param input The input data to hash.
     * @returns A Buffer containing the hash.
     */
    hashBlake3_1(input: Buffer): Buffer;
    /**
     * Computes the Blake3 hash of the input data synchronously using a stream.
     * @param input The input data to hash.
     * @returns A Buffer containing the hash.
     */
    hashBlake3Sync(input: Buffer): Buffer;
    /**
     * Computes the Blake3 hash of a readable stream.
     * @param input The readable stream to hash.
     * @returns A Promise that resolves to a Buffer containing the hash.
     */
    hashBlake3Stream(input: NodeJS.ReadableStream): Promise<Buffer>;
    /**
     * Verifies an Ed25519 signature.
     * @param pk - Public key as a Buffer.
     * @param message - Message as a Buffer.
     * @param signature - Signature as a Buffer.
     * @returns A Promise that resolves to a boolean indicating whether the signature is valid.
     */
    verifyEd25519({ pk, message, signature }: {
        pk: Buffer;
        message: Buffer;
        signature: Buffer;
    }): Promise<boolean>;
    /**
     * Signs a message using Ed25519 private key.
     * @param kp The key pair containing the private key.
     * @param message The message to sign.
     * @returns A Promise that resolves to a Buffer containing the signature.
     */
    signEd25519({ kp, message }: {
        kp: KeyPairEd25519;
        message: Uint8Array;
    }): Promise<Uint8Array>;
    /**
     * Generates a new Ed25519 key pair from a seed.
     * @param seed The seed used to generate the key pair.
     * @returns A Promise that resolves to a KeyPairEd25519 object.
     */
    newKeyPairEd25519({ seed }: {
        seed: Uint8Array;
    }): Promise<KeyPairEd25519>;
    /**
     * Encrypts plaintext using XChaCha20-Poly1305.
     * @param key The encryption key.
     * @param nonce The nonce.
     * @param plaintext The plaintext to encrypt.
     * @returns A Promise that resolves to a Buffer containing the ciphertext.
     */
    encryptXChaCha20Poly1305({ key, nonce, plaintext }: {
        key: Buffer;
        nonce: Buffer;
        plaintext: Buffer;
    }): Promise<Buffer>;
    /**
     * Decrypts XChaCha20-Poly1305 ciphertext.
     * @param key The decryption key.
     * @param nonce The nonce.
     * @param ciphertext The ciphertext to decrypt.
     * @returns A Promise that resolves to a Buffer containing the plaintext.
     */
    decryptXChaCha20Poly1305({ key, nonce, ciphertext }: {
        key: Buffer;
        nonce: Buffer;
        ciphertext: Buffer;
    }): Promise<Buffer>;
}
/**
 * Derives the path key for a given path.
 * @param path - The path to derive the key for.
 * @returns The derived path key as a `Uint8Array`.
 */
export declare function _derivePathKeyForPath(_hiddenRootKey: Uint8Array, path: string): Uint8Array;
/**
 * Derives the key for path segments.
 * @param pathSegments - An array of path segments.
 * @returns The derived key as a `Uint8Array`.
 */
export declare function deriveKeyForPathSegments(_hiddenRootKey: Uint8Array, pathSegments: string[]): Uint8Array;
//# sourceMappingURL=crypto.d.ts.map