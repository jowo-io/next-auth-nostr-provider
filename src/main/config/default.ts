import merge from "lodash.merge";
import { z } from "zod";

import { Config, UserConfig, OptionalConfig, ThemeStyles } from "./types";
import { hardConfig } from "./hard";

const colorSchemeLight: ThemeStyles = {
  background: "#ececec",
  backgroundCard: "#ffffff",
  text: "#000000",
  qrBackground: "#ffffff",
  qrForeground: "#0d1117",
  qrMargin: 0,
  signInButtonBackground: "#24292f",
  signInButtonText: "#ffffff",
};

const colorSchemeDark: ThemeStyles = {
  background: "#161b22",
  backgroundCard: "#0d1117",
  text: "#ffffff",
  qrBackground: "#ffffff",
  qrForeground: "#0d1117",
  qrMargin: 0.5,
  signInButtonBackground: "#24292f",
  signInButtonText: "#ffffff",
};

const defaultConfig: Partial<OptionalConfig> = {
  pages: {
    signIn: "/api/lnauth/signin", // default lightning auth page
    error: "/api/auth/signin", // default next-auth error page
  },
  title: "Login with Lightning",
  theme: {
    colorScheme: "light",
  },
};

const configValidation = z
  .object({
    // required
    siteUrl: z.string(),
    secret: z.string(),
    storage: z.object({
      set: z.function(),
      get: z.function(),
      update: z.function(),
      delete: z.function(),
    }),
    generateQr: z.function(),

    // optional
    generateAvatar: z.function().nullable().optional(),
    generateName: z.function().nullable().optional(),
    pages: z
      .object({
        signIn: z.string().optional(),
        error: z.string().optional(),
      })
      .nullish(),
    flags: z
      .object({
        diagnostics: z.string().optional(),
        logs: z.string().optional(),
      })
      .nullish(),
    title: z.string().nullable().optional(),
    theme: z
      .object({
        colorScheme: z.string().optional(),
        background: z.string().optional(),
        backgroundCard: z.string().optional(),
        text: z.string().optional(),
        error: z.string().optional(),
        signInButtonBackground: z.string().optional(),
        signInButtonText: z.string().optional(),
        qrBackground: z.string().optional(),
        qrForeground: z.string().optional(),
        qrMargin: z.number().optional(),
      })
      .nullish(),
  })
  .strict();

export function formatConfig(userConfig: UserConfig): Config {
  const theme =
    userConfig.theme?.colorScheme === "dark"
      ? colorSchemeDark
      : colorSchemeLight;

  const flags = {
    diagnostics: process?.env?.NODE_ENV === "development",
    logs: true,
  };

  configValidation.parse(userConfig, {
    errorMap: (issue) => {
      return { message: `Config option ${issue.path} of ${issue.code}` };
    },
  });

  return merge(
    defaultConfig,
    { theme, flags },
    userConfig,
    hardConfig
  ) as Config;
}
