> ⚠️ WARNING ⚠️
>
> This project is currently under construction 👷🏗️🚧
>
> It is not recommended to use it in production apps. It may be buggy or insecure!
>
> See [this issue](https://github.com/nextauthjs/next-auth/issues/7872) for updates and more info.

# About

A light-weight Lightning auth provider for your Next.js app that's entirely self-hosted and plugs seamlessly into the [next-auth](https://github.com/nextauthjs/next-auth) framework.

> ℹ️ This package is built for Next.js apps that use [next-auth](https://github.com/nextauthjs/next-auth). It's not compatible with other authentication libraries.

# How it works

Install the package and add two code snippets to your app (as shown below). It's that simple.

Your users will then be shown an additional auth option in the `next-auth` sign in page. When they click the new option they'll be presented with a QR code. The QR code can be scanned with any Bitcoin Lightning wallet that supports `lnurl-auth`. After scanning, they'll be securely logged in! No username or password required.

Behind the scenes `next-auth-lightning-provider` sets up several API endpoint which act as a basic OAuth server. The API will authorize users with [lnurl-auth](https://fiatjaf.com/e0a35204.html) and then issue a JWT token to them.

As well as providing the basic authentication functionality that you'd expect, `next-auth-lightning-provider` also offers some extra functionality such as deterministicly generating avatars and usernames for authenticated users!

# Compatibility

```json
{
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
  LightningAuthSession,
  NextAuthLightningConfig,
} from "next-auth-lightning-provider";
import generateQr from "next-auth-lightning-provider/generators/qr";
import generateName from "next-auth-lightning-provider/generators/name";
import generateAvatar from "next-auth-lightning-provider/generators/avatar";

const config: NextAuthLightningConfig = {
  // required
  siteUrl: process.env.NEXTAUTH_URL,
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

Normally if you authenticate a user with `lnurl-auth`, all you'd know about the user is their unique ID (a `pubkey`). This package goes a step further and provides several generator functions that can be used to deterministically (the `pubkey` is used as a seed) generate avatars and usernames. That means you can show users a unique name and image that'll be associated with their account!

As well as the avatar and image generators, there's also a QR code generator.

The generators are tree-shakeable. If you don't need them, simply don't import them and they'll not be included in your app's bundle.

```typescript
import generateQr from "next-auth-lightning-provider/generators/qr";
import generateName from "next-auth-lightning-provider/generators/name";
import generateAvatar from "next-auth-lightning-provider/generators/avatar";
```

> ℹ️ You can write your own generator functions if those provided don't suit your needs!
>
> Once you have configured the generator methods you can launch your dev server and test them locally on the diagnostics page:
>
> ```
> http://localhost:3000/api/lnauth/diagnostics
> ```

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
   * Once you have configured the storage methods you can test them on the diagnostics page:
   * @see http://localhost:3000/api/lnauth/diagnostics
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
    async set({ k1, session }) {
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
    async update({ k1, session }) {
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
     * @see https://github.com/jowo-io/next-auth-lightning-provider/tree/main/examples/custom-pages/
     *
     * @default "/api/lnauth/signin"
     */
    signIn: "/example-custom-signin"

    /**
     * @param {string} error
     *
     * By default users will be redirected to the `next-auth` sign in page
     * and shown an error message there. If you want a custom error page,
     * you can define the path here.
     *
     * @note the path must begin with a leading `/`. For example, `/error`, not `error`.
     *
     * @see https://github.com/jowo-io/next-auth-lightning-provider/tree/main/examples/custom-pages/
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
   * @param {function | null} generateAvatar
   *
   * Define the deterministic avatar generator.
   * It must return a base64 encoded png/jpg OR svg XML markup.
   * Or, it can be set to null to disable avatars.
   *
   * A default avatar generator is provided. It can be imported from:
   * import generateAvatar from "next-auth-lightning-provider/generators/avatar";
   *
   * The default avatar generation library that's used is dicebear's bottts style.
   * @see https://www.dicebear.com/styles/bottts/
   *
   * @default null
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
   * @param {function | null} generateName
   *
   * Define the deterministic name generator.
   * Or, it can be set to null to disable names
   *
   * A default name generator is provided. It can be imported from:
   * import generateName from "next-auth-lightning-provider/generators/name";
   *
   * The default name generation library used is `unique-names-generator`
   * @see https://www.npmjs.com/package/unique-names-generator
   *
   * @default null
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
     * Toggle on / off the diagnostics page.
     *
     * @default enabled for development build only
     */
    diagnostics: true | false

    /**
     * @param {string} logs
     *
     * Toggle on / off the error logging.
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
    colorScheme: "dark" | "light";

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
     * Override the theme's button background color. This is the button that's shown in the
     * `next-auth` auth page alongside your other providers.
     *
     * @default light "#24292f"
     * @default dark "#24292f"
     */
    signInButtonBackground: "#00ff00",

    /**
     * @param {string} signInButtonText
     *
     * Override the theme's button text color. This is the button that's shown in the
     * `next-auth` auth page alongside your other providers.
     *
     * @default light "#ffffff"
     * @default dark "#ffffff"
     */
    signInButtonText: "#ff00ff",

    /**
     * @param {object} color
     *
     * Override the theme's background color.
     *
     * @default light "#ffffff"
     * @default dark "#0d1117"
     */
    qrBackground: "#ff0000",

    /**
     * @param {object} color
     *
     * Override the theme's QR code foreground color.
     *
     * @default light "#ffffff"
     * @default dark "#0d1117"
     */
    qrForeground: "#0000ff",

    /**
     * @param {number} margin
     *
     * Override the theme's QR code margin value.
     * Scale factor. A value of `1` means 1px per modules (black dots).
     *
     * @default light 0
     * @default dark 0.5
     */
    qrMargin: 1,
  },

};
```

# Storage

The `lnurl-auth` spec requires that a user's Lightning wallet trigger a callback as part of the authentication flow. For this reason, it may be that the device that scan the QR (e.g. a mobile) is not the same device that's trying to authenticate (e.g. a desktop). So, we require session storage to persist some data and make it available across devices and ensure it's available when the callback is triggered.

Data can be stored in a medium of your choice. For example a database, a document store, or a session store. Here's an example using [Vercel KV](https://vercel.com/docs/storage/vercel-kv):

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
      await kv.set(`k1:${k1}`, session);
    },
    async delete({ k1 }) {
      await kv.del(`k1:${k1}`);
    },
  },
  // ...
};
```

See more working examples in the [examples/](https://github.com/jowo-io/next-auth-lightning-provider/tree/main/examples) folder.

Once you have configured the storage methods you can launch your dev server and test them locally on the diagnostics page:

```
http://localhost:3000/api/lnauth/diagnostics
```

You can also pass in your own custom session values via the query params:

```
http://localhost:3000/api/lnauth/diagnostics?k1=custom-k1&state=custom-state&pubkey=custom-pubkey&sig=custom-sig
```

> ℹ️ The diagnostics page will be **disabled** by default for production builds. To enable on production see the flags config options.

### Error page

By default users are sent to the default `next-auth` error page and a generic error message is shown.

The error page path can be overridden and a custom error page can be configured (See the pages config options).

The following error codes are passed via query parameter to the error page:

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

If your app uses the Pages Router, see any of the other [examples/](https://github.com/jowo-io/next-auth-lightning-provider/tree/main/examples/) apps.

# Examples

See working examples in the [examples/](https://github.com/jowo-io/next-auth-lightning-provider/tree/main/examples) folder.

# Diagram

Here's a diagram illustrating what's happening under the hood during the Lightning OAuth authorization flow:

![diagram of Lightning OAuth authorization flow](https://github.com/jowo-io/next-auth-lightning-provider/blob/main/diagram.jpeg?raw=true)
