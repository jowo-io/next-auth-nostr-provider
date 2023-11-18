import merge from "lodash.merge";
import { z } from "zod";

import { Config, UserConfig, OptionalConfig, ThemeStyles } from "./types.js";
import { hardConfig } from "./hard.js";

const colorSchemeLight: ThemeStyles = {
  background: "#ececec",
  backgroundCard: "#ffffff",
  text: "#000000",
  qrBackground: "#0d1117",
  qrForeground: "#ffffff",
  qrMargin: 1,
  loginButtonBackground: "#24292f",
  loginButtonText: "#ffffff",
};

const colorSchemeDark: ThemeStyles = {
  background: "#161b22",
  backgroundCard: "#0d1117",
  text: "#ffffff",
  qrBackground: "#ffffff",
  qrForeground: "#0d1117",
  qrMargin: 1,
  loginButtonBackground: "#24292f",
  loginButtonText: "#ffffff",
};

const defaultConfig: Partial<OptionalConfig> = {
  pages: {
    signIn: "/api/lnauth/login", // pre-configured qr lightning login
    error: "/api/auth/signin", // default next-auth error page
  },
  title: "Login with Lightning",
  theme: {
    colorScheme: "auto",
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
    title: z.string().nullable().optional(),
    theme: z
      .object({
        colorScheme: z.string().optional(),
        background: z.string().optional(),
        backgroundCard: z.string().optional(),
        text: z.string().optional(),
        error: z.string().optional(),
        loginButtonBackground: z.string().optional(),
        loginButtonText: z.string().optional(),
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

  configValidation.parse(userConfig, {
    errorMap: (issue) => {
      return { message: `Config option ${issue.path} of ${issue.code}` };
    },
  });

  return merge(defaultConfig, { theme }, userConfig, hardConfig) as Config;
}
