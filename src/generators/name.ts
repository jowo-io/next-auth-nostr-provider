import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

import { NameGenerator } from "../main/config/types.js";

export const generateName: NameGenerator = async (seed, config) => {
  return {
    name: uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      separator: "-",
      seed,
    }),
  };
};
