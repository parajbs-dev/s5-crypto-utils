import { generateFromString } from 'generate-avatar';
import { genDeterministicSEAPair } from './gun-pk-auth';
import { gunAvatar } from 'gun-avatar';
/**
 * Generate an avatar key in SEA format based on a public key.
 * @param publicKey The public key used for generating the avatar key.
 * @returns A Promise that resolves to the generated avatar key in SEA format.
 */
export const avatarGenKey = async (publicKey) => {
    // Generate the same key in SEA format
    const seaPair = genDeterministicSEAPair(publicKey);
    return seaPair.pub;
};
/**
 * Generate an S5 avatar based on a public key and rounding option.
 * @param publicKey - The public key as a string.
 * @param avatarOptions - An object specifying options for the avatar.
 * @returns A promise that resolves to an object containing the avatar and its image source.
 */
export async function generateS5Avatar(publicKey, avatarOptions) {
    const avatarS5 = generateFromString(publicKey);
    const avatarKey = await avatarGenKey(publicKey);
    // Ensure that the `draw` property is a valid string or undefined
    let selectedDraw;
    if (avatarOptions.draw === 'circles' || avatarOptions.draw === 'squares') {
        selectedDraw = avatarOptions.draw;
    }
    const S5Avatar = await gunAvatar({
        pub: avatarKey,
        size: avatarOptions.size,
        dark: avatarOptions.dark,
        reflect: avatarOptions.reflect,
        draw: selectedDraw, // Use the selectedDraw value here
    });
    const existingImage = document.getElementById("avatar");
    const newS5AvatarImage = document.createElement("img");
    newS5AvatarImage.id = 'S5Avatar';
    newS5AvatarImage.src = S5Avatar;
    if (avatarOptions.round === true) {
        newS5AvatarImage.style.borderRadius = "100%";
    }
    if (existingImage) {
        newS5AvatarImage.addEventListener('load', () => {
            existingImage.parentNode?.insertBefore(newS5AvatarImage, existingImage);
            existingImage.remove();
        });
    }
    await new Promise(r => setTimeout(r, 10));
    return { avatar: avatarS5, imgSrc: S5Avatar };
}
