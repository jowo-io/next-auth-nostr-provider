import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import LightningAuth from "@/components/LightningAuth";

export default function SignIn() {
  const { isReady, query } = useRouter();
  const session = useSession();

  const { redirect_uri: redirectUri, state } = query;

  if (!isReady || session.status === "loading") {
    return (
      <div style={{ textAlign: "center", color: "black" }}>loading...</div>
    );
  }

  if (session.data) {
    return (
      <div style={{ textAlign: "center", color: "red" }}>
        You are already logged in
      </div>
    );
  }

  if (!redirectUri || !state) {
    return (
      <div style={{ textAlign: "center", color: "red" }}>
        Missing query params
      </div>
    );
  }

  return (
    <div>
      <LightningAuth
        redirectUri={redirectUri as string}
        state={state as string}
      />
    </div>
  );
}
