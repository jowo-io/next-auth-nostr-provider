import { useState, useEffect } from "react";

import { createApiRequest, pollApiRequest } from "../utils/api.js";
import { hardConfig } from "../../main/config/hard.js";
import { formatLnAuth } from "../utils/lnurl.js";

export function useLnUrl({
  redirectUri,
  errorUri,
  state,
}: {
  redirectUri: string;
  errorUri?: string;
  state: string;
}): {
  lnurl: string | null;
  qr: string;
  button: string;
} {
  const [lnurl, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let data: { k1?: string; lnurl?: string } | null;
    let pollTimeoutId: NodeJS.Timeout | undefined;
    let createIntervalId: NodeJS.Timeout | undefined;

    // cleanup when the hook unmounts of polling is successful
    const cleanup = () => {
      clearTimeout(pollTimeoutId);
      clearInterval(createIntervalId);
    };

    // redirect user to error page if something goes wrong
    const error = (e: any) => {
      const searchParams = new URLSearchParams();
      searchParams.append("error", "OAuthSignin");
      if (e?.message) searchParams.append("message", e.message);
      window.location.replace(
        (errorUri || "/api/auth/signin") + "?" + searchParams.toString()
      );
    };

    // poll the api to see if successful login has occurred
    const poll = async () => {
      const k1 = data?.k1;
      try {
        if (k1) {
          const { success } = await pollApiRequest(k1);
          if (success) {
            cleanup();
            let url = new URL(redirectUri);
            url.searchParams.append("state", state);
            url.searchParams.append("code", k1);
            window.location.replace(url);
          }
        }
        pollTimeoutId = setTimeout(poll, hardConfig.intervals.poll);
      } catch (e: any) {
        error(e);
      }
    };

    // create a new lnurl and set it to state
    const create = async () => {
      try {
        data = await createApiRequest(state);
        setUrl(data?.lnurl || null);
      } catch (e: any) {
        error(e);
      }
    };

    // setup intervals and create first qr code
    pollTimeoutId = setTimeout(poll, hardConfig.intervals.poll);
    createIntervalId = setInterval(create, hardConfig.intervals.create);
    create();

    return () => cleanup();
  }, []);

  const { qr, button } = formatLnAuth(lnurl);

  return { lnurl, qr, button };
}
