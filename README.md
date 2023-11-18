> ⚠️ WARNING ⚠️
>
> This project is currently under construction 👷🏗️🚧
>
> It is not recommended to use it in production apps. It may be insecure!
>
> See [this issue](https://github.com/nextauthjs/next-auth/issues/7872) for updates and more info.

# About

A light-weight Lightning auth provider for your Next.js app that's entirely self-hosted and plugs seamlessly into the [next-auth](https://github.com/nextauthjs/next-auth) framework.

> This package is built for Next.js apps that use [next-auth](https://github.com/nextauthjs/next-auth). It's not compatible with other authentication libraries.

# How it works

Install the package and add two code snippets to your app (as shown below). It's that simple.

Your users will then be shown an additional login option in the `next-auth` login page. When they click the new option they'll be presented with a QR code. The QR code can be scanned with any Bitcoin Lightning wallet that supports `lnurl-auth`. After scanning, they'll be securely logged in! No username or password required.

Behind the scenes `next-auth-lightning-provider` sets up several API endpoint which act as a basic OAuth server. These API will authorize users using [lnurl-auth](https://fiatjaf.com/e0a35204.html) as well as issue JWT tokens and more.

As well as providing the basic authentication functionality that you'd expect, `next-auth-lightning-provider` also offers some extra cool functionality such as generating deterministic avatar images and usernames for authenticated users!

# Compatibility

- `next-auth-lightning-provider` only supports the `next-auth` version 4, `next-auth` version 5 support **coming soon**.
- `next-auth-lightning-provider` only supports the next pages directory at the moment, app router support **coming soon**.

# Getting started

### Install

```bash
npm i next-auth-lightning-provider
```

### Env

You'll need to setup a couple of env vars in your project's `.env` file. You may already have them defined as part of your `next-auth` configuration. This package also requires them.

---

The `NEXTAUTH_URL` env var must be defined as the canonical URL of your site.

```bash
NEXTAUTH_URL=http://localhost:3000
```

---

The `NEXTAUTH_SECRET` env var must be defined as a securely generated random string.

```bash
NEXTAUTH_SECRET="<super-secret-random-string>"
```

You can quickly create a good value for `NEXTAUTH_SECRET` on the command line via this `openssl` command.

```bash
openssl rand -base64 32
```

### API

Create a new API route under `pages/api/lnauth/[...lnauth].ts`

```typescript
// @/pages/api/lnauth/[...lnauth].ts

import NextAuthLightning, {
  LnAuthData,
  NextAuthLightningConfig,
} from "next-auth-lightning-provider";
import { generateQr } from "next-auth-lightning-provider/generators/qr";
import { generateName } from "next-auth-lightning-provider/generators/name";
import { generateAvatar } from "next-auth-lightning-provider/generators/avatar";

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
  generateQr,

  // optional
  generateName,
  generateAvatar,
  theme: {
    colorScheme: "dark",
  },
};

const { provider, handler } = NextAuthLightning(config);

export const lightningProvider = provider;

export default handler;
```

This API will handle all of the Lightning auth API requests, such as generating QRs, handling callbacks, polling and issuing JWT auth tokens.

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

# Generators

Normally if you authenticate a user with lnurl-auth, all you'd know about the user is their unique ID (a pubkey). This package goes a step further and provides several generator functions that can be used to deterministically (the pubkey is used as a seed) generate avatars and usernames. That means you can show users a unique name and image that'll be associated with their account!

As well as the avatar and image generators, there's also a QR code generator.

The generators are tree-shakeable. If you don't need them, simply don't import them and they'll not be included in your app's bundle.

```typescript
import { generateQr } from "next-auth-lightning-provider/generators/qr";
import { generateName } from "next-auth-lightning-provider/generators/name";
import { generateAvatar } from "next-auth-lightning-provider/generators/avatar";
```

> Note: you can write your own generator functions if those provided don't suit your needs!

# Configuration

There are various configurations available to you. Some are required, some are optional.

###

```typescript

const config: NextAuthLightningConfig = {
  /**
   * @param {string} siteUrl
   *
   * Must be defined as the canonical URL of your site. It's used in
   * various places under the hood, such as for generating callback URLs and
   * in the headers of JWT tokens that are issued to logged in user.
   */
  siteUrl: process.env.NEXTAUTH_URL,

  /**
   * @param {string} siteUrl
   *
   * Must be defined as a securely generated random string. Used to sign the
   * JWT that authenticates users who have logged in with Lightning.
   */
  secret: process.env.NEXTAUTH_SECRET,

  /**
   * @param {object} storage
   *
   * `lnurl-auth` requires that a user's Lightning wallet triggers a
   * callback to authenticate them. So, we require session storage to
   * persist some data and ensure it's available when the callback is triggered.
   * Data can be stored in a medium of your choice.
   *
   * @see https://github.com/jowo-io/next-auth-lightning-provider/tree/main/examples/
   */
  storage: {
    /**
     * @param {function} set
     *
     * An async function that receives a k1 and data arguments.
     * The k1 is a unique key that's used to store the data for later use.
     */
    async set({ k1, data }) {
      // save lnurl auth session data based on k1 id
    },

    /**
     * @param {function} get
     *
     * An async function that receives a k1 argument.
     * The k1 is used to find and return data previously stored under it.
     */
    async get({ k1 }) {
      // lookup and return lnurl auth session data based on k1 id
    },

    /**
     * @param {function} update
     *
     * An async function that receives a k1 and data arguments.
     * The k1 is used to find and update data previously stored under it.
     */
    async update({ k1, data }) {
      // update lnurl auth session data based on k1 id
    },

    /**
     * @param {function} delete
     *
     * An async function that receives a k1.
     * The k1 is a unique key that's used to find and delete data previously saved data.
     */
    async delete({ k1 }) {
      // delete lnurl auth session data based on k1 id
    },
  },
  /**
   * @param {function} qr.generateQr
   *
   * Set the QR code generator function.
   * It must return a correctly formatted string containing svg XML markup.
   *
   * A default QR code generator is provided. It can be imported from:
   * `import { generateQr } from "next-auth-lightning-provider/generators/qr";`
   *
   * the default library used is:
   * @see https://www.npmjs.com/package/qrcode
   */
  async generateQr(data, config) {
    return {
      qr: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 394 80">...........</svg>'
    };
  },

  // optional
  pages: {
    /**
     * @param {string} signIn
     *
     * A Lightning login page will be automatically generated unless the
     * `signIn` path is specified. It lets you define your own page where
     * you can configure a custom Next.js page and customize the UI.
     *
     * @see https://github.com/jowo-io/next-auth-lightning-provider/tree/main/examples/login-page/pages/login.tsx
     */
    signIn: "/login"

    /**
     * @param {string} error
     *
     * By default users will be redirected to the `next-auth` login page
     * and shown an error message there. If you want a custom error page,
     * you can define the path here.
     */
    error: "/error"
  },

  /**
   * @param {string | null} title
   *
   * Override the default title shown above the QR code in the
   * Lighting Login page. Or, it can be set to null to hide the title.
   */
  title: "Lightning Login",

  /**
   * @param {function | null} generateAvatar
   *
   * Override the default deterministic avatar generator.
   * It must return a correctly formatted string containing svg XML markup.
   * Or, it can be set to null to disable avatars.
   *
   * The default avatar generation library that's used is dicebear's bottts style.
   *
   * @see https://www.dicebear.com/styles/bottts/
   */
  async generateAvatar(seed) {
    return {
      image: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 394 80">...........</svg>'
    };
  },

  /**
   * @param {function | null} generateName
   *
   * Override the default deterministic name generator.
   * Or, it can be set to null to disable names.
   *
   * The default name generation library used is `unique-names-generator`
   *
   * @see https://www.npmjs.com/package/unique-names-generator
   */
  async generateName(seed) {
    return {
      name: "Sponge Bob",
    };
  },




  /**
   * Control the color scheme of the "Login with Lightning" page and button.
   */
  theme: {
    /**
     * @param {string} colorScheme - e.g. "#000000"
     *
     * Sets a color scheme for the "Login with Lightning" UI.
     */
    colorScheme: "auto" | "dark" | "light";

    /**
     * @param {string} background
     *
     * Override the theme's background color.
     */
    background: "#ececec",

    /**
     * @param {string} backgroundCard
     *
     * Override the theme's main content card background color.
     */
    backgroundCard: "#ffffff",

    /**
     * @param {string} text
     *
     * Override the theme's main text color.
     */
    text: "#000000",

    /**
     * @param {object} color
     *
     * Override the default QR code background color. If left undefined,
     * the QR will be styled based on the theme styles.
     */
    qrBackground: "#ffffff",

    /**
     * @param {object} color
     *
     * Override the default QR code foreground color. If left undefined,
     * the QR will be styled based on the theme styles.
     */
    qrForeground: "#000000",

    /**
     * @param {number} margin
     *
     * Override the default QR code margin.
     */
    qrMargin: 2,

    /**
     * @param {string} loginButtonBackground
     *
     * Override the theme's button background color. This is the button that's shown in the `next-auth` login screen.
     */
    loginButtonBackground: "#24292f",

    /**
     * @param {string} loginButtonText
     *
     * Override the theme's button text color. This is the button that's shown in the `next-auth` login screen.
     */
    loginButtonText: "#ffffff",
  },

};
```

# Examples

See working examples in the [examples folder](https://github.com/jowo-io/next-auth-lightning-provider/tree/main/examples).
