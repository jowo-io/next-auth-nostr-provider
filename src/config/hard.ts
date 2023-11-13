import { HardConfig } from "./types.js";

const idPrefix = "next-auth-lightning-provider";

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
