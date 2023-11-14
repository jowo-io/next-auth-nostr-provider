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

# Examples

See working examples in the [examples folder](https://github.com/jowo-io/next-auth-lightning-provider/tree/main/examples).
