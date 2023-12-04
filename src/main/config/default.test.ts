import { describe, expect, test } from "@jest/globals";
import merge from "lodash.merge";

import {
  colorSchemeDark,
  colorSchemeLight,
  defaultConfig,
  formatConfig,
} from "./default";
import { hardConfig } from "./hard";
import { UserConfig } from "./types";

const generateQr = jest.fn(async () => ({ data: "qr-data", type: "svg" }));
const generateAvatar = jest.fn(async () => ({
  data: "avatar-data",
  type: "svg",
}));
const generateName = jest.fn(async () => ({ name: "name" }));
const storage = {
  set: jest.fn(async () => {}),
  get: jest.fn(async () => ({
    k1: "k1",
    state: "state",
    sig: "sig",
    pubkey: "pubkey",
    success: true,
  })),
  update: jest.fn(async () => {}),
  delete: jest.fn(async () => {}),
};

const requiredConfig = {
  siteUrl: "http://a.b",
  secret: "1234567890",
  storage,
  generateQr,
};

describe("formatConfig", () => {
  test("returns all user config options as expected", () => {
    const userConfig = merge({}, requiredConfig, {
      generateAvatar,
      generateName,
      pages: {
        signIn: "/login",
        error: "/error",
      },
      flags: {
        diagnostics: true,
        logs: true,
      },
      title: "Foo bar",
      theme: {
        colorScheme: "dark",
        background: "#f0f",
        backgroundCard: "#f0f",
        text: "#f0f",
        qrBackground: "#f0f",
        qrForeground: "#f0f",
        qrMargin: 5,
        signInButtonBackground: "#f0f",
        signInButtonText: "#f0f",
      },
    }) as UserConfig;
    const output = formatConfig(userConfig);
    const expected = merge(
      {},
      requiredConfig,
      {
        generateAvatar,
        generateName,
        pages: {
          signIn: "/login",
          error: "/error",
        },
        flags: {
          diagnostics: true,
          logs: true,
        },
        title: "Foo bar",
        theme: {
          colorScheme: "dark",
          background: "#f0f",
          backgroundCard: "#f0f",
          text: "#f0f",
          qrBackground: "#f0f",
          qrForeground: "#f0f",
          qrMargin: 5,
          signInButtonBackground: "#f0f",
          signInButtonText: "#f0f",
        },
      },
      hardConfig
    );
    expect(output).toEqual(expected);
  });

  test("returns all the correct default config options", () => {
    const userConfig = merge({}, requiredConfig, {}) as UserConfig;
    const output = formatConfig(userConfig);
    const expected = merge(
      {},
      defaultConfig,
      requiredConfig,
      {
        theme: colorSchemeLight,
        flags: {
          diagnostics: false,
          logs: true,
        },
      },
      hardConfig
    );
    expect(output).toEqual(expected);
  });
});

describe("theme", () => {
  test("returns correct default color scheme", () => {
    const userConfig = merge({}, requiredConfig, {}) as UserConfig;
    const output = formatConfig(userConfig);
    const expected = merge({}, { colorScheme: "light" }, colorSchemeLight);
    expect(output.theme).toEqual(expected);
  });

  test("returns correct theme colors when theme is set to light", () => {
    const userConfig = merge({}, requiredConfig, {
      theme: { colorScheme: "light" },
    }) as UserConfig;
    const output = formatConfig(userConfig);
    const expected = merge({}, { colorScheme: "light" }, colorSchemeLight);
    expect(output.theme).toEqual(expected);
  });

  test("returns correct theme colors when theme is set to dark", () => {
    const userConfig = merge({}, requiredConfig, {
      theme: { colorScheme: "dark" },
    }) as UserConfig;
    const { theme } = formatConfig(userConfig);
    const expected = merge({}, { colorScheme: "dark" }, colorSchemeDark);
    expect(theme).toEqual(expected);
  });
});

describe("flags", () => {
  test("returns correct default flags", () => {
    const userConfig = merge({}, requiredConfig, {}) as UserConfig;
    const { flags } = formatConfig(userConfig);
    const expected = { diagnostics: false, logs: true };
    expect(flags).toEqual(expected);
  });

  test("returns correct flag when true", () => {
    const userConfig = merge({}, requiredConfig, {
      flags: { diagnostics: true, logs: true },
    }) as UserConfig;
    const { flags } = formatConfig(userConfig);
    const expected = { diagnostics: true, logs: true };
    expect(flags).toEqual(expected);
  });

  test("returns correct flag when false", () => {
    const userConfig = merge({}, requiredConfig, {
      flags: { diagnostics: false, logs: false },
    }) as UserConfig;
    const { flags } = formatConfig(userConfig);
    const expected = { diagnostics: false, logs: false };
    expect(flags).toEqual(expected);
  });
});
