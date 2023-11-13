import { useState, useEffect } from "react";

import { createApiRequest, pingApiRequest } from "../utils/api.js";
import { hardConfig } from "../config.js";
import { formatLnurl } from "../utils/lnurl.js";

export default function useLightningUrl({
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

  const { qr, button } = formatLnurl(lnurl);

  return { lnurl, qr, button };
}
