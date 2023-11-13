import { hardConfig } from "../config/index.js";

export function formatLnAuth(lnurl?: string | null) {
  if (!lnurl) {
    return { lnurl, qr: "", button: "" };
  }

  const qr = `${hardConfig.apis.qr}/${lnurl}.svg`;
  const button = `lightning:${lnurl}`;

  return { lnurl, qr, button };
}
