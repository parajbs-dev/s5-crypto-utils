/* eslint-disable @typescript-eslint/no-explicit-any */
import { Buffer } from 'buffer';
import elliptic from "elliptic";
const tob64u = (str) => {
    return str.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
};
/**
 * Generates an ECDSA key pair based on curve P-256 and exports it as a JWK (JSON Web Key).
 * @param seed The entropy to generate the key pair.
 * @returns The JWK representation of the generated key pair.
 */
export const genDeterministicKeyPair = (seed) => {
    const ec = new elliptic.ec("p256");
    // Generate keys
    const keyPair = ec.genKeyPair({ entropy: seed });
    const priv = keyPair.getPrivate();
    const pub = keyPair.getPublic();
    const x = pub.getX();
    const y = pub.getY();
    const jwk = {
        kty: "EC",
        crv: "P-256",
        x: tob64u(Buffer.from(x.toArrayLike(Buffer)).toString("base64")),
        y: tob64u(Buffer.from(y.toArrayLike(Buffer)).toString("base64")),
        d: tob64u(Buffer.from(priv.toArrayLike(Buffer)).toString("base64")),
    };
    return jwk;
};
/**
 * Converts a JWK to SEA key pair format.
 * Notice that in SEA, it generates different key pairs for signing and decrypting, but here we use the same key pair.
 * In the future, it's possible to derive another key pair from the seed.
 * @param seed The entropy to generate the key pair.
 * @returns The SEA key pair in the format { pub, priv, epriv, epub }.
 */
export const genDeterministicSEAPair = (seed) => {
    const jwk = genDeterministicKeyPair(seed);
    const seaPair = {
        pub: jwk.x + "." + jwk.y,
        priv: jwk.d,
        epriv: jwk.d,
        epub: jwk.x + "." + jwk.y,
    };
    return seaPair;
};
/**
 * Authenticates a user with Gun using a deterministic key pair.
 * @param gunInstance An instance of Gun.
 * @param seed At least 192 bits seed, possibly an Ethereum private key as a string "0x...".
 * @returns A Promise that resolves with user().is on success or rejects with an error.
 */
export const gunAuth = async (gunInstance, seed) => {
    const user = gunInstance.user();
    const login = new Promise((res, rej) => {
        user.auth(genDeterministicSEAPair(seed), (authres) => {
            if (authres.err)
                rej(authres.err);
            else
                res(authres);
        });
    });
    await login;
    user.put({ epub: user.is.epub, pub: user.is.pub });
    return user.is;
};
