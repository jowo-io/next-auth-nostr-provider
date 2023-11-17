> ⚠️ WARNING ⚠️
>
> This project is currently under construction 👷🏗️🚧
>
> It is not recommended to use it in production apps. It may be insecure!
>
> See [this issue](https://github.com/nextauthjs/next-auth/issues/7872) for updates and more info.

# About

This package provides a plug and play solution for enabling Lightning auth in your Next.js app!

It's a light-weight and self-hosted Lightning / [lnurl-auth](https://fiatjaf.com/e0a35204.html) OAuth wrapper and [next-auth](https://github.com/nextauthjs/next-auth) provider.

> This package is built for Next.js apps that use [next-auth](https://github.com/nextauthjs/next-auth). It's not compatible with other authentication libraries.

# Compatibility

- `next-auth-lightning-provider` only supports the `next-auth` version 4, `next-auth` version 5 support **coming soon**.
- `next-auth-lightning-provider` only supports the next pages directory at the moment, app router support **coming soon**.

# Getting started

### Install

```bash
npm i next-auth-lightning-provider
```

### Env

You'll need to set a couple of env vars in your project's `.env` file. You may already have them defined as part of your `next-auth` configuration. This package also requires them.

---

The `NEXTAUTH_URL` environment variable must be defined as the canonical URL of your site.

```bash
NEXTAUTH_URL=http://localhost:3000
```

---

The `NEXTAUTH_SECRET` encrypts the JWT that authenticates users who have logged in with Lightning.

```bash
NEXTAUTH_SECRET="<super-secret-random-string>"
```

You can quickly create a good value for `NEXTAUTH_SECRET` on the command line via this `openssl` command.

```bash
openssl rand -base64 32
```

### Api

Create a new API route under `pages/api/lnauth/[...lnauth].ts` and configure `next-auth-lightning-provider`.

```typescript
// @/pages/api/lnauth/[...lnauth].ts

import NextAuthLightning, {
  LnAuthData,
  NextAuthLightningConfig,
} from "next-auth-lightning-provider";

const config: NextAuthLightningConfig = {
  // required
  siteUrl: process.env.NEXTAUTH_URL,
  secret: process.env.NEXTAUTH_SECRET,
  storage: {
    async set({ k1, data }) {
      // save lnurl auth session data based on k1 id
    },
    async get({ k1 }) {
      // lookup and return lnurl auth session data based on k1 id
    },
    async update({ k1, data }) {
      // update lnurl auth session data based on k1 id
    },
    async delete({ k1 }) {
      // delete lnurl auth session data based on k1 id
    },
  },

  // optional
  theme: {
    colorScheme: "dark",
  },
};

const { provider, handler } = NextAuthLightning(config);

export const lightningProvider = provider;

export default handler;
```

This API will handle all of the custom lightning related API requests, such as generating QRs, handling callbacks, polling and encrypting JWT auth tokens.

### Provider

In your existing `pages/api/auth/[...nextauth].ts` config file, import and add the Lightning provider to the provider array.

```typescript
// @/pages/api/auth/[...nextauth].ts

import { lightningProvider } from "../lnauth/[...lnauth]"; // <--- import the provider that's exported from the lnauth API route

export const authOptions: AuthOptions = {
  providers: [
    lightningProvider, // <--- and add the provider to the providers array
  ],
};

export default NextAuth(authOptions);
```

# Configuration

There are various configurations available to you. Some are required, some are optional.

###

```typescript

const config: NextAuthLightningConfig = {
  // required

  /**
   * @param {string} siteUrl
   * Must be defined as the canonical URL of your site. This URL is used in
   * various places under the hood, such as for generating callback URLs and
   * to validate the JWT that authenticates users who have logged in with Lightning.
   */
  siteUrl: process.env.NEXTAUTH_URL,

  /**
   * @param {string} siteUrl
   * Must be defined as a securely generated random string.
   * Used to encrypt the JWT that authenticates users who have
   * logged in with Lightning.
   */
  secret: process.env.NEXTAUTH_SECRET,

  /**
   * @param {object} storage
   * Because lnurl-auth requires that a user's Lightning wallet to trigger a
   * callback API and authenticate them, we also require session storage to
   * persist some data and ensure it's available when the callback is triggered.
   * Data can be stored in a medium of your choice, for example:
   * in a database, document store, or session store.
   */
  storage: {
    /**
     * @param {function} set
     * An async function that receives a k1 and data arguments.
     * The k1 is used to as a unique key under which to store the data for later use.
     */
    async set({ k1, data }) {
      // save lnurl auth session data based on k1 id
    },

    /**
     * @param {function} get
     * An async function that receives a k1 argument.
     * The k1 is used to as a unique key to find and return data stored under it.
     */
    async get({ k1 }) {
      // lookup and return lnurl auth session data based on k1 id
    },

    /**
     * @param {function} update
     * An async function that receives a k1 and data arguments.
     * The k1 is used to as a unique key to find and update data stored under it.
     * Only triggered if data is expected to already exist in your database.
     */
    async update({ k1, data }) {
      // update lnurl auth session data based on k1 id
    },

    /**
     * @param {function} delete
     * An async function that receives a k1.
     * The k1 is used to as a unique key to find and delete data previously saved data.
     */
    async delete({ k1 }) {
      // delete lnurl auth session data based on k1 id
    },
  },

  // optional
  pages: {
    /**
     * @param {string} signIn
     * override the default Lightning login screen.
     * A Lightning login page will be automatically generated unless the
     * `signIn` path is specified. It lets you define your own page where you can
     * configure a custom Lightning login screen.
     *
     * see examples code here:
     * https://github.com/jowo-io/next-auth-lightning-provider/tree/main/examples/login-page/pages/login.tsx
     */
    signIn: "/login"

    /**
     * @param {string} error
     * override the default error screen.
     * By default the user will be redirected to the `next-auth` login page if something goes wrong.
     * If you want to build a custom error screen you can specify the path here.
     */
    error: "/error"
  },

  /**
   * @param {string | null} title
   * override the default title, set to null to hide the title.
   */
  title: "Lightning Login",

  /**
   * @param {function | null} generateAvatar
   * override the default deterministic avatar generator.
   * It must return a correctly string containing svg XML markup.
   * set to null to disable avatars.
   *
   * the default library used is:
   * https://www.dicebear.com/styles/bottts/
   */
  async generateAvatar(seed) {
    return {
      image: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 394 80">...........</svg>'
    };
  },

  /**
   * @param {function | null} generateName
   * override the default deterministic name generator.
   * set to null to disable names.
   *
   * the default library used is:
   * https://www.npmjs.com/package/unique-names-generator
   */
  async generateName(seed) {
    return {
      name: "Sponge Bob",
    };
  },

  qr: {
    /**
     * @param {function} qr.generateQr
     * override the default QR code generator.
     * it must return a correctly string containing svg XML markup.
     *
     * the default library used is:
     * https://www.npmjs.com/package/qrcode
     */
    async generateQr(data, config) {
      return {
        qr: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 394 80">...........</svg>'
      };
    },

    /**
     * @param {object} color
     * override the default qrcode colors.
     */
    color: { dark: "#000000", light: "#ffffff" },

    /**
     * @param {number} margin
     * override the default qrcode margin.
     */
    margin: 2,
  },

  theme: {
    /**
     * @param {string} colorScheme - e.g. "#000000"
     * sets a color scheme for the Lightning login page's UI, white by default.
     */
    colorScheme: "auto" | "dark" | "light";
    /**
     * @param {string} background
     * The background color of the Lightning login page.
     */
    background: "#ececec",
    /**
     * @param {string} backgroundCard
     * The background color of main content card in the Lightning login page.
     */
    backgroundCard: "#ffffff",
    /**
     * @param {string} text
     * The color of text in the Lightning login page.
     */
    text: "#000000",
    /**
     * @param {string} error
     * The color of error messages shown in the Lightning login page.
     */
    error: "#c94b4b",
    /**
     * @param {string} loginButtonBackground
     * The color of background of the initial "Login with Lightning" button that
     * users are shown in the `next-auth` login screen.
     */
    loginButtonBackground: "#24292f",
    /**
     * @param {string} loginButtonText
     * The color of text in the initial "Login with Lightning" button that
     * users are shown in the `next-auth` login screen.
     */
    loginButtonText: "#ffffff",
  },

};
```

# Examples

See working examples in the [examples folder](https://github.com/jowo-io/next-auth-lightning-provider/tree/main/examples).
