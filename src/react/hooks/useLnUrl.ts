import { useState, useEffect } from "react";

import { createApiRequest, pollApiRequest } from "../utils/api.js";
import { hardConfig } from "../../main/config/hard.js";
import { formatLnAuth } from "../utils/lnurl.js";

export function useLnUrl({
  redirectUri,
  state,
}: {
  redirectUri: string;
  state: string;
}): {
  lnurl: string | null;
  qr: string;
  button: string;
} {
  const [lnurl, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let data: { k1?: string; lnurl?: string } | null;
    let pollIntervalId: NodeJS.Timeout | undefined;
    let createIntervalId: NodeJS.Timeout | undefined;

    const poll = async () => {
      const k1 = data?.k1;
      if (k1) {
        const { success } = await pollApiRequest(k1);
        if (success) {
          clearInterval(pollIntervalId);
          clearInterval(createIntervalId);
          let url = new URL(redirectUri);
          url.searchParams.append("state", state);
          url.searchParams.append("code", k1);
          window.location.replace(url);
        }
      }
    };
    const create = async () => {
      data = await createApiRequest(state);
      setUrl(data?.lnurl || null);
    };

    pollIntervalId = setInterval(poll, hardConfig.intervals.poll);
    createIntervalId = setInterval(create, hardConfig.intervals.create);
    create(); // immediately invoke it so the QR gets created

    return () => {
      clearInterval(pollIntervalId);
      clearInterval(createIntervalId);
    };
  }, []);

  const { qr, button } = formatLnAuth(lnurl);

  return { lnurl, qr, button };
}
