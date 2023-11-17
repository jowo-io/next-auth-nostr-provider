# TODO

Below is a TODO list for further development of `next-auth-lightning-provider`

### Primary

- support `next-auth@4` and `next-auth@5`
- support Next.js app directory and pages directory (if possible)
- investigate CSRF for next-auth

### Secondary

- carefully run through the auth and data flow to look for bugs or oversights
- ensure that peer dependencies are met and npm throws errors if not

### Tertiary

- consider future proofing qr/name/avatar user config. move all generators into nested object?
- add JSDocs comments to functions / hooks etc
- decide on terminology (avatar or image or picture)
- add more example repos
- add spinner to Loading component
- open PR on `next-auth`
- support multiple file types for avatar and qr
- consider how to clean up old and unused lnauth session data that was created but never reached success state
- add `auto` color scheme that uses browsers dark/light settings
- check if `theme.error` is used anywhere
- consider empty values in JWT token. should be be: null / undefined / empty string ?
- add jest tests for all utils
- cancel inflight api requests if hook unmounts

### Readme

- explain the flow / add a diagram showing user/api/wallet flow.
- improve the basic description in the About section
- add info about deterministic generation of image and name
- carefully scan for errors and typos
