import { describe, expect, test } from "@jest/globals";
import { cleanParams, paramsToObject, pickFirstQueryParam } from "./params";

describe("pickFirstQueryParam", () => {
  test("returns string", () => {
    const output = pickFirstQueryParam("foo");
    const expected = "foo";
    expect(output).toEqual(expected);
  });

  test("returns first array item", () => {
    const output = pickFirstQueryParam(["foo", "bar"]);
    const expected = "foo";
    expect(output).toEqual(expected);
  });

  test("returns undefined", () => {
    const output = pickFirstQueryParam(undefined);
    const expected = undefined;
    expect(output).toEqual(expected);
  });
});

describe("paramsToObject", () => {
  test("returns empty object if undefined", () => {
    const output = paramsToObject();
    const expected = {};
    expect(output).toEqual(expected);
  });

  test("returns flattened params as object", () => {
    const params = new URLSearchParams();
    params.append("foo", "bar");
    params.append("foo", "foo");
    params.append("hello", "world");
    const output = paramsToObject(params);
    const expected = {
      foo: "foo",
      hello: "world",
    };
    expect(output).toEqual(expected);
  });
});

describe("cleanParams", () => {
  test("returns empty object if undefined", () => {
    const output = cleanParams();
    const expected = {};
    expect(output).toEqual(expected);
  });

  test("returns flattened params as object", () => {
    const output = cleanParams({
      foo: ["foo", "bar"],
      hello: "world",
    });
    const expected = {
      foo: "foo",
      hello: "world",
    };
    expect(output).toEqual(expected);
  });
});
