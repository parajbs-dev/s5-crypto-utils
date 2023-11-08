/**
 * Represents options for an S5 avatar.
 * @param size - The size of the avatar.
 * @param round - Whether the avatar should have rounded corners.
 * @param dark - Whether the avatar should have a dark theme.
 * @param reflect - Whether the avatar should have a reflective effect.
 * @param draw - The drawing style for the avatar.
 */
export type S5AvatarOptions = {
    size?: number;
    round?: boolean;
    dark?: boolean;
    reflect?: boolean;
    draw?: string;
};
/**
 * Generate an avatar key in SEA format based on a public key.
 * @param publicKey The public key used for generating the avatar key.
 * @returns A Promise that resolves to the generated avatar key in SEA format.
 */
export declare const avatarGenKey: (publicKey: string) => Promise<string>;
/**
 * Generate an S5 avatar based on a public key and rounding option.
 * @param publicKey - The public key as a string.
 * @param avatarOptions - An object specifying options for the avatar.
 * @returns A promise that resolves to an object containing the avatar and its image source.
 */
export declare function generateS5Avatar(publicKey: string, avatarOptions: S5AvatarOptions): Promise<{
    avatar: string;
    imgSrc: string;
}>;
//# sourceMappingURL=avatar.d.ts.map