import { describe, expect, test } from "@jest/globals";
import { formatRouter } from "./router";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";

describe("formatRouter", () => {
  test("returns app router", () => {
    const req = {
      hello: "world",
      nextUrl: "http://a.b/foo/bar",
    } as unknown as NextApiRequest;
    const res = {
      foo: "bar",
      params: {},
    } as unknown as NextApiResponse;
    const output = formatRouter(req, res);
    const expected = {
      path: "/foo/bar",
      req,
      res,
      routerType: "APP",
    };
    expect(output).toEqual(expected);
  });

  test("returns pages router", () => {
    const req = {
      hello: "world",
      url: "/foo/bar",
    } as unknown as NextRequest;
    const res = {
      foo: "bar",
    } as unknown as NextResponse;
    const output = formatRouter(req, res);
    const expected = {
      path: "/foo/bar",
      req,
      res,
      routerType: "PAGES",
    };
    expect(output).toEqual(expected);
  });

  test("returns pages router with empty path", () => {
    const req = {
      hello: "world",
    } as unknown as NextRequest;
    const res = {
      foo: "bar",
    } as unknown as NextResponse;
    const output = formatRouter(req, res);
    const expected = {
      path: "",
      req,
      res,
      routerType: "PAGES",
    };
    expect(output).toEqual(expected);
  });
});
