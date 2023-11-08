import { Buffer } from "buffer";

// Define the Base58 alphabet used for Bitcoin addresses
export const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

/**
 * Encodes a buffer of bytes using Base58 encoding (specifically designed for Bitcoin addresses).
 * @param bytes The buffer of bytes to encode.
 * @returns The Base58-encoded string representation of the input bytes.
 */
export function encodeBase58BTC(bytes: Buffer): string {
  const digits: number[] = [0]; // Initialize an array of digits with a single 0

  for (let i = 0; i < bytes.length; i++) {
    // Multiply each digit in the array by 256 (left-shift by 8 bits) and add the byte's value to the first digit
    for (let j = 0; j < digits.length; j++) {
      digits[j] <<= 8;
    }
    digits[0] += bytes[i];

    // Perform a base conversion from base 256 to base 58
    let carry = 0;
    for (let j = 0; j < digits.length; ++j) {
      digits[j] += carry;
      carry = (digits[j] / 58) | 0;
      digits[j] %= 58;
    }

    while (carry) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }

  // Remove leading zeros from the digits array and convert the remaining digits back to characters in the ALPHABET string
  let result = "";
  while (digits[digits.length - 1] === 0) {
    digits.pop();
  }

  for (let i = digits.length - 1; i >= 0; i--) {
    result += ALPHABET[digits[i]];
  }

  return result;
}

/**
 * Encodes a buffer into a Base64URL string.
 * @param input - The buffer to be encoded.
 * @returns The Base64URL-encoded string.
 */
export function encodeBase64URL(input: Buffer): string {
  // Convert the buffer into a string of characters using the spread operator
  const base64 = btoa(String.fromCharCode(...input));

  // Replace characters in the Base64 string to make it URL-safe
  return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

