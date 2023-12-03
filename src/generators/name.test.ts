import { describe, expect, test } from "@jest/globals";

import generateName from "./name";
import { Config } from "../main/config/types";

const seed = "abc123";
const name = "proposed-maroon-wolverine";
const config = {} as Config;

describe("generateName", () => {
  test("generates name correctly", async () => {
    const output = await generateName(seed, config);
    const expected = { name };
    expect(output).toEqual(expected);
  });
});
