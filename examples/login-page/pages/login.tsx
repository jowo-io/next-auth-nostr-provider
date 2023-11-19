import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { extractQuery } from "next-auth-lightning-provider/react";

import LightningLogin from "@/components/LightningLogin";

export default function LoginPage() {
  const { isReady, query } = useRouter();
  const session = useSession();

  const { redirectUri, state } = extractQuery(query);

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
      <LightningLogin redirectUri={redirectUri} state={state} />
    </div>
  );
}
