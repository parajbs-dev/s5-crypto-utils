export const cidTypeResolver = 0x25;
export const cidTypeRaw = 0x26;
export const mhashBlake3Default = 0x1f;
export const mkeyEd25519 = 0xed;
export const CID_TYPES = {
    RAW: 0x26,
    METADATA_MEDIA: 0xc5,
    METADATA_WEBAPP: 0x59,
    RESOLVER: 0x25,
    USER_IDENTITY: 0x77,
    BRIDGE: 0x3a,
    // format for dynamic encrypted CID
    // type algo key resolver_type mkey_ed255 pubkey
    // in entry: encrypt(RAW CID or MEDIA or SOMETHING)
    /// Used for immutable encrypted files and metadata formats, key can never be re-used
    ///
    /// Used for file versions in Vup
    ENCRYPTED_STATIC: 0xae,
    ENCRYPTED_DYNAMIC: 0xad,
};
Object.freeze(CID_TYPES);
export const REGISTRY_TYPES = {
    CID: 0x5a,
    /// Used for encrypted files with update support
    ///
    /// can point to resolver CID, Stream CID, Directory Metadata or Media Metadata object
    ENCRYPTED_CID: 0x5e,
};
Object.freeze(REGISTRY_TYPES);
export const CID_HASH_TYPES = {
    BLAKE3: 0x1f,
    ED25519: 0xed,
};
Object.freeze(CID_HASH_TYPES);
