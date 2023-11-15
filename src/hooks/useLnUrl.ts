import * as React from "react";

import { createApiRequest, pollApiRequest } from "../utils/api.js";
import { hardConfig } from "../config/index.js";
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
  const [lnurl, setUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    let data: any;

    const poll = async () => {
      if (data.k1) await pollApiRequest(data.k1, state, redirectUri);
    };
    const create = async () => {
      data = await createApiRequest(state);
      setUrl(data.lnurl);
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
