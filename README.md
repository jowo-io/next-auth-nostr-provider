> This project is currently under construction 👷🏗️🚧⚠️
> See [this issue](https://github.com/nextauthjs/next-auth/issues/7872) for updates and more info

# About

A light-weight and self-hosted Lightning / [lnurl-auth](https://fiatjaf.com/e0a35204.html) OAuth wrapper and provider for [next-auth](https://github.com/nextauthjs/next-auth).

# TODO

### Primary

- support `next-auth@4` and `next-auth@5`
- support Next.js app directory and pages directory (if possible)
- investigate CSRF for next-auth
- test deploy example to vercel

### Secondary

- investigate all `// TODO ...` comments
- add comments to functions
- look into JWT expire time and token api response fields
- tidy up endpoint and add validation and error handling
- consider and improve error handling more generally. what can go wrong? how is that handled?
- add clientId / secret back if necessary for security
- tidy library: restructure files, move types if necessary, export all public api/components from index
- finish adding pages.error / pages.signUp config options
- ability to build custom QR login pages

### Tertiary

- decide on terminology (avatar or image or picture)
- add more example repos. e.g. redis, prisma
- add readme
- add spinner to Loading component
- open PR on `next-auth`
- support multiple file types for avatar and qr
