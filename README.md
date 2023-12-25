> ℹ️ Beta notice
>
> This project is currently in beta. A stable release will land by February 2024.
>
> If you encounter any issues during installation and configuration, or in development and production environments, it'd be greatly appreciated if you report them [here](https://github.com/jowo-io/next-auth-lightning-provider/issues).

# About

A light-weight Lightning auth provider for your Next.js app that's entirely self-hosted and plugs seamlessly into the [next-auth](https://github.com/nextauthjs/next-auth) framework.

> ℹ️ This package is built for Next.js apps that use [next-auth](https://github.com/nextauthjs/next-auth). It's not compatible with other authentication libraries.

# How it works

Install the package, add two code snippets to your app (as shown below). It's that simple.

Your users will then be shown an additional authentication option in the provider list on the `next-auth` sign in page. When they click the new option they'll be presented with a QR code. The QR code can be scanned with any Bitcoin Lightning wallet that supports [lnurl-auth](https://fiatjaf.com/e0a35204.html). After scanning, they'll be securely logged in! No usernames, no passwords and no third party providers required.

The `next-auth-lightning-provider` package extends `lnurl-auth` by wrapping it in an OAuth API. `lnurl-auth` is used to authenticate your users, and OAuth is wrapped around it to make integration with `next-auth` seamless.

As well as providing the basic authentication functionality that you'd expect, `next-auth-lightning-provider` also offers some extra functionality, such as deterministically generating avatars and usernames for authenticated users! (These extra features can be disabled if not required)

# Compatibility

```json
{
  "engines": {
    "node": ">=14"
  },
  "peerDependencies": {
    "next": "^12.2.5 || ^13 || ^14",
    "next-auth": "^4",
    "react": "^17.0.2 || ^18",
    "react-dom": "^17.0.2 || ^18"
  }
}
```

# Getting started

### Install

```bash
npm i next-auth-lightning-provider
```

### .env

You'll need to setup a couple of env vars in your project's `.env` file. However, you may already have them defined as part of your `next-auth` configuration.

---

The `NEXTAUTH_URL` env var must be defined as the canonical URL of your site.

```bash
NEXTAUTH_URL="http://localhost:3000"
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

This API will handle all of the Lightning auth API requests, such as generating QRs, handling callbacks, polling and issuing JWT auth tokens.

```typescript
// @/pages/api/lnauth/[...lnauth].ts

import NextAuthLightning, {
  NextAuthLightningConfig,
} from "next-auth-lightning-provider";
import generateQr from "next-auth-lightning-provider/generators/qr";
import generateName from "next-auth-lightning-provider/generators/name";
import generateAvatar from "next-auth-lightning-provider/generators/avatar";

const config: NextAuthLightningConfig = {
  // required
  baseUrl: process.env.NEXTAUTH_URL,
  secret: process.env.NEXTAUTH_SECRET,
  storage: {
    async set({ k1, session }) {
      // save lnurl auth session data based on k1 id
    },
    async get({ k1 }) {
      // lookup and return lnurl auth session data based on k1 id
    },
    async update({ k1, session }) {
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

> ℹ️ The above example uses the Pages Router. If your app uses the App Router then take a look at the [examples/app-router/](https://github.com/jowo-io/next-auth-lightning-provider/tree/main/examples/app-router/) example app.

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

If you were to authenticate a user with only `lnurl-auth`, all you'd know about them is their unique ID (a `pubkey`). The `next-auth-lightning-provider` package goes a step further and provides several generator functions that can be used to deterministically (the `pubkey` is used as a seed) generate avatars and usernames. This means you can show users a unique name and image that'll be associated with their account!

As well as the avatar and image generators, there's also a QR code generator.

The generators are tree-shakeable. If you don't need them, simply don't import them and they'll not be included in your app's bundle.

```typescript
import generateQr from "next-auth-lightning-provider/generators/qr";
import generateName from "next-auth-lightning-provider/generators/name";
import generateAvatar from "next-auth-lightning-provider/generators/avatar";
```

> ℹ️ You can write your own generator functions if those provided don't suit your needs!
>
> Once you have configured the generator functions you can launch your dev server and test them locally on the diagnostics page:

```
http://localhost:3000/api/lnauth/diagnostics
```

# Configuration

There are various configurations available to you. Some are required, some are optional.

###

```typescript

const config: NextAuthLightningConfig = {
  /**
   * @param {string} baseUrl
   *
   * Must be defined as the canonical URL of your site. It's used in
   * various places under the hood, such as for generating callback URLs and
   * in the headers of JWT tokens that are issued to logged in user.
   */
  baseUrl: process.env.NEXTAUTH_URL,

  /**
   * @param {string} secret
   *
   * Must be defined as a securely generated random string. Used to sign the
   * JWT token that authenticates users who have logged in with Lightning.
   */
  secret: process.env.NEXTAUTH_SECRET,

  /**
   * @param {object} storage
   *
   * The lnurl-auth spec requires that a user's Lightning wallet trigger a
   * callback as part of the authentication flow. So, we require session storage to
   * persist some data and ensure it's available when the callback is triggered.
   * Data can be stored in a medium of your choice.
   *
   * Once you have configured the storage functions you should test them on the diagnostics page:
   * @see http://localhost:3000/api/lnauth/diagnostics
   *
   * @see https://github.com/jowo-io/next-auth-lightning-provider/tree/main/examples/
   */
  storage: {
    /**
     * @param {function} set
     *
     * An async function that receives a k1 and a data argument.
     * The k1 is a unique key that's used to store the
     * data for later use.
     */
    async set({ k1, session }) {
      // save lnurl auth session data based on k1 id
    },

    /**
     * @param {function} get
     *
     * An async function that receives a k1 argument.
     * The k1 is a unique key that's used to find
     * and return data previously stored under it.
     */
    async get({ k1 }) {
      // lookup and return lnurl auth session data based on k1 id
    },

    /**
     * @param {function} update
     *
     * An async function that receives a k1 and a data argument.
     * The k1 is a unique key that's used to find and
     * update data previously stored under it.
     */
    async update({ k1, session }) {
      // update lnurl auth session data based on k1 id
    },

    /**
     * @param {function} delete
     *
     * An async function that receives a k1 argument.
     * The k1 is a unique key that's used to find and
     * delete data previously saved data.
     */
    async delete({ k1 }) {
      // delete lnurl auth session data based on k1 id
    },
  },

  /**
   * @param {function} generateQr
   *
   * Define the QR code generator function.
   * It must return a base64 encoded png/jpg OR svg XML markup.
   *
   * A default QR code generator is provided. It can be imported from:
   * import generateQr from "next-auth-lightning-provider/generators/qr";
   *
   * the default library used is:
   * @see https://www.npmjs.com/package/qrcode
   */
  async generateQr(data, config) {
    return {
      data: "data:image/png;base64,iVBO.....CYII=",
      type: "png",
      // or
      data: "<svg>.....</svg>",
      type: "svg"
    };
  },

  // optional
  pages: {
    /**
     * @param {string} signIn
     *
     * A Lightning auth page will be automatically generated unless the
     * `signIn` path is specified. It lets you define your own page where
     * you can configure a custom Next.js page and customize the UI.
     *
     * @note the path must begin with a leading `/`. For example, `/signin`, not `signin`.
     *
     * @see https://github.com/jowo-io/next-auth-lightning-provider/tree/main/examples/ui-pages-router/
     * and
     * @see https://github.com/jowo-io/next-auth-lightning-provider/tree/main/examples/ui-app-router/
     *
     * @default "/api/lnauth/signin"
     */
    signIn: "/example-custom-signin",

    /**
     * @param {string} error
     *
     * By default users will be redirected to the `next-auth` error page
     * and shown an error message there. If you want a custom error page,
     * you can define a custom path.
     *
     * @note the path must begin with a leading `/`. For example, `/error`, not `error`.
     *
     * @see https://github.com/jowo-io/next-auth-lightning-provider/tree/main/examples/ui-pages-router/
     * and
     * @see https://github.com/jowo-io/next-auth-lightning-provider/tree/main/examples/ui-app-router/
     *
     * @default "/api/auth/error"
     */
    error: "/example-custom-error"
  },

  /**
   * @param {string | null} title
   *
   * Override the default title shown above the QR code in the
   * Lighting auth page. Or, it can be set to null to hide the title.
     *
     * @default "Login with Lightning"
   */
  title: "Your custom title",

  /**
   * @param {function} generateAvatar
   *
   * Define the deterministic avatar generator.
   * It must return a base64 encoded png/jpg OR svg XML markup.
   *
   * A default avatar generator is provided. It can be imported from:
   * import generateAvatar from "next-auth-lightning-provider/generators/avatar";
   *
   * The default avatar generation library that's used is dicebear's bottts style.
   * @see https://www.dicebear.com/styles/bottts/
   */
  async generateAvatar(data, config) {
    return {
      data: "data:image/png;base64,iVBO.....CYII=",
      type: "png",
      // or
      data: "<svg>.....</svg>",
      type: "svg"
    };
  },

  /**
   * @param {function} generateName
   *
   * Define the deterministic name generator.
   *
   * A default name generator is provided. It can be imported from:
   * import generateName from "next-auth-lightning-provider/generators/name";
   *
   * The default name generation library used is `unique-names-generator`
   * @see https://www.npmjs.com/package/unique-names-generator
   */
  async generateName(seed) {
    return {
      name: "Sponge Bob",
    };
  },

  /**
   * Feature flags.
   */
  flags: {
    /**
     * @param {string} diagnostics
     *
     * Toggle on / off the diagnostics page found at:
     * http://localhost:3000/api/lnauth/diagnostics
     *
     * @default enabled for development build only
     */
    diagnostics: true | false

    /**
     * @param {string} logs
     *
     * Toggle on / off the logging of console errors.
     *
     * @default enabled for development build only
     */
    logs: true | false
  },

  /**
   * Control the color scheme of the "Login with Lightning" page and button.
   */
  theme: {
    /**
     * @param {string} colorScheme
     *
     * Define a color scheme for the "Login with Lightning" UI.
     *
     * @default "light"
     */
    colorScheme: "dark" | "light",

    /**
     * @param {string} background
     *
     * Override the theme's background color.
     *
     * @default light "#ececec"
     * @default dark "#161b22"
     */
    background: "#00ffff",

    /**
     * @param {string} backgroundCard
     *
     * Override the theme's main content card background color.
     *
     * @default light "#ffffff"
     * @default dark "#0d1117"
     */
    backgroundCard: "#ffff00",

    /**
     * @param {string} text
     *
     * Override the theme's main text color.
     *
     * @default light "#000000"
     * @default dark "#ffffff"
     */
    text: "#0000ff",

    /**
     * @param {string} signInButtonBackground
     *
     * Override the background color of the sign in button.
     * This is the button that's shown in the provider list on the
     * `next-auth` sign in page alongside your other providers.
     *
     * @default light "#24292f"
     * @default dark "#24292f"
     */
    signInButtonBackground: "#00ff00",

    /**
     * @param {string} signInButtonText
     *
     * Override the text color of the sign in button.
     * This is the button that's shown in the provider list on the
     * `next-auth` sign in page alongside your other providers.
     *
     * @default light "#ffffff"
     * @default dark "#ffffff"
     */
    signInButtonText: "#ff00ff",

    /**
     * @param {object} qrBackground
     *
     * Override the theme's QR code background color.
     *
     * @default light "#ffffff"
     * @default dark "#0d1117"
     */
    qrBackground: "#ff0000",

    /**
     * @param {object} qrForeground
     *
     * Override the theme's QR code foreground color.
     *
     * @default light "#ffffff"
     * @default dark "#0d1117"
     */
    qrForeground: "#0000ff",

    /**
     * @param {number} qrMargin
     *
     * Override the theme's QR code margin value.
     * Scale factor. A value of `1` means 1px per modules (black dots).
     *
     * @default light 0
     * @default dark 0.5
     */
    qrMargin: 1,
  },

  /**
   * Control interval durations.
   */
  intervals: {
    /**
     * @param {number} poll
     *
     * Override the poll interval to increase or decrease the speed at which
     * API polling occurs on the QR Login page. If decreased, the login page will
     * feel more responsive. If increased, the user may be waiting a bit longer
     * before being redirected after a successful login.
     *
     * @min 500 ms (0.5 seconds)
     * @max 5,000 (5 seconds)
     *
     * @default 1,000 ms (1 second)
     */
    poll: 500,

    /**
     * @param {number} create
     *
     * Override the create interval to increase or decrease the speed at which
     * QR codes are refreshed at.
     *
     * @min 30,000 ms (30 seconds)
     * @max 3,600,000 ms (1 hour)
     *
     * @default 300,000 ms (5 minutes)
     */
    create: 30 * 1000,
  },
};
```

# Storage

The `lnurl-auth` spec requires that a user's Lightning wallet trigger a callback as part of the authentication flow. For this reason, it may be that the device scanning the QR (e.g. a mobile) is not the same device that's trying to authenticate (e.g. a desktop). So, we require session storage to persist some data and make it available across devices and ensure it's available when the callback is triggered.

Data can be stored in a medium of your choice. For example: a database, a document store, or a session store. Here's an example using [Vercel KV](https://vercel.com/docs/storage/vercel-kv):

```typescript
import { kv } from "@vercel/kv";

const config: NextAuthLightningConfig = {
  // ...
  storage: {
    async set({ k1, session }) {
      await kv.set(`k1:${k1}`, session);
    },
    async get({ k1 }) {
      return await kv.get(`k1:${k1}`);
    },
    async update({ k1, session }) {
      const old = (await kv.get(`k1:${k1}`)) || {};
      await kv.set(`k1:${k1}`, { ...old, ...session });
    },
    async delete({ k1 }) {
      await kv.del(`k1:${k1}`);
    },
  },
  // ...
};
```

See more working examples in the [examples/](https://github.com/jowo-io/next-auth-lightning-provider/tree/main/examples) folder.

Once you have configured the storage functions you can launch your dev server and test them locally on the diagnostics page:

```
http://localhost:3000/api/lnauth/diagnostics
```

On the diagnostic page you can optionally pass in your own custom session values via query param:

```
http://localhost:3000/api/lnauth/diagnostics?k1=custom-k1&state=custom-state&pubkey=custom-pubkey&sig=custom-sig
```

> ℹ️ The diagnostics page will be **disabled** by default for production builds. To enable on production see the `flags` config options.

### Error page

By default users are sent to the default `next-auth` error page and a generic error message is shown.

The error page path can be overridden and a custom error page can be configured (See the `pages` config options).

If you define a custom error page, the following error codes are passed in via query param:

```typescript
enum ErrorCodes {
  // An attempted API request was made to an auth endpoint while already logged in.
  Forbidden = "You are already logged in.",

  // An API request was made to a non existent `lnurl-auth` API path.
  NotFound = "Path not found.",

  // Authorizing the user failed because the `lnurl-auth` callback received an invalid `signature` / `pubkey`
  Unauthorized = "You could not be signed in.",

  // The user's session has been deleted. Either their session expired or they had a failed sign in attempt and must create a new session.
  Gone = "Session not found.",

  // An API request was made to the `lnurl-auth` APIs with a missing required query param or body arguments.
  BadRequest = "Missing required query or body arguments.",

  // Generic catch-all error code when one of the above errors is not matched.
  Default = "Unable to sign in.",
}
```

Example: `/error?error=Default&message=Unable+to+sign+in.`

# Next.js Routers

With the release of `next@v13` comes the App Router.

This package supports both the [Pages Router](https://nextjs.org/docs/pages) and the [App Router](https://nextjs.org/docs/app).

If your app uses the App Router, see the [examples/app-router/](https://github.com/jowo-io/next-auth-lightning-provider/tree/main/examples/app-router/) app.

If your app uses the Pages Router, see the other apps in the [examples/](https://github.com/jowo-io/next-auth-lightning-provider/tree/main/examples/) folder.

# Examples

See working examples in the [examples/](https://github.com/jowo-io/next-auth-lightning-provider/tree/main/examples) folder.

# Diagram

Here's a diagram illustrating what's happening under the hood during the Lightning OAuth authorization flow:

![diagram of Lightning OAuth authorization flow](https://github.com/jowo-io/next-auth-lightning-provider/blob/main/diagram.jpeg?raw=true)

# Contributing

If you would like to contribute to this project, please open an [issue](https://github.com/jowo-io/next-auth-lightning-provider/issues) before making a pull request.

# Sponsors

Many thanks to [OpenSats](https://opensats.org/) for funding the development of this project!

![OpenSats card](https://opensats.org/static/images/twitter.png)

# License

**ISC**
