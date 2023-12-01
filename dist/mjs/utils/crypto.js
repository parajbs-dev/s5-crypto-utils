/* eslint-disable jsdoc/require-param */
/* eslint-disable jsdoc/check-param-names */
/* eslint-disable jsdoc/require-param-description */
import { Buffer } from "buffer";
import * as sodium from 'libsodium-wrappers';
import { blake3 } from "@noble/hashes/blake3";
import { deriveHashBlake3Int, deriveHashBlake3 } from './derive_hash';
import { mkeyEd25519 } from "./constants";
/**
 * Represents an Ed25519 key pair.
 */
export class KeyPairEd25519 {
    /**
     * Creates an instance of KeyPairEd25519.
     * @param {Uint8Array} bytes - The bytes for the key pair.
     */
    constructor(bytes) {
        this._bytes = bytes;
    }
    /**
     * Gets the public key for this key pair.
     * @returns {Promise<Uint8Array>} The public key.
     */
    async publicKey() {
        await sodium.ready;
        return new Uint8Array([...Array.from([mkeyEd25519]), ...Array.from(await this.publicKeyRaw())]);
    }
    /**
     * Gets the raw public key for this key pair.
     * @returns {Promise<Uint8Array>} The raw public key.
     */
    async publicKeyRaw() {
        await sodium.ready;
        if (this._bytes.length === 64) {
            return sodium.crypto_sign_seed_keypair(this._bytes.slice(0, 32)).publicKey;
        }
        else {
            if (this._bytes.length === 32) {
                return sodium.crypto_sign_seed_keypair(this._bytes).publicKey;
            }
            else {
                throw new Error(`ERROR: privateKey must be 32 or 64 Uint8Array.`);
            }
        }
    }
    /**
     * Extracts the bytes of this key pair.
     * @returns {Uint8Array} The bytes of the key pair.
     */
    async extractBytes() {
        return this._bytes;
    }
}
/**
 * Class representing a CryptoImplementation for cryptographic operations.
 */
export class CryptoImplementation {
    /**
     * Generates random bytes of the specified length.
     * @param length The length of the random bytes to generate.
     * @returns A Promise that resolves to a Buffer containing the random bytes.
     */
    async generateRandomBytes(length) {
        // Generates random bytes of the specified length
        await sodium.ready;
        return Buffer.from(sodium.randombytes_buf(length));
    }
    /**
     * Computes the Blake3 hash of the input data asynchronously.
     * @param input The input data to hash.
     * @returns A Promise that resolves to a Buffer containing the hash.
     */
    async hashBlake3(input) {
        return Buffer.from(blake3(input));
    }
    /**
     * Computes the Blake3 hash of the input data synchronously.
     * @param input The input data to hash.
     * @returns A Buffer containing the hash.
     */
    hashBlake3_1(input) {
        // Computes the Blake3 hash of the input data (synchronous)
        return Buffer.from(blake3(input));
    }
    /**
     * Computes the Blake3 hash of the input data synchronously using a stream.
     * @param input The input data to hash.
     * @returns A Buffer containing the hash.
     */
    hashBlake3Sync(input) {
        // Computes the Blake3 hash of the input data (synchronously) using a stream
        const hasher = blake3.create({});
        hasher.update(input);
        return Buffer.from(hasher.digest());
    }
    /**
     * Computes the Blake3 hash of a readable stream.
     * @param input The readable stream to hash.
     * @returns A Promise that resolves to a Buffer containing the hash.
     */
    async hashBlake3Stream(input) {
        // Computes the Blake3 hash of a readable stream
        const stream = input;
        const hasher = await blake3.create({});
        return new Promise((resolve, reject) => {
            stream.on("error", (err) => reject(err));
            stream.on("data", (chunk) => hasher.update(chunk));
            stream.on("end", () => resolve(Buffer.from(hasher.digest())));
        });
    }
    /**
     * Verifies an Ed25519 signature.
     * @param pk - Public key as a Buffer.
     * @param message - Message as a Buffer.
     * @param signature - Signature as a Buffer.
     * @returns A Promise that resolves to a boolean indicating whether the signature is valid.
     */
    async verifyEd25519({ pk, message, signature }) {
        // Verifies an Ed25519 signature
        await sodium.ready;
        const publicKey = pk.slice(1);
        return sodium.crypto_sign_verify_detached(signature, message, publicKey);
    }
    /**
     * Signs a message using Ed25519 private key.
     * @param kp The key pair containing the private key.
     * @param message The message to sign.
     * @returns A Promise that resolves to a Buffer containing the signature.
     */
    async signEd25519({ kp, message }) {
        // Signs a message using Ed25519 private key
        await sodium.ready;
        const signature = sodium.crypto_sign_detached(message, await kp.extractBytes());
        return signature;
    }
    /**
     * Generates a new Ed25519 key pair from a seed.
     * @param seed The seed used to generate the key pair.
     * @returns A Promise that resolves to a KeyPairEd25519 object.
     */
    async newKeyPairEd25519({ seed }) {
        await sodium.ready;
        const sodiumKeyPair = sodium.crypto_sign_seed_keypair(seed);
        return new KeyPairEd25519(sodiumKeyPair.privateKey);
    }
    /**
     * Encrypts plaintext using XChaCha20-Poly1305.
     * @param key The encryption key.
     * @param nonce The nonce.
     * @param plaintext The plaintext to encrypt.
     * @returns A Promise that resolves to a Buffer containing the ciphertext.
     */
    async encryptXChaCha20Poly1305({ key, nonce, plaintext }) {
        // Encrypts plaintext using XChaCha20-Poly1305
        await sodium.ready;
        const ciphertext = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(plaintext, null, null, nonce, key);
        return Buffer.from(ciphertext);
    }
    /**
     * Decrypts XChaCha20-Poly1305 ciphertext.
     * @param key The decryption key.
     * @param nonce The nonce.
     * @param ciphertext The ciphertext to decrypt.
     * @returns A Promise that resolves to a Buffer containing the plaintext.
     */
    async decryptXChaCha20Poly1305({ key, nonce, ciphertext }) {
        // Decrypts XChaCha20-Poly1305 ciphertext
        await sodium.ready;
        const plaintext = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(null, ciphertext, null, nonce, key);
        return Buffer.from(plaintext);
    }
}
const pathKeyDerivationTweak = 1;
/**
 * Derives the path key for a given path.
 * @param path - The path to derive the key for.
 * @returns The derived path key as a `Uint8Array`.
 */
export function _derivePathKeyForPath(_hiddenRootKey, path) {
    const pathSegments = path.split('/').map(e => e.trim()).filter(element => element.length > 0);
    const key = deriveKeyForPathSegments(_hiddenRootKey, pathSegments);
    return deriveHashBlake3Int(key, pathKeyDerivationTweak);
}
/**
 * Derives the key for path segments.
 * @param pathSegments - An array of path segments.
 * @returns The derived key as a `Uint8Array`.
 */
export function deriveKeyForPathSegments(_hiddenRootKey, pathSegments) {
    if (pathSegments.length === 0) {
        return _hiddenRootKey;
    }
    return deriveHashBlake3(deriveKeyForPathSegments(_hiddenRootKey, pathSegments.slice(0, pathSegments.length - 1)), new TextEncoder().encode(pathSegments[pathSegments.length - 1]));
}
