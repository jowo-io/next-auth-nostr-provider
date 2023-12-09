"use client";

import { useSearchParams } from "next/navigation";

import LightningAuth from "@/app/components/LightningAuth";

export default function SignIn() {
  const searchParams = useSearchParams();
  const redirectUri = searchParams?.get("redirect_uri");
  const state = searchParams?.get("state");

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
