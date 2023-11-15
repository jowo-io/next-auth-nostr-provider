import { useState, useEffect } from "react";

import { createApiRequest, pollApiRequest } from "../utils/api.js";
import { hardConfig } from "../config/hard.js";
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

    const poll = async () => {
      if (data?.k1) await pollApiRequest(data.k1, state, redirectUri);
    };
    const create = async () => {
      data = await createApiRequest(state);
      setUrl(data?.lnurl || null);
    };

    const pollIntervalId = setInterval(poll, hardConfig.intervals.poll);
    const createIntervalId = setInterval(create, hardConfig.intervals.create);
    create(); // immediately invoke it so the QR gets created

    return () => {
      clearInterval(pollIntervalId);
      clearInterval(createIntervalId);
    };
  }, []);

  const { qr, button } = formatLnAuth(lnurl);

  return { lnurl, qr, button };
}
