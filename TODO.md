# TODO

Below is a TODO list for further development of `next-auth-lightning-provider`

### Primary

- support `next-auth@4` and `next-auth@5`
- investigate CSRF for next-auth

### Secondary

- carefully run through the auth and data flow to look for bugs or oversights
- add jest tests for all utils
- consider how to clean up old and unused lnauth session data that was created but never reached success state
- add JSDocs comments to functions / hooks etc
- open PR on `next-auth`
- error handling: of App Router APIs, of error thrown in `storage.get` and other storage methods, of error at end of API if no paths matched, "You are already logged in" error. etc

### Tertiary

- cancel inflight api requests if hook unmounts
- consider / investigate how to SSR react components so the `vanilla.ts` shim can be deprecated
- add more example repos
- add `auto` color scheme that uses browsers dark/light settings
- consider adding various styles of avatar and name generators
- see if TS generics can be used for NextRequest/NextApiRequest etc

### Readme

- add yellow notes to diagram.
- carefully scan for errors and typos
- ensure consistent formatting is used. full stops, caps, etc
