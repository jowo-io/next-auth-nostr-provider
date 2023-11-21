# TODO

Below is a TODO list for further development of `next-auth-lightning-provider`

### Primary

- Once `next-auth@v5` is out of beta, ensure it's supported.
- investigate CSRF for next-auth

### Secondary

- error handling: of
  - App Router APIs
  - error thrown in `storage.get` and other storage methods
  - error at end of API if no paths matched
  - "You are already logged in" error, passing. etc
  - making error messages user friendly
  - adding error http status
  - adding custom error code query param
  - documenting the error types
- carefully run through the auth and data flow to look for bugs or oversights
- add jest tests where applicable
- open PR on `next-auth`
- manual testing. pre beta release make list of all test criteria and go through them
- deploy app to vercel and test remotely

### Tertiary

- add more example repos

### Readme

- add yellow notes to diagram.
- carefully scan for errors and typos
- ensure consistent formatting is used. full stops, caps, etc
- add suggestion: cleaning up old and unused lnauth session data that was created but never reached success state.

### back-burner

- add `auto` color scheme that uses browsers dark/light settings
- see if TS generics can be used for NextRequest/NextApiRequest etc
- consider adding various styles of avatar and name generators
- consider / investigate how to SSR react components so the `vanilla.ts` shim can be deprecated
- add JSDocs comments to all internally used functions
- consider deleting cookie instead of throwing error "You are already logged in"
