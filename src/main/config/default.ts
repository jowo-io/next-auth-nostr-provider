import merge from "lodash.merge";
import { z } from "zod";

import { Config, UserConfig, OptionalConfig, ThemeStyles } from "./types";
import { hardConfig } from "./hard";
import { configValidation } from "./validation";

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
    error: "/api/auth/error", // default next-auth error page
  },
  title: "Login with Lightning",
  theme: {
    colorScheme: "light",
  },
};

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
    {}, // empty object to merge into
    defaultConfig,
    { theme, flags },
    userConfig,
    hardConfig
  ) as Config;
}
