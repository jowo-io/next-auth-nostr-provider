## About

This example demonstrates implementing a custom Lightning auth page UI.

> ⚠️ WARNING using `node-persist` is not recommended in lambda or edge environments.
>
> The reason not to use `node-persist` is that it stores session data locally in files, and in most lambda / cloud environments those files will not persist across sessions.
>
> Instead you should use persistent storage such as a database, a document store, or session storage.
>
> See the other examples in the examples folder for more info.

## Example

```tsx
// @see app/signin/page.tsx

import { createLightningAuth } from "next-auth-lightning-provider/server";

import LightningAuth from "@/app/components/LightningAuth";

export default async function SignIn({
  searchParams,
}: {
  searchParams: Record<string, string | string[]>;
}) {
  let session, error;
  try {
    session = await createLightningAuth(searchParams);
  } catch (e: any) {
    error = e.message || "Something went wrong";
  }

  if (error || !session) {
    return <div style={{ textAlign: "center", color: "red" }}>{error}</div>;
  }

  return (
    <div>
      <LightningAuth session={session} />
    </div>
  );
}
```

```tsx
// @see app/components/LightningAuth.tsx

"use client";

import { useLightningPolling } from "next-auth-lightning-provider/hooks";
import { ClientSession } from "next-auth-lightning-provider/server";

export default function LightningAuth({ session }: { session: ClientSession }) {
  const { lnurl, qr, button } = useLightningPolling(session);

  return (
    <div>
      {/* ... */}
      <img
        width={500}
        height={500}
        alt="Login with Lightning QR Code"
        src={qr}
      />
      {/* ... */}
    </div>
  );
}
```

## Getting Started

#### Building `next-auth-lightning-provider`

Before you can run this example, you must build `next-auth-lightning-provider`.

Essentially all that's required is running `npm i` and `npm run build` from the directory root.

#### Running this examples

Run `npm i` to install dependencies

Run `npm run dev` to launch the dev server and visit `localhost:3000` to view the app.
