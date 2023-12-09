# TODO

Below is a TODO list for further development of `next-auth-lightning-provider`.

### Alpha

- investigate CSRF for next-auth
- test deploy all the various example apps
  - app router generic
  - app router custom pages
  - pages router generic
  - pages router custom pages

### Beta

- test diagnostics API with KV and
- manual testing. pre beta release make list of all test criteria and go through them
  - test node, next, next-auth versions for compatibility (including deployed)
  - test all user configuration options
- tidy up READMEs
  - add yellow notes to diagram.
  - carefully scan for errors and typos
  - ensure consistent formatting is used. full stops, caps, etc
  - add suggestion: cleaning up old and unused lnauth session data that was created but never reached success state.
  - add OpenSats logo
- write SN post and publish it
- update readme warning to BETA

### Release

- open PR on `next-auth`
- add more example repos
- Once `next-auth@v5` is out of beta, ensure it's supported.

### Back-burner

Stuff I may or may not get around to:

- add `auto` color scheme that user browser's preferred dark/light settings
- consider adding various styles of avatar and name generators
- consider / investigate how to SSR react components so the `vanilla.ts` shim can be deprecated
- add JSDocs comments to all internally used functions
- add comments to code
- 404 page?
- make jest typescript settings the same as project
- add extra tests for difficult code like signin / diagnostics pages, hooks, vanilla js etc.
- look into dicebear console warnings in `custom-pages` example when running when running locally (they don't appear when when installed via npm, so low priority)
