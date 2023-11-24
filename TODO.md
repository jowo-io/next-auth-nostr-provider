# TODO

Below is a TODO list for further development of `next-auth-lightning-provider`

### Alpha

- investigate CSRF for next-auth
- error handling: of
  - Pages and App Router APIs handle errors consistently ✅
  - error at end of API if no paths matched ✅
  - error thrown in `storage.get` and other storage methods ✅
  - check each handler's logic to ensure all edge case errors are handled. E.g. validation, undefined vars, etc
  - making error messages user friendly
  - adding extra custom error code query param and documenting them
- add jest tests where applicable
- test diagnostics API with KV and
- look into dicebear console warnings when running app-router example
- test deploy all the various example apps

### Beta

- carefully run through the auth and data flow to look for bugs or oversights
- manual testing. pre beta release make list of all test criteria and go through them
- deploy app to vercel and test remotely
- tidy up READMEs (see list bellow)

### Release

- open PR on `next-auth`
- add more example repos
- Once `next-auth@v5` is out of beta, ensure it's supported.

### Readme

- add yellow notes to diagram.
- carefully scan for errors and typos
- ensure consistent formatting is used. full stops, caps, etc
- add suggestion: cleaning up old and unused lnauth session data that was created but never reached success state.

### Back-burner

Stuff I may or may not get around to:

- add `auto` color scheme that uses browser's preferred dark/light settings
- consider adding various styles of avatar and name generators
- consider / investigate how to SSR react components so the `vanilla.ts` shim can be deprecated
- add JSDocs comments to all internally used functions
- consider alternatives to throwing error "You are already logged in"
