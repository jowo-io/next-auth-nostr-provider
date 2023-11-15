import * as React from "react";

import { useLnUrl } from "../hooks/useLnUrl.js";
import { Loading } from "./Loading.js";
import { LnAuthLogin } from "./LnAuthLogin.js";

export function LnAuthLoginWrapper({
  redirectUri,
  state,
}: {
  redirectUri: string;
  state: string;
}) {
  const { lnurl } = useLnUrl({ redirectUri, state });

  if (!lnurl) {
    return <Loading />;
  }

  return (
    <div>
      <LnAuthLogin lnurl={lnurl} />
    </div>
  );
}
