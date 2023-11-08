export declare const SEED_LENGTH = 16;
export declare const SEED_WORDS_LENGTH = 13;
export declare const CHECKSUM_WORDS_LENGTH = 2;
export declare const PHRASE_LENGTH: number;
/**
 * Generate a seed from a mnemonic phrase.
 * @param {string} phrase - The mnemonic phrase.
 * @returns {Promise<Uint8Array>} - The generated seed as a Uint8Array.
 */
export declare function generateSeedFromPhrase(phrase: string): Promise<Uint8Array>;
/**
 * Generates a random passphrase.
 * @returns A promise that resolves to the generated passphrase.
 */
export declare function generatePhrase(): Promise<string>;
/**
 * Sanitize the input phrase by trimming and converting to lowercase.
 * @param phrase - The input passphrase.
 * @returns The sanitized phrase.
 */
export declare function sanitizePhrase(phrase: string): string;
/**
 * Validate and convert a passphrase into a Uint8Array seed.
 * @param phrase - The input passphrase.
 * @throws Error if the phrase is invalid.
 * @returns The Uint8Array seed.
 */
export declare function validatePhrase(phrase: string): Promise<Uint8Array>;
/**
 * Generate checksum words from seed words.
 * @param seedWords - The seed words as Uint16Array.
 * @throws Error if the input seed is not of the expected length.
 * @returns The checksum words as Uint16Array.
 */
export declare function generateChecksumWordsFromSeedWords(seedWords: Uint16Array): Uint16Array;
/**
 * Convert a hash to checksum words.
 * @param h - The input hash as Uint8Array.
 * @returns The checksum words as Uint16Array.
 */
export declare function hashToChecksumWords(h: Uint8Array): Uint16Array;
/**
 * Convert seed words to a seed as Uint8Array.
 * @param seedWords - The seed words as Uint16Array.
 * @throws Error if the input seed words are not of the expected length.
 * @returns The seed as Uint8Array.
 */
export declare function seedWordsToSeed(seedWords: Uint16Array): Uint8Array;
//# sourceMappingURL=seed.d.ts.map