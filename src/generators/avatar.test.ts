import { describe, expect, test } from "@jest/globals";

import { createAvatar } from "@dicebear/core";
import { bottts } from "@dicebear/collection";

import generateAvatar from "./avatar";
import { Config } from "../main/config/types";

const seed = "abc123";
const config = {} as Config;

jest.mock("@dicebear/core", () => ({
  createAvatar: jest.fn(() => ({ toString: () => "avatar-data" })),
}));
jest.mock("@dicebear/collection", () => ({ bottts: jest.fn() }));

describe("generateAvatar", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("generates avatar correctly", async () => {
    const output = await generateAvatar(seed, config);
    const expected = { data: "avatar-data", type: "svg" };
    expect(output).toEqual(expected);
  });

  test("invoke createAvatar library method with correct params", async () => {
    await generateAvatar(seed, config);
    const expected = [jest.mocked(bottts), { seed: "abc123" }];
    expect(jest.mocked(createAvatar)).toHaveBeenCalledWith(...expected);
  });
});
