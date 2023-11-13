import { NextApiRequest } from "next";

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

export type LnUrlData = {
  k1: string;
  state: string;

  pubkey?: string | null;
  sig?: string | null;
  success?: boolean | null;

  // allow any other fields, they'll be ignored
  [key: string | number | symbol]: unknown;
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

export type ThemeStyles = {
  background: string;
  backgroundCard: string;
  text: string;
  error: string;
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
