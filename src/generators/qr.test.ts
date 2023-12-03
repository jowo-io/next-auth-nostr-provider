import { describe, expect, test } from "@jest/globals";

import QRCode from "qrcode";

import generateQr from "./qr";
import { Config } from "../main/config/types";

const data = "abc123";
const config = {
  theme: { qrForeground: "#fff", qrBackground: "#000", qrMargin: 1 },
} as Config;

jest.mock("qrcode", () => ({ toString: jest.fn(() => "qr-data") }));

describe("generateQr", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("generates qr correctly", async () => {
    const output = await generateQr(data, config);
    const expected = { data: "qr-data", type: "svg" };
    expect(output).toEqual(expected);
  });

  test("invoke qrcode library method with correct params", async () => {
    await generateQr(data, config);
    const expected = [
      "abc123",
      { color: { dark: "#fff", light: "#000" }, margin: 1, type: "svg" },
    ];
    expect(jest.mocked(QRCode).toString).toHaveBeenCalledWith(...expected);
  });
});
