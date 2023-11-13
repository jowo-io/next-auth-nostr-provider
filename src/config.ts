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
import { NextApiRequest } from "next";

const idPrefix = "next-auth-lightning-provider";

export type LnUrlData = {
  k1: string;
  state: string;

  pubkey?: string | null;
  sig?: string | null;
  success?: boolean | null;

  // allow any other fields, they'll be ignored
  [key: string | number | symbol]: unknown;
};

export type HardConfig = {
  apis: {
    // apis
    create: string;
    ping: string;
    callback: string;
    token: string;

    // pages
    signIn: string;

    // misc
    image: string;
    qr: string;
  };
  ids: {
    wrapper: string;
    title: string;
    qr: string;
    copy: string;
    button: string;
    loading: string;
  };
  intervals: {
    ping: number;
    create: number;
  };
};

export type RequiredConfig = {
  siteUrl: string;
  clientId: string;
  clientSecret: string;
  storage: {
    set: (
      args: {
        k1: string;
        data: {
          k1: string;
          state: string;
        };
      },
      req: NextApiRequest
    ) => Promise<undefined>;
    get: (args: { k1: string }, req: NextApiRequest) => Promise<LnUrlData>;
    update: (
      args: {
        k1: string;
        data: {
          pubkey: string;
          sig: string;
          success: boolean;
        };
      },
      req: NextApiRequest
    ) => Promise<undefined>;
    delete: (args: { k1: string }, req: NextApiRequest) => Promise<undefined>;
  };
};

type ThemeStyles = {
  background: string;
  backgroundHover: string;
  backgroundCard: string;
  text: string;
  primary: string;
  controlBorder: string;
  buttonActiveBackground: string;
  buttonActiveBorder: string;
  separator: string;
};

export type OptionalConfig = {
  pages: {
    signIn?: string;
    error?: string;
  };
  title: string | null;
  generateAvatar:
    | ((seed: string, config: Config) => Promise<{ image: string }>)
    | null;
  generateName:
    | ((seed: string, config: Config) => Promise<{ name: string }>)
    | null;

  qr: {
    generateQr?:
      | ((data: string, config: Config) => Promise<{ qr: string }>)
      | null;
    color?: {} | null;
    margin?: number | null;
  };

  theme: {
    colorScheme?: "auto" | "dark" | "light";
  } & Partial<ThemeStyles>;
};

export type LnAuthConfig = RequiredConfig & Partial<OptionalConfig>;

export type Config = HardConfig &
  RequiredConfig &
  OptionalConfig & { theme: ThemeStyles };

export const hardConfig: HardConfig = {
  apis: {
    // apis
    create: "/api/lnauth/create",
    ping: "/api/lnauth/ping",
    callback: "/api/lnauth/callback",
    token: "/api/lnauth/token",

    // pages
    signIn: "/api/lnauth/login",

    // images
    image: "/api/lnauth/image",
    qr: "/api/lnauth/qr",
  },
  ids: {
    title: `${idPrefix}---title`,
    qr: `${idPrefix}---qr`,
    copy: `${idPrefix}---copy`,
    button: `${idPrefix}---button`,
    loading: `${idPrefix}---loading`,
    wrapper: `${idPrefix}---wrapper`,
  },
  intervals: {
    ping: 1000,
    create: 5 * 60 * 1000,
  },
};

export const defaultConfig: Partial<OptionalConfig> = {
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

const colorSchemeLight = {
  background: "#ececec",
  backgroundHover: "rgba(236, 236, 236, 0.8)",
  backgroundCard: "#fff",
  text: "#000",
  primary: "#444",
  controlBorder: "#bbb",
  buttonBackground: "#24292f",
  buttonActiveBackground: "#f9f9f9",
  separator: "#ccc",
  error: "#c94b4b",
};

const colorSchemeDark = {
  background: "#161b22",
  backgroundHover: "rgba(22, 27, 34, 0.8)",
  backgroundCard: "#0d1117",
  text: "#fff",
  primary: "#ccc",
  controlBorder: "#555",
  buttonBackground: "#24292f",
  buttonActiveBackground: "#060606",
  separator: "#444",
  error: "#c94b4b",
};

export function formatConfig(lnAuthConfig: LnAuthConfig): Config {
  const theme =
    lnAuthConfig.theme?.colorScheme === "dark"
      ? colorSchemeDark
      : colorSchemeLight;

  return merge(defaultConfig, { theme }, lnAuthConfig, hardConfig) as Config;
}
