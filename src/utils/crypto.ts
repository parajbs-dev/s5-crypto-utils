/* eslint-disable jsdoc/require-param */
/* eslint-disable jsdoc/check-param-names */
/* eslint-disable jsdoc/require-param-description */
import { Buffer } from "buffer";
import * as sodium from 'libsodium-wrappers';
import { blake3 } from "@noble/hashes/blake3";
import { generateSeedFromPhrase } from "./seed"

import { encodeBase64URL } from "./tools";
import { deriveHashBlake3Int, deriveHashBlake3 } from './derive_hash';
import { mkeyEd25519 } from "./constants";

/**
 * Represents an Ed25519 key pair.
 */
export class KeyPairEd25519 {
  private _bytes: Uint8Array;

  /**
   * Creates an instance of KeyPairEd25519.
   * @param {Uint8Array} bytes - The bytes for the key pair.
   */
  constructor(bytes: Uint8Array) {
    this._bytes = bytes;
  }

  /**
   * Gets the public key for this key pair.
   * @returns {Uint8Array} The public key.
   */
  public get publicKey(): Uint8Array {
    return new Uint8Array([ ...Uint8Array.from([mkeyEd25519]), ...this.publicKeyRaw ]);
  }

  /**
   * Gets the raw public key for this key pair.
   * @returns {Uint8Array} The raw public key.
   */
  public get publicKeyRaw(): Uint8Array {
    if (this._bytes.length === 64) {
      return sodium.crypto_sign_seed_keypair(this._bytes.slice(0, 32)).publicKey;
    } else {
      if (this._bytes.length === 32) {
        return sodium.crypto_sign_seed_keypair(this._bytes).publicKey;
      } else {
        throw new Error(`ERROR: privateKey must 32 od 64 Uint8Array.`);
      }
    }
  }

  /**
   * Extracts the bytes of this key pair.
   * @returns {Uint8Array} The bytes of the key pair.
   */
  public extractBytes(): Uint8Array {
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
  async generateRandomBytes(length: number): Promise<Buffer> {
    // Generates random bytes of the specified length
    await sodium.ready;
    return Buffer.from(sodium.randombytes_buf(length));
  }

  /**
   * Computes the Blake3 hash of the input data asynchronously.
   * @param input The input data to hash.
   * @returns A Promise that resolves to a Buffer containing the hash.
   */
  async hashBlake3(input: Buffer): Promise<Buffer> {
    return Buffer.from(blake3(input));
  }

  /**
   * Computes the Blake3 hash of the input data synchronously.
   * @param input The input data to hash.
   * @returns A Buffer containing the hash.
   */
  hashBlake3_1(input: Buffer): Buffer {
    // Computes the Blake3 hash of the input data (synchronous)
    return Buffer.from(blake3(input));
  }

  /**
   * Computes the Blake3 hash of the input data synchronously using a stream.
   * @param input The input data to hash.
   * @returns A Buffer containing the hash.
   */
  hashBlake3Sync(input: Buffer): Buffer {
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
  async hashBlake3Stream(input: NodeJS.ReadableStream): Promise<Buffer> {
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
  async verifyEd25519({ pk, message, signature }: { pk: Buffer, message: Buffer, signature: Buffer }): Promise<boolean> {
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
  async signEd25519({ kp, message }: { kp: KeyPairEd25519, message: Uint8Array }): Promise<Uint8Array> {
    // Signs a message using Ed25519 private key
    await sodium.ready;
    const signature = sodium.crypto_sign_detached(message, kp.extractBytes());
    return signature;
  }

  /**
   * Generates a new Ed25519 key pair from a seed.
   * @param seed The seed used to generate the key pair.
   * @returns A Promise that resolves to a KeyPairEd25519 object.
   */
  async newKeyPairEd25519({ seed }: { seed: Uint8Array }): Promise<KeyPairEd25519> {
    await sodium.ready;
    const sodiumKeyPair = sodium.crypto_sign_seed_keypair(seed);
    return new KeyPairEd25519(sodiumKeyPair.privateKey);
  }

  /**
   * Derives an Ed25519 key pair from a master key and a data seed.
   * @param masterKey - The master key as a Uint8Array or string.
   * @param dataSeed - The data seed as a Uint8Array or string.
   * @param deriveLength - (Optional) The length of the derived key in bytes.
   * @returns A Promise that resolves to an object containing the derived Ed25519 key pair with publicKey and privateKey.
   */
  async deriveEd25519(masterKey: Uint8Array | string, dataSeed: Uint8Array | string, deriveLength?: number): Promise<{ privateKey: string, publicKey: string }> {
    await sodium.ready;
    let hasher;
    if (deriveLength) {
      hasher = blake3.create({ dkLen: deriveLength });
    } else {
      hasher = blake3.create({});
    }
    const masterKeyBytes = typeof masterKey === "string" ? new TextEncoder().encode(masterKey) : masterKey;
    const dataSeedBytes = typeof dataSeed === "string" ? new TextEncoder().encode(dataSeed) : dataSeed;
    hasher.update(new Uint8Array([...masterKeyBytes, ...dataSeedBytes]));
    const saltEd25519Key = hasher.digest();
    const keyPair = sodium.crypto_sign_seed_keypair(saltEd25519Key);
    const kp = new KeyPairEd25519(keyPair.privateKey);
    return {
      privateKey: encodeBase64URL(Buffer.from(kp.extractBytes())),
      publicKey: encodeBase64URL(Buffer.from(kp.publicKey)),
    };
  }

  /**
   * Encrypts plaintext using XChaCha20-Poly1305.
   * @param key The encryption key.
   * @param nonce The nonce.
   * @param plaintext The plaintext to encrypt.
   * @returns A Promise that resolves to a Buffer containing the ciphertext.
   */
  async encryptXChaCha20Poly1305({ key, nonce, plaintext }: { key: Buffer, nonce: Buffer, plaintext: Buffer }): Promise<Buffer> {
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
  async decryptXChaCha20Poly1305({ key, nonce, ciphertext }: { key: Buffer, nonce: Buffer, ciphertext: Buffer }): Promise<Buffer> {
    // Decrypts XChaCha20-Poly1305 ciphertext
    await sodium.ready;
    const plaintext = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(null, ciphertext, null, nonce, key);
    return Buffer.from(plaintext);
  }
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
export async function genKeyPairAndSeed(length = 32): Promise<KeyPairAndSeed> {
  await sodium.ready; // Make sure sodium is ready for use

  const crypto = new CryptoImplementation(); 
  const randomSeed =  await crypto.generateRandomBytes(length);
  const keyPair = await crypto.newKeyPairEd25519({ seed: randomSeed });

  return {
    privateKey: encodeBase64URL(Buffer.from(keyPair.extractBytes())),
    publicKey: encodeBase64URL(Buffer.from(keyPair.publicKey)),
    publicKeyRaw: encodeBase64URL(Buffer.from(keyPair.publicKey.slice(1))),
    seed: Buffer.from(randomSeed).toString('hex'),
  };
}

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
export async function genKeyPairFromSeed(seed2: string): Promise<KeyPair> {
  await sodium.ready;

  const seed = await generateSeedFromPhrase(seed2);

  const crypto = new CryptoImplementation(); 
  const keyPair = await crypto.newKeyPairEd25519({ seed: seed });

  return {
    privateKey: encodeBase64URL(Buffer.from(keyPair.extractBytes())),
    publicKey: encodeBase64URL(Buffer.from(keyPair.publicKey)),
    publicKeyRaw: encodeBase64URL(Buffer.from(keyPair.publicKey.slice(1)))
  }; 
}

/**
 * The length of the Blake3 hash in bytes.
 */
export const HASH_LENGTH = 32;

/**
 * Hashes multiple Uint8Array inputs using Blake3 and returns the result.
 * @param {...Uint8Array} args - The Uint8Array inputs to hash.
 * @returns {blake3.Hasher} A new Blake3 hash instance.
 */
export async function hashAll(...args: Uint8Array[]): Promise<Uint8Array> {
  const hasher = await blake3.create({ dkLen: HASH_LENGTH });
  args.forEach((arg) => hasher.update(arg));
  return hasher.digest();
}

/**
 * Derives a child seed from a master seed and a tweak seed using Blake3 hash function.
 * @param masterSeed - The master seed as a Uint8Array.
 * @param tweakSeed - The tweak seed as a string.
 * @returns A promise that resolves to the derived seed as a Uint8Array.
 */
export async function deriveChildSeed(
  masterSeed: Uint8Array,
  tweakSeed: string,
): Promise<Uint8Array> {
  const tweakHash = blake3(tweakSeed);

  const hasher = blake3.create({});
  hasher.update(new Uint8Array([ ...masterSeed, ...tweakHash]));
  const derivedSeed = hasher.digest();

  return derivedSeed;
}

/**
 * Derives an Ed25519 key pair from a master key and a data seed.
 * @param masterKey - The master key as a Uint8Array or string.
 * @param dataSeed - The data seed as a Uint8Array or string.
 * @param deriveLength - (Optional) The length of the derived key in bytes.
 * @returns A Promise that resolves to an object containing the derived Ed25519 key pair with publicKey and privateKey.
 */
export async function deriveEd25519(masterKey: Uint8Array | string, dataSeed: Uint8Array | string, deriveLength?: number): Promise<{ privateKey: string, publicKey: string }> {
  await sodium.ready;
  let hasher;
  if (deriveLength) {
    hasher = blake3.create({ dkLen: deriveLength });
  } else {
    hasher = blake3.create({});
  }

  const masterKeyBytes = typeof masterKey === "string" ? new TextEncoder().encode(masterKey) : masterKey;
  const dataSeedBytes = typeof dataSeed === "string" ? new TextEncoder().encode(dataSeed) : dataSeed;
  hasher.update(new Uint8Array([...masterKeyBytes, ...dataSeedBytes]));
  const saltEd25519Key = hasher.digest();
  const keyPair = sodium.crypto_sign_seed_keypair(saltEd25519Key);
  const kp = new KeyPairEd25519(keyPair.privateKey);

  return {
    privateKey: encodeBase64URL(Buffer.from(kp.extractBytes())),
    publicKey: encodeBase64URL(Buffer.from(kp.publicKey)),
  };
}

/**
 * Derive a data key from a master key and data seed.
 * @param masterKey - The master key as a Uint8Array or string.
 * @param dataSeed - The data seed as a Uint8Array or string.
 * @param deriveLength - The length of the derived key (optional).
 * @returns A Promise that resolves to the derived key as a string.
 */
export async function getDataKey(masterKey: Uint8Array | string, dataSeed: Uint8Array | string, deriveLength?: number): Promise<string> {
  await sodium.ready;
  //const devKey = await testgen1();
  let hasher;
  if (deriveLength) {
    hasher = blake3.create({ dkLen: deriveLength });
  } else {
    hasher = blake3.create({});
  }

  const masterKeyBytes = typeof masterKey === "string" ? new TextEncoder().encode(masterKey) : masterKey;
  const dataSeedBytes = typeof dataSeed === "string" ? new TextEncoder().encode(dataSeed) : dataSeed;

  hasher.update(new Uint8Array([...masterKeyBytes, ...dataSeedBytes]));
  const saltEd25519Key = hasher.digest();
  const keyPair = sodium.crypto_sign_seed_keypair(saltEd25519Key);
  const kp = new KeyPairEd25519(keyPair.privateKey);

  return encodeBase64URL(Buffer.from(kp.publicKey));
}

/**
 * Generates random bytes using libsodium.
 * @returns A Promise that resolves to a Uint8Array of random bytes.
 */
export async function testgen1(): Promise<Uint8Array> {
    // Ensure that the sodium library is ready
    await sodium.ready;

    // Define the length of the seed in bytes
    const randombytes_SEEDBYTES = 32;

    // Define a specific seed value in hexadecimal format
    const seed1 = Buffer.from("31f219fef332e625121fa01a518f77411f04286bff7340f7cfa933d80440fbcc", 'hex');

    // Generate a random seed
    const seed2 = sodium.randombytes_buf(randombytes_SEEDBYTES);

    // Generate random bytes deterministically using seed1
    const randomBytes1 = sodium.randombytes_buf_deterministic(32, seed1);

    // Generate random bytes deterministically using seed2
    const randomBytes2 = sodium.randombytes_buf_deterministic(32, seed2);

    // Print the seed values, deterministic bytes, and memory comparison results
    console.log(`Seed 1: ${sodium.to_hex(seed1)}`);
    console.log(`Seed 2: ${sodium.to_hex(seed2)}`);
    console.log(`Deterministic bytes 1: ${sodium.to_hex(randomBytes1)}`);
    console.log(`Deterministic bytes 2: ${sodium.to_hex(randomBytes2)}`);
    console.log(sodium.memcmp(seed1, seed2));
    console.log(sodium.memcmp(randomBytes1, randomBytes2));

    // Return the randomBytes1 as a Uint8Array
    return randomBytes1;
}

/**
 * Converts a Uint8Array to an unsigned integer using the specified length.
 * @param Uint8Arr - The input Uint8Array to convert.
 * @returns The converted unsigned integer.
 */
function convert(Uint8Arr: Uint8Array) {
    const length = Uint8Arr.length;
    const buffer = Buffer.from(Uint8Arr);
    const result = buffer.readUIntBE(0, length);
    return result;
}

const pathKeyDerivationTweak = 1;

  /**
   * Derives the path key for a given path.
   * @param path - The path to derive the key for.
   * @returns The derived path key as a `Uint8Array`.
   */
export function _derivePathKeyForPath(_hiddenRootKey: Uint8Array, path: string): Uint8Array {
    const pathSegments = path.split('/').map(e => e.trim()).filter(element => element.length > 0);
//    console.log('p1: ', pathSegments);
    const key = deriveKeyForPathSegments(_hiddenRootKey, pathSegments);
//    console.log('p2: ', key);
    return deriveHashBlake3Int(key, pathKeyDerivationTweak);
  }

  /**
   * Derives the key for path segments.
   * @param pathSegments - An array of path segments.
   * @returns The derived key as a `Uint8Array`.
   */
export function deriveKeyForPathSegments(_hiddenRootKey: Uint8Array, pathSegments: string[]): Uint8Array {
    if (pathSegments.length === 0) {
      return _hiddenRootKey;
    }

    return deriveHashBlake3(
      deriveKeyForPathSegments(_hiddenRootKey, pathSegments.slice(0, pathSegments.length - 1)),
      [convert(Buffer.from(pathSegments[pathSegments.length - 1], 'utf8'))]
    );
  }
