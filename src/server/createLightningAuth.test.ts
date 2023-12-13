import { describe, expect, test } from "@jest/globals";

import createLightningAuth from "./createLightningAuth";

const client_id = "http://a.b";
const state = "state";
const redirect_uri = "redirect_uri";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        k1: "k1",
        lnurl: "lnurl",
        pollInterval: 5000,
        createInterval: 30000,
      }),
  })
) as jest.Mock;

describe("createLightningAuth", () => {
  test("to throw when missing all query params", async () => {
    const query = {};
    expect(async () => await createLightningAuth(query)).rejects.toThrow(
      "Missing query params"
    );
  });

  test("to throw when missing client_id from query", async () => {
    const query = { state, redirect_uri };
    expect(async () => await createLightningAuth(query)).rejects.toThrow(
      "Missing query params"
    );
  });

  test("to throw when missing state from query", async () => {
    const query = { client_id, redirect_uri };
    expect(async () => await createLightningAuth(query)).rejects.toThrow(
      "Missing query params"
    );
  });

  test("to throw when missing redirect_uri from query", async () => {
    const query = { client_id, state };
    expect(async () => await createLightningAuth(query)).rejects.toThrow(
      "Missing query params"
    );
  });

  test("resolve a valid session based on fetch response", async () => {
    const query = { client_id, state, redirect_uri };
    const output = await createLightningAuth(query);
    const expected = {
      data: { k1: "k1", lnurl: "lnurl" },
      intervals: { create: 30000, poll: 5000 },
      query: { redirectUri: "redirect_uri", state: "state" },
    };
    expect(output).toEqual(expected);
  });
});
