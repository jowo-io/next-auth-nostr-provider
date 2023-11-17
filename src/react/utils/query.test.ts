import { describe, expect, test } from "@jest/globals";

import { extractQuery } from "./query";

describe("extractQuery", () => {
  test("that undefined values are returned", () => {
    const query = {};
    const output = extractQuery(query);
    const expected = { redirectUri: undefined, state: undefined };
    expect(output).toEqual(expected);
  });

  test("that strings are returned", () => {
    const query = { redirect_uri: "uri", state: "s" };
    const output = extractQuery(query);
    const expected = { redirectUri: "uri", state: "s" };
    expect(output).toEqual(expected);
  });

  test("that the first item in the array is returned", () => {
    const query = { redirect_uri: ["0", "1", "2"], state: ["a", "b", "c"] };
    const output = extractQuery(query);
    const expected = { redirectUri: "0", state: "a" };
    expect(output).toEqual(expected);
  });
});
