import { createAvatar } from "@dicebear/core";
import { bottts } from "@dicebear/collection";

import { AvatarGenerator } from "../main/config/types";

/**
 * An async function that generates a user avatar.
 *
 * @param {String} seed - the seed (the users pubkey)
 * @param {String} config - the `next-auth-lightning-provider` config object
 *
 * @returns {Object}
 * @returns {String} data - a base64 encoded png/jpg OR svg XML markup
 * @returns {String} type - image type: "svg" | "png" | "jpg"
 */
export const generateAvatar: AvatarGenerator = async (seed, config) => {
  return {
    data: createAvatar(bottts, { seed }).toString(),
    type: "svg",
  };
};
