import { bytesToHex, hexToBytes, utf8ToBytes } from "./bytes";

import {
  encodeBase58BTC,
  decodeBase58BTC,
  encodeBase32RFC,
  decodeBase32RFC,
  encodeBase64URL,
  decodeBase64URL,
} from "./basetools";

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
  static decodeString(data: string): Uint8Array {
    let bytes: Uint8Array;
    if (data[0] === "z") {
      bytes = decodeBase58BTC(data.slice(1));
    } else if (data[0] === "f") {
      bytes = Uint8Array.from(hexToBytes(data.substring(1)));
    } else if (data[0] === "b") {
      let str = data.substring(1).toUpperCase();
      while (str.length % 4 !== 0) {
        str += "=";
      }
      bytes = decodeBase32RFC(str);
    } else if (data[0] === "u") {
      let str = data.substring(1);
      while (str.length % 4 !== 0) {
        str += "=";
      }
      bytes = decodeBase64URL(str);
    } else if (data[0] === ":") {
      bytes = utf8ToBytes(data);
    } else {
      throw new Error(`Multibase encoding ${data[0]} not supported`);
    }

    return bytes;
  }

  /**
   * Convert the data to a hexadecimal string.
   * @returns The hexadecimal string.
   */
  toHex(): string {
    return `f${bytesToHex(this.toBytes())}`;
  }

  /**
   * Convert the data to a base32 string.
   * @returns The base32 string.
   */
  toBase32(): string {
    return `b${encodeBase32RFC(this.toBytes()).replace(/=/g, "").toLowerCase()}`;
  }

  /**
   * Convert the data to a base64url string.
   * @returns The base64url string.
   */
  toBase64Url(): string {
    return `u${encodeBase64URL(this.toBytes())}`;
  }

  /**
   * Convert the data to a base58 string.
   * @returns The base58 string.
   */
  toBase58(): string {
    return 'z' + encodeBase58BTC(this.toBytes());
  }

  /**
   * Convert the data to a base58 string (alias for toBase58).
   * @returns The base58 string.
   */
  toString(): string {
    return this.toBase58();
  }
}
