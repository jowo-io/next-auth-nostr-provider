import { createAvatar } from "@dicebear/core";
import { bottts } from "@dicebear/collection";

import { Config } from "../main/config/types.js";

export const generateAvatar = async (seed: string, config: Config) => {
  return {
    image: createAvatar(bottts, { seed }).toString(),
  };
};
