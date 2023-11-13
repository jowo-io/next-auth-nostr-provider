import { useState, useEffect } from "react";

import { createApiRequest, pingApiRequest } from "../utils/api.js";
import { hardConfig } from "../config/index.js";
import { formatLnAuth } from "../utils/lnurl.js";

export default function useLnUrl({
  clientId,
  redirectUri,
  state,
}: {
  clientId: string;
  redirectUri: string;
  state: string;
}): {
  lnurl: string | null;
  qr: string;
  button: string;
} {
  const [lnurl, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let data: any;

    const ping = async () => {
      if (data.k1) await pingApiRequest(data.k1, state, redirectUri);
    };
    const create = async () => {
      data = await createApiRequest(clientId, state);
      setUrl(data.lnurl);
    };

    const pingIntervalId = setInterval(ping, hardConfig.intervals.ping);
    const createIntervalId = setInterval(create, hardConfig.intervals.create);
    create(); // immediately invoke it so the QR gets created

    return () => {
      clearInterval(pingIntervalId);
      clearInterval(createIntervalId);
    };
  }, []);

  const { qr, button } = formatLnAuth(lnurl);

  return { lnurl, qr, button };
}
