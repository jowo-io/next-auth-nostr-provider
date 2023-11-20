import { createAvatar } from "@dicebear/core";
import { bottts } from "@dicebear/collection";

import { AvatarGenerator } from "../main/config/types.js";

export const generateAvatar: AvatarGenerator = async (seed, config) => {
  return {
    data: createAvatar(bottts, { seed }).toString(),
    type: "svg",
  };
};
