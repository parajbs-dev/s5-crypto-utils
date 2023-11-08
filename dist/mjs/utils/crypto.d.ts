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
     * @returns {Uint8Array} The public key.
     */
    get publicKey(): Uint8Array;
    /**
     * Gets the raw public key for this key pair.
     * @returns {Uint8Array} The raw public key.
     */
    get publicKeyRaw(): Uint8Array;
    /**
     * Extracts the bytes of this key pair.
     * @returns {Uint8Array} The bytes of the key pair.
     */
    extractBytes(): Uint8Array;
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
     * Derives an Ed25519 key pair from a master key and a data seed.
     * @param masterKey - The master key as a Uint8Array or string.
     * @param dataSeed - The data seed as a Uint8Array or string.
     * @param deriveLength - (Optional) The length of the derived key in bytes.
     * @returns A Promise that resolves to an object containing the derived Ed25519 key pair with publicKey and privateKey.
     */
    deriveEd25519(masterKey: Uint8Array | string, dataSeed: Uint8Array | string, deriveLength?: number): Promise<{
        privateKey: string;
        publicKey: string;
    }>;
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
 * Define the KeyPairAndSeed type.
 */
export interface KeyPairAndSeed {
    privateKey: string;
    publicKey: string;
    publicKeyRaw: string;
    seed: string;
}
/**
 * Generates a key pair and seed for cryptographic purposes.
 * @param length - The length of the seed (default: 32).
 * @returns An object containing the generated key pair and seed.
 */
export declare function genKeyPairAndSeed(length?: number): Promise<KeyPairAndSeed>;
/**
 * Define the KeyPair interface.
 */
export interface KeyPair {
    privateKey: string;
    publicKey: string;
    publicKeyRaw: string;
}
/**
 * Generates a key pair from a given seed using libsodium-wrappers.
 * @param seed - The seed as a string.
 * @returns A Promise that resolves to an object containing the generated public and private keys as hexadecimal strings.
 */
export declare function genKeyPairFromSeed(seed2: string): Promise<KeyPair>;
/**
 * The length of the Blake3 hash in bytes.
 */
export declare const HASH_LENGTH = 32;
/**
 * Hashes multiple Uint8Array inputs using Blake3 and returns the result.
 * @param {...Uint8Array} args - The Uint8Array inputs to hash.
 * @returns {blake3.Hasher} A new Blake3 hash instance.
 */
export declare function hashAll(...args: Uint8Array[]): Promise<Uint8Array>;
/**
 * Derives a child seed from a master seed and a tweak seed using Blake3 hash function.
 * @param masterSeed - The master seed as a Uint8Array.
 * @param tweakSeed - The tweak seed as a string.
 * @returns A promise that resolves to the derived seed as a Uint8Array.
 */
export declare function deriveChildSeed(masterSeed: Uint8Array, tweakSeed: string): Promise<Uint8Array>;
/**
 * Derives an Ed25519 key pair from a master key and a data seed.
 * @param masterKey - The master key as a Uint8Array or string.
 * @param dataSeed - The data seed as a Uint8Array or string.
 * @param deriveLength - (Optional) The length of the derived key in bytes.
 * @returns A Promise that resolves to an object containing the derived Ed25519 key pair with publicKey and privateKey.
 */
export declare function deriveEd25519(masterKey: Uint8Array | string, dataSeed: Uint8Array | string, deriveLength?: number): Promise<{
    privateKey: string;
    publicKey: string;
}>;
/**
 * Derive a data key from a master key and data seed.
 * @param masterKey - The master key as a Uint8Array or string.
 * @param dataSeed - The data seed as a Uint8Array or string.
 * @param deriveLength - The length of the derived key (optional).
 * @returns A Promise that resolves to the derived key as a string.
 */
export declare function getDataKey(masterKey: Uint8Array | string, dataSeed: Uint8Array | string, deriveLength?: number): Promise<string>;
/**
 * Generates random bytes using libsodium.
 * @returns A Promise that resolves to a Uint8Array of random bytes.
 */
export declare function testgen1(): Promise<Uint8Array>;
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