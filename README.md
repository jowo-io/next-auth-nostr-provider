> ⚠️ WARNING ⚠️
>
> This project is currently under construction 👷🏗️🚧
>
> It is not recommended to use it in production apps. It may be insecure!
>
> See [this issue](https://github.com/nextauthjs/next-auth/issues/7872) for updates and more info.

# TODO

### Primary

- support `next-auth@4` and `next-auth@5`
- support Next.js app directory and pages directory (if possible)
- investigate CSRF for next-auth
- test deploy example app to vercel

### Secondary

- carefully run through the auth and data flow to look for bugs or oversights
- add comments to functions
- look into JWT expire time and token api response fields
- tidy up endpoint and add validation and error handling
- consider and improve error handling more generally. what can go wrong? how is that handled?
- finish adding pages.error / pages.signUp config options
- add an example of custom login pages using `LnAuthLoginWrapper` and `LnAuthLogin`

### Tertiary

- decide on terminology (avatar or image or picture)
- add more example repos. e.g. redis, prisma
- add readme
- add spinner to Loading component
- open PR on `next-auth`
- support multiple file types for avatar and qr

### Readme

- document the `UserConfig` options
- explain how the storage methods work
- custom login pages using `LnAuthLoginWrapper` and `LnAuthLogin`
- improve the basic description in the About section
- explain what the secret is used for
- add a basic readme to the `examples/` folder

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

### Configure

Configure `next-auth-lightning-provider` somewhere that makes sense. For this example we'll use `/utils/lnauth.ts`

```typescript
// @/utils/lnauth.ts

import NextAuthLightningProvider, {
  NextAuthLightningProviderConfig,
} from "next-auth-lightning-provider";

export const config: NextAuthLightningProviderConfig = {
  // required
  siteUrl: process.env.NEXTAUTH_URL,
  secret: process.env.NEXTAUTH_SECRET,
  storage: {
    async set({ k1, data }) {
      // save data based on k1 id
    },
    async get({ k1 }) {
      // lookup and return data based on k1 id
    },
    async update({ k1, data }) {
      // lookup and update data based on k1 id
    },
    async delete({ k1 }) {
      // delete data based on k1 id
    },
  },

  // optional
  theme: {
    colorScheme: "dark",
  },
};

export default NextAuthLightningProvider(config);
```

### Provider

In your `pages/api/auth/[...nextauth].ts` file add the Lightning provider to your `next-auth` config.

```typescript
// @/pages/api/auth/[...nextauth].ts

import NextAuth, { AuthOptions } from "next-auth";

import lnauth from "@/utils/lnauth"; // <--- import the file you created above

export const authOptions: AuthOptions = {
  providers: [
    lnauth.provider, // <--- and add the provider to the providers array
  ],
};

export default NextAuth(authOptions);
```

### Api

Create a new API route under `pages/api/lnauth/[...lnauth].ts`.

```typescript
// @/pages/api/lnauth/[...lnauth].ts

import lnAuth from "@/utils/lnauth";

export default lnAuth.handler;
```

This API will handle all of the custom lightning related API requests, such as generating QRs, handling callbacks, polling and signing tokens.

# Examples

See working examples in the [examples folder](https://github.com/jowo-io/next-auth-lightning-provider/tree/main/examples).
