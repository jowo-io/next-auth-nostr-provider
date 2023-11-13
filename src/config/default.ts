import merge from "lodash.merge";

import { createAvatar } from "@dicebear/core";
import { bottts } from "@dicebear/collection";

import QRCode from "qrcode";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

import { Config, LnAuthConfig, OptionalConfig, ThemeStyles } from "./types.js";
import { hardConfig } from "./hard.js";

const colorSchemeLight: ThemeStyles = {
  background: "#ececec",
  backgroundCard: "#fff",
  text: "#000",
  error: "#c94b4b",
};

const colorSchemeDark: ThemeStyles = {
  background: "#161b22",
  backgroundCard: "#0d1117",
  text: "#fff",
  error: "#c94b4b",
};

const defaultConfig: Partial<OptionalConfig> = {
  async generateAvatar(seed) {
    return {
      image: createAvatar(bottts, { seed }).toString(),
    };
  },
  async generateName(seed) {
    return {
      name: uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals],
        separator: "-",
        seed,
      }),
    };
  },
  qr: {
    async generateQr(data, config) {
      // generic preset theme options
      const themeOptions =
        config.theme.colorScheme === "dark"
          ? {
              margin: 0.5,
              color: {
                dark: config.theme.background,
                light: config.theme.text,
              },
            }
          : {
              margin: 0,
              color: {
                dark: config.theme.text,
                light: config.theme.background,
              },
            };

      // qr specific option overrides
      const qrOptions: any = {};
      if (config.qr?.color) {
        qrOptions.color = config.qr.color;
        qrOptions.margin = 0.5;
      }
      if (typeof config.qr?.margin === "number") {
        qrOptions.margin = config.qr.margin;
      }

      // merge options, prioritize explicit qrOptions
      const options = merge(themeOptions, qrOptions);

      return {
        qr: (await QRCode.toString(data, {
          ...options,
          type: "svg",
        })) as unknown as string,
      };
    },
  },
  pages: {
    signIn: "/api/lnauth/login", // pre-configured qr lightning login
    error: "/api/auth/signin", // default next-auth error page
  },
  title: "Login with Lightning",
  theme: {
    colorScheme: "auto",
  },
};

export function formatConfig(lnAuthConfig: LnAuthConfig): Config {
  const theme =
    lnAuthConfig.theme?.colorScheme === "dark"
      ? colorSchemeDark
      : colorSchemeLight;

  return merge(defaultConfig, { theme }, lnAuthConfig, hardConfig) as Config;
}
