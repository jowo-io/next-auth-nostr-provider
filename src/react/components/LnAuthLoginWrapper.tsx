import { CSSProperties } from "react";

import { useLnUrl } from "../hooks/useLnUrl.js";
import { Loading } from "./Loading.js";
import { LnAuthLogin } from "./LnAuthLogin.js";

export function LnAuthLoginWrapper({
  title,
  redirectUri,
  errorUri,
  state,
  theme,
}: {
  title?: string | null;
  redirectUri: string;
  errorUri?: string;
  state: string;
  theme?: {
    loading?: CSSProperties;
    wrapper?: CSSProperties;
    title?: CSSProperties;
    qr?: CSSProperties;
    copy?: CSSProperties;
    button?: CSSProperties;
  };
}) {
  const { lnurl } = useLnUrl({ redirectUri, errorUri, state });

  if (!lnurl) {
    return <Loading style={theme?.loading} />;
  }

  return (
    <div>
      <LnAuthLogin lnurl={lnurl} title={title} theme={theme} />
    </div>
  );
}
