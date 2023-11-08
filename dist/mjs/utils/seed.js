import * as sodium from 'libsodium-wrappers';
import { blake3 } from "@noble/hashes/blake3";
import { wordlist } from './wordlist';
export const SEED_LENGTH = 16;
export const SEED_WORDS_LENGTH = 13;
export const CHECKSUM_WORDS_LENGTH = 2;
export const PHRASE_LENGTH = SEED_WORDS_LENGTH + CHECKSUM_WORDS_LENGTH;
/**
 * Generate a seed from a mnemonic phrase.
 * @param {string} phrase - The mnemonic phrase.
 * @returns {Promise<Uint8Array>} - The generated seed as a Uint8Array.
 */
export async function generateSeedFromPhrase(phrase) {
    const sanitizedPhrase = sanitizePhrase(phrase);
    const validatedPhrase = await validatePhrase(sanitizedPhrase);
    const hasher = await blake3.create({ dkLen: 32 });
    hasher.update(validatedPhrase);
    const b3Seed = hasher.digest();
    return b3Seed;
}
/**
 * Generates a random passphrase.
 * @returns A promise that resolves to the generated passphrase.
 */
export async function generatePhrase() {
    await sodium.ready;
    const seedWords = new Uint16Array(SEED_WORDS_LENGTH);
    // Populate the seed words from the random values.
    for (let i = 0; i < SEED_WORDS_LENGTH; i++) {
        seedWords[i] = sodium.randombytes_uniform(wordlist.length);
        let numBits = 10;
        // For the 1st word, only the first 256 words are considered valid.
        if (i === 0) {
            numBits = 8;
        }
        seedWords[i] = seedWords[i] % (1 << numBits);
    }
    // Generate checksum from hash of the seed.
    const checksumWords = generateChecksumWordsFromSeedWords(seedWords);
    const phraseWords = new Array(PHRASE_LENGTH);
    for (let i = 0; i < SEED_WORDS_LENGTH; i++) {
        phraseWords[i] = wordlist[seedWords[i]];
    }
    for (let i = 0; i < CHECKSUM_WORDS_LENGTH; i++) {
        phraseWords[i + SEED_WORDS_LENGTH] = wordlist[checksumWords[i]];
    }
    return phraseWords.join(" ");
}
/**
 * Sanitize the input phrase by trimming and converting to lowercase.
 * @param phrase - The input passphrase.
 * @returns The sanitized phrase.
 */
export function sanitizePhrase(phrase) {
    return phrase.trim().toLowerCase();
}
/**
 * Validate and convert a passphrase into a Uint8Array seed.
 * @param phrase - The input passphrase.
 * @throws Error if the phrase is invalid.
 * @returns The Uint8Array seed.
 */
export async function validatePhrase(phrase) {
    await sodium.ready;
    phrase = sanitizePhrase(phrase);
    const phraseWords = phrase.split(' ');
    if (phraseWords.length !== PHRASE_LENGTH) {
        throw new Error(`Phrase must be ${PHRASE_LENGTH} words long`);
    }
    // Build the seed from words.
    const seedWords = new Uint16Array(SEED_WORDS_LENGTH);
    let i = 0;
    for (const word of phraseWords) {
        // Check word length.
        if (word.length < 3) {
            throw new Error(`Word ${i + 1} is not at least 3 letters long`);
        }
        // Check word prefix.
        const prefix = word.substring(0, 3);
        let bound = wordlist.length;
        if (i === 0) {
            bound = 256;
        }
        let found = -1;
        for (let j = 0; j < bound; j++) {
            const curPrefix = wordlist[j].substring(0, 3);
            if (curPrefix === prefix) {
                found = j;
                break;
            }
        }
        if (found < 0) {
            if (i === 0) {
                throw new Error(`Prefix for word ${i + 1} must be found in the first 256 words of the wordlist`);
            }
            else {
                throw new Error(`Unrecognized prefix "${prefix}" at word ${i + 1}, not found in wordlist`);
            }
        }
        seedWords[i] = found;
        i++;
        if (i >= SEED_WORDS_LENGTH)
            break;
    }
    // Validate checksum.
    const checksumWords = generateChecksumWordsFromSeedWords(seedWords);
    for (let i = 0; i < CHECKSUM_WORDS_LENGTH; i++) {
        const prefix = wordlist[checksumWords[i]].substring(0, 3);
        if (phraseWords[i + SEED_WORDS_LENGTH].substring(0, 3) !== prefix) {
            throw new Error(`Word "${phraseWords[i + SEED_WORDS_LENGTH + 1]}" is not a valid checksum for the seed`);
        }
    }
    return seedWordsToSeed(seedWords);
}
/**
 * Generate checksum words from seed words.
 * @param seedWords - The seed words as Uint16Array.
 * @throws Error if the input seed is not of the expected length.
 * @returns The checksum words as Uint16Array.
 */
export function generateChecksumWordsFromSeedWords(seedWords) {
    if (seedWords.length !== SEED_WORDS_LENGTH) {
        throw new Error(`Input seed was not of length ${SEED_WORDS_LENGTH}`);
    }
    const seed = seedWordsToSeed(seedWords);
    const h = blake3(seed, { dkLen: SEED_LENGTH });
    const checksumWords = hashToChecksumWords(h);
    return checksumWords;
}
/**
 * Convert a hash to checksum words.
 * @param h - The input hash as Uint8Array.
 * @returns The checksum words as Uint16Array.
 */
export function hashToChecksumWords(h) {
    let word1 = (h[0] << 8);
    word1 += h[1];
    word1 >>= 6;
    let word2 = (h[1] << 10);
    word2 &= 0xffff;
    word2 += (h[2] << 2);
    word2 >>= 6;
    return new Uint16Array([word1, word2]);
}
/**
 * Convert seed words to a seed as Uint8Array.
 * @param seedWords - The seed words as Uint16Array.
 * @throws Error if the input seed words are not of the expected length.
 * @returns The seed as Uint8Array.
 */
export function seedWordsToSeed(seedWords) {
    if (seedWords.length !== SEED_WORDS_LENGTH) {
        throw new Error(`Input seed was not of length ${SEED_WORDS_LENGTH}`);
    }
    // We are getting 16 bytes of entropy.
    const bytes = new Uint8Array(SEED_LENGTH);
    let curByte = 0;
    let curBit = 0;
    for (let i = 0; i < SEED_WORDS_LENGTH; i++) {
        const word = seedWords[i];
        let wordBits = 10;
        if (i === 0) {
            wordBits = 8;
        }
        // Iterate over the bits of the 10- or 8-bit word.
        for (let j = 0; j < wordBits; j++) {
            const bitSet = (word & (1 << (wordBits - j - 1))) > 0;
            if (bitSet) {
                bytes[curByte] |= (1 << (8 - curBit - 1));
            }
            curBit += 1;
            if (curBit >= 8) {
                curByte += 1;
                curBit = 0;
            }
        }
    }
    return bytes;
}
