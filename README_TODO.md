# TODO

Below is a TODO list for further development of `next-auth-lightning-provider`

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
- add more example repos. e.g. prisma, custom login pages
- add readme
- add spinner to Loading component
- open PR on `next-auth`
- support multiple file types for avatar and qr
- make the `storage.update` method optional

### Readme

- document the `UserConfig` options
- explain how the storage methods work
- custom login pages using `LnAuthLoginWrapper` and `LnAuthLogin`
- improve the basic description in the About section
- explain what the secret is used for
- add info about deterministic generation of image and name
