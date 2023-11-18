import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

import { Config } from "../main/config/types.js";

export const generateName = async (seed: string, config: Config) => {
  return {
    name: uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      separator: "-",
      seed,
    }),
  };
};
