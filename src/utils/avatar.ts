import { generateFromString } from 'generate-avatar';
import {  genDeterministicSEAPair } from './gun-pk-auth';
import { gunAvatar } from 'gun-avatar'

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
export const avatarGenKey = async (publicKey: string): Promise<string> => {
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
export async function generateS5Avatar(
  publicKey: string,
  avatarOptions: S5AvatarOptions,
): Promise<{ avatar: string, imgSrc: string }> {
 
  const avatarS5 = generateFromString(publicKey);
  const avatarKey = await avatarGenKey(publicKey);

  // Ensure that the `draw` property is a valid string or undefined
  let selectedDraw: 'circles' | 'squares' | undefined;

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

  return { avatar: avatarS5, imgSrc: S5Avatar};
}

