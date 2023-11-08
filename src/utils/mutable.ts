import { Buffer } from "buffer";
import { encodeEndian, decodeEndian } from './endian';
import { padFileSizeDefault, checkPaddedBlock } from './padding';

import { CryptoImplementation } from './crypto';
const crypto = new CryptoImplementation();

export const encryptionKeyLength = 32;
export const encryptionNonceLength = 24;
export const encryptionOverheadLength = 16;

/**
 * Encrypts mutable bytes using XChaCha20-Poly1305.
 * @param data - The data to be encrypted.
 * @param key - The encryption key.
 * @returns The encrypted data.
 */
export async function encryptMutableBytes(data: Uint8Array, key: Uint8Array): Promise<Buffer> {
  const lengthInBytes = encodeEndian(data.length, 4);
  const totalOverhead = encryptionOverheadLength + 4 + encryptionNonceLength + 2;
  const finalSize = padFileSizeDefault(data.length + totalOverhead) - totalOverhead;
  const encryptedKey = Buffer.from(key);

  const paddedData = Buffer.concat([lengthInBytes, data, Buffer.alloc(finalSize - data.length)]);
  const nonce = await crypto.generateRandomBytes(encryptionNonceLength);

  const header = new Uint8Array([0x8d, 0x01, ...nonce]);
  const encryptedBytes = await crypto.encryptXChaCha20Poly1305({ key: encryptedKey, nonce, plaintext: paddedData });
  const res = new Uint8Array([...header, ...encryptedBytes]);

  return Buffer.from(res);
}

/**
 * Decrypts a Uint8List using the provided key and crypto implementation.
 * @param data - The data to decrypt.
 * @param key - The decryption key.
 * @returns A Promise that resolves to the decrypted Uint8List.
 * @throws Error if the key length is incorrect or if the data is invalid.
 */
export async function decryptMutableBytes(
  data: Uint8Array,
  key: Uint8Array
): Promise<Uint8Array> {
  if (key.length !== encryptionKeyLength) {
    throw new Error(`wrong encryptionKeyLength (${key.length} !== ${encryptionKeyLength})`);
  }

  // Validate that the size of the data corresponds to a padded block.
  if (!checkPaddedBlock(data.length)) {
    throw new Error(
      `Expected parameter 'data' to be padded encrypted data, length was '${data.length}', nearest padded block is '${padFileSizeDefault(data.length)}'`
    );
  }

  const version = data[1];
  if (version !== 0x01) {
    throw new Error('Invalid version');
  }

  const encryptedKey = Buffer.from(key);
  const encryptedData = Buffer.from(data.subarray(encryptionNonceLength + 2));

  // Extract the nonce.
  const nonce = Buffer.from(data.subarray(2, encryptionNonceLength + 2));

  const decryptedBytes = await crypto.decryptXChaCha20Poly1305({
    key: encryptedKey,
    nonce,
    // ciphertext: data.subarray(encryptionNonceLength + 2),
    ciphertext: encryptedData,
  });

  const lengthInBytes = decryptedBytes.subarray(0, 4);
  const length = decodeEndian(lengthInBytes);

  return decryptedBytes.subarray(4, length + 4);
}
