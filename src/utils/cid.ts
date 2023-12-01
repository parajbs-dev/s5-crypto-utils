import { Buffer } from "buffer";
import Multibase from "./multibase";
import { Multihash } from "./multihash";
import { mkeyEd25519, cidTypeResolver, cidTypeRaw, mhashBlake3Default, CID_TYPES, REGISTRY_TYPES } from "./constants";
import { decodeEndian, encodeEndian } from "./endian";
import { concatBytes, equalBytes, hexToBytes } from "./bytes";
import { encodeBase58BTC } from "./basetools";

/**
 * Class representing a CID (Content Identifier).
 */
export default class CID extends Multibase {
  type: number;
  hash: Multihash;
  size?: number;

  /**
   * Create a new CID instance.
   * @param {number} type - The type of the CID.
   * @param {Multihash} hash - The Multihash of the CID.
   * @param {number | undefined} size - The size of the CID (optional).
   */
  constructor(type: number, hash: Multihash, size?: number) {
    super();
    this.type = type;
    this.hash = hash;
    this.size = size;
  }

  /**
   * Decode a CID from its string representation.
   * @param {string} cid - The CID string to decode.
   * @returns {CID} A new CID instance.
   */
  static decode(cid: string): CID {
    const decodedBytes = Multibase.decodeString(cid);
    return CID._init(decodedBytes);
  }

  /**
   * Create a CID from registry bytes.
   * @param {Uint8Array} bytes - The registry bytes.
   * @returns {CID} A new CID instance.
   * @throws {Error} If the registry type is invalid.
   */
  static fromRegistry(bytes: Uint8Array): CID {
    if (!Object.values(REGISTRY_TYPES).includes(bytes[0])) {
      throw new Error(`invalid registry type ${bytes[0]}`);
    }

    bytes = bytes.slice(1);

    const cid = CID._init(bytes);

    if (cid.hash.functionType !== mkeyEd25519) {
      return cid.copyWith({ type: CID_TYPES.RAW });
    }

    return cid;
  }

  /**
   * Create a CID from raw bytes.
   * @param {Uint8Array} bytes - The raw bytes.
   * @returns {CID} A new CID instance.
   */
  static fromBytes(bytes: Uint8Array): CID {
    return CID._init(bytes);
  }

  /**
   * Create a CID from a registry public key.
   * @param {string | Uint8Array} pubkey - The public key.
   * @returns {CID} A new CID instance.
   */
  static fromRegistryPublicKey(pubkey: string | Uint8Array): CID {
    return CID.fromHash(pubkey, 0, CID_TYPES.RESOLVER);
  }

  /**
   * Create a CID from a hash.
   * @param {string | Uint8Array} bytes - The hash bytes.
   * @param {number} size - The size of the CID.
   * @param {number} type - The type of the CID.
   * @returns {CID} A new CID instance.
   * @throws {Error} If the CID type is invalid.
   */
  static fromHash(
    bytes: string | Uint8Array,
    size: number,
    type = CID_TYPES.RAW,
  ): CID {
    if (typeof bytes === "string") {
      bytes = hexToBytes(bytes);
    }

    if (!Object.values(CID_TYPES).includes(type)) {
      throw new Error(`invalid cid type ${type}`);
    }

    return new CID(type, new Multihash(bytes), size);
  }

  /**
   * Verify if a given value is a valid CID.
   * @param {string | Uint8Array} bytes - The value to verify.
   * @returns {boolean} True if the value is a valid CID, false otherwise.
   */
  static verify(bytes: string | Uint8Array): boolean {
    if (typeof bytes === "string") {
      bytes = Multibase.decodeString(bytes);
    }

    try {
      CID._init(bytes);
    } catch {
      return false;
    }

    return true;
  }

  /**
   * Initialize a CID from bytes.
   * @param {Uint8Array} bytes - The input bytes.
   * @throws {Error} Throws an error if the input is invalid.
   * @returns {CID} The initialized CID.
   */
  private static _init(bytes: Uint8Array): CID {
    const type = bytes[0];
    if (type === CID_TYPES.BRIDGE) {
      return new CID(type, new Multihash(bytes));
    }

    const hash = new Multihash(bytes.subarray(1, 34));
    let size: number | undefined = undefined;
    const sizeBytes = bytes.subarray(34);
    if (sizeBytes.length > 0) {
      size = decodeEndian(sizeBytes);
    }

    if (!Object.values(CID_TYPES).includes(type)) {
      throw new Error(`invalid cid type ${type}`);
    }

    return new CID(type, hash, size);
  }

  /**
   * Create a copy of this CID with optional type and size.
   * @param {object} options - Options for creating the copy.
   * @param {number} options.type - The type of the copy.
   * @param {number} options.size - The size of the copy.
   * @throws {Error} Throws an error if the input is invalid.
   * @returns {CID} The copied CID.
   */
  copyWith({ size, type }: { type?: number; size?: number }): CID {
    type = type || this.type;

    if (!Object.values(CID_TYPES).includes(type)) {
      throw new Error(`invalid cid type ${type}`);
    }

    return new CID(type, this.hash, size || this.size);
  }

  /**
   * Convert CID to a Uint8Array of bytes.
   * @returns {Uint8Array} The bytes representation of the CID.
   */
  toBytes(): Uint8Array {
    if (this.type === CID_TYPES.BRIDGE) {
      return this.hash.fullBytes;
    } else if (this.type === CID_TYPES.RAW) {
      let sizeBytes = encodeEndian(this.size as number, 8);

      while (sizeBytes.length > 0 && sizeBytes[sizeBytes.length - 1] === 0) {
        sizeBytes = sizeBytes.slice(0, -1);
      }
      if (sizeBytes.length === 0) {
        sizeBytes = new Uint8Array(1);
      }

      return concatBytes(
        this._getPrefixBytes(),
        this.hash.fullBytes,
        sizeBytes,
      );
    }

    return concatBytes(this._getPrefixBytes(), this.hash.fullBytes);
  }

  /**
   * Get the prefix bytes for the CID.
   * @returns {Uint8Array} The prefix bytes.
   * @private
   */
  private _getPrefixBytes(): Uint8Array {
    return Uint8Array.from([this.type]);
  }

  /**
   * Convert CID to a registry entry as Uint8Array.
   * @returns {Uint8Array} The registry entry as bytes.
   */
  toRegistryEntry(): Uint8Array {
    return concatBytes(Uint8Array.from([REGISTRY_TYPES.CID]), this.toBytes());
  }

  /**
   * Convert CID to a registry CID as Uint8Array.
   * @returns {Uint8Array} The registry CID as bytes.
   */
  toRegistryCID(): Uint8Array {
    return this.copyWith({ type: CID_TYPES.RESOLVER }).toBytes();
  }

  /**
   * Convert CID to a string representation.
   * @returns {string} The string representation of the CID.
   */
  toString(): string {
    return this.type === CID_TYPES.BRIDGE
      ? Buffer.from(this.hash.fullBytes).toString("utf8")
      : this.toBase58();
  }

  /**
   * Check if two CIDs are equal.
   * @param {CID} other - The other CID to compare with.
   * @returns {boolean} True if the CIDs are equal, false otherwise.
   */
  equals(other: CID): boolean {
    return equalBytes(this.toBytes(), other.toBytes());
  }

  /**
   * Compute the hash code for the CID.
   * @returns {number} The hash code for the CID.
   */
  hashCode(): number {
    const fullBytes = this.toBytes();
    return (
      fullBytes[0] +
      fullBytes[1] * 256 +
      fullBytes[2] * 256 * 256 +
      fullBytes[3] * 256 * 256 * 256
    );
  }
}

/**
 * Encode a Content Identifier (CID).
 * @param {Uint8Array} hash - The hash to encode.
 * @param {number} size - The size of the content.
 * @param {number} [type] - The CID type (optional, defaults to cidTypeRaw).
 * @param {number} [hashType] - The hash type (optional, defaults to mhashBlake3Default).
 * @returns {string} The encoded CID.
 * @throws {Error} If the hash is not a Uint8Array or if size is missing.
 */
export function encodeCid(
  hash: Uint8Array,
  size: number,
  type = cidTypeRaw,
  hashType = mhashBlake3Default,
) {
  if (!(hash instanceof Uint8Array)) {
    throw new Error();
  }

  if (size === undefined || size === null) {
    throw new Error("size required");
  }

  const sizeBG = BigInt(size);

  const sizeBytes = new Uint8Array(8);
  const sizeView = new DataView(sizeBytes.buffer);
  sizeView.setBigInt64(0, sizeBG, true);
  
  let prefixedHash

  if (type === cidTypeResolver) {
  const sizeBytes0 = new Uint8Array(0);
    prefixedHash = Uint8Array.from([type, hashType, ...hash, ...sizeBytes0]);
  } else {
    prefixedHash = Uint8Array.from([type, hashType, ...hash, ...sizeBytes]);
  }

  return encodeBase58BTC(prefixedHash);
}
