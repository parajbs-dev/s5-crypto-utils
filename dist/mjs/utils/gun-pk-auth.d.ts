/**
 * Generates an ECDSA key pair based on curve P-256 and exports it as a JWK (JSON Web Key).
 * @param seed The entropy to generate the key pair.
 * @returns The JWK representation of the generated key pair.
 */
export declare const genDeterministicKeyPair: (seed: string) => {
    kty: string;
    crv: string;
    x: string;
    y: string;
    d: string;
};
/**
 * Converts a JWK to SEA key pair format.
 * Notice that in SEA, it generates different key pairs for signing and decrypting, but here we use the same key pair.
 * In the future, it's possible to derive another key pair from the seed.
 * @param seed The entropy to generate the key pair.
 * @returns The SEA key pair in the format { pub, priv, epriv, epub }.
 */
export declare const genDeterministicSEAPair: (seed: string) => {
    pub: string;
    priv: string;
    epriv: string;
    epub: string;
};
/**
 * Authenticates a user with Gun using a deterministic key pair.
 * @param gunInstance An instance of Gun.
 * @param seed At least 192 bits seed, possibly an Ethereum private key as a string "0x...".
 * @returns A Promise that resolves with user().is on success or rejects with an error.
 */
export declare const gunAuth: (gunInstance: any, seed: string) => Promise<any>;
//# sourceMappingURL=gun-pk-auth.d.ts.map