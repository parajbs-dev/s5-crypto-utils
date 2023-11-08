/* istanbul ignore file */

import CID from "./cid";
import Multibase from "./multibase";

// Main exports.

// avatar exports.
export {
  avatarGenKey,
  generateS5Avatar,
} from "./avatar";

// avatar type exports.
export type {
  S5AvatarOptions
} from "./avatar";

// bytes exports.
export {
  equalBytes,
  concatBytes,
  hexToBytes,
  bytesToHex,
  utf8ToBytes,
} from "./bytes";

// cid export.
export { CID };

// cid exports.
export { encodeCid } from "./cid";

// constants exports.
export {
  CID_TYPES,
  REGISTRY_TYPES,
  CID_HASH_TYPES,
} from "./constants";

// crypto exports.
export {
  KeyPairEd25519,
  CryptoImplementation,
  genKeyPairAndSeed,
  genKeyPairFromSeed,
  HASH_LENGTH,
  hashAll,
  deriveChildSeed,
  deriveEd25519,
  getDataKey,
  _derivePathKeyForPath,
  deriveKeyForPathSegments,
} from "./crypto";

// crypto type exports.
export type {
  KeyPairAndSeed,
  KeyPair,
} from "./crypto";

// derive_hash exports.
export {
  deriveHashBlake3,
  deriveHashBlake3Int,
} from "./derive_hash";

// endian exports.
export {
  decodeEndian,
  encodeEndian,
  decodeEndianN,
  encodeEndianN,
} from "./endian";

// gun-pk-auth exports.
export {
  genDeterministicKeyPair,
  genDeterministicSEAPair,
  gunAuth,
} from "./gun-pk-auth";

// multibase exports.
export { Multibase };

// multihash exports.
export { Multihash } from "./multihash";

// mutable exports.
export {
  encryptionKeyLength,
  encryptionNonceLength,
  encryptionOverheadLength,
  encryptMutableBytes,
  decryptMutableBytes,
} from "./mutable";

// padding exports.
export {
  padFileSizeDefault,
  checkPaddedBlock,
} from "./padding";

// seed exports.
export {
  SEED_LENGTH,
  SEED_WORDS_LENGTH,
  CHECKSUM_WORDS_LENGTH,
  PHRASE_LENGTH,
  generateSeedFromPhrase,
  generatePhrase,
  sanitizePhrase,
  validatePhrase,
  generateChecksumWordsFromSeedWords,
  hashToChecksumWords,
  seedWordsToSeed,
} from "./seed";

// wordlist exports.
export {
  uniquePrefixLen,
  wordlist,
} from "./wordlist";
