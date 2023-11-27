/* istanbul ignore file */

import CID from "./utils/cid";
import Multibase from "./utils/multibase";

// Main exports.

// bytes exports.
export {
  equalBytes,
  concatBytes,
  hexToBytes,
  bytesToHex,
  utf8ToBytes,
} from "./utils/bytes";

// cid export.
export { CID };

// cid exports.
export { encodeCid } from "./utils/cid";

// constants exports.
export {
  CID_TYPES,
  REGISTRY_TYPES,
  CID_HASH_TYPES,
} from "./utils/constants";

// crypto exports.
export {
  KeyPairEd25519,
  CryptoImplementation,
  _derivePathKeyForPath,
  deriveKeyForPathSegments,
} from "./utils/crypto";

// derive_hash exports.
export {
  deriveHashBlake3,
  deriveHashBlake3Int,
} from "./utils/derive_hash";

// endian exports.
export {
  decodeEndian,
  encodeEndian,
  decodeEndianN,
  encodeEndianN,
} from "./utils/endian";

// multibase exports.
export { Multibase };

// multihash exports.
export { Multihash } from "./utils/multihash";

// mutable exports.
export {
  encryptionKeyLength,
  encryptionNonceLength,
  encryptionOverheadLength,
  encryptMutableBytes,
  decryptMutableBytes,
} from "./utils/mutable";

// padding exports.
export {
  padFileSizeDefault,
  checkPaddedBlock,
} from "./utils/padding";

// tools exports.
export {
  encodeBase58BTC,
  encodeBase64URL,
} from "./utils/tools";
