## About

This example demonstrates configuring `next-auth-lightning-provider` using the Next.js App Router.

> ⚠️ WARNING using `node-persist` is not recommended in lambda or edge environments.
>
> The reason not to use `node-persist` is that it stores session data locally in files, and in most lambda / cloud environments those files will not persist across sessions.
>
> Instead you should use persistent storage such as a database, a document store, or session storage.
>
> See the other examples in the examples folder for more info.

## Getting Started

#### Building `next-auth-lightning-provider`

Before you can run this example, you must build `next-auth-lightning-provider`.

Essentially all that's required is running `npm i` and `npm run build` from the directory root.

#### Running this examples

Run `npm i` to install dependencies

Run `npm run dev` to launch the dev server and visit `localhost:3000` to view the app.
