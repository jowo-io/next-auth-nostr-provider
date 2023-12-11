import { formatLightningAuth } from "../utils/lnurl";
import { hardConfig } from "../main/config";

export type LightningAuthClientSession = {
  data: {
    k1: string;
    lnurl: string;
  };
  intervals: {
    poll: number;
    create: number;
  };
  query: {
    state: string;
    redirectUri: string;
  };
};

export default async function createLightningAuth(
  searchParams: any
): Promise<LightningAuthClientSession> {
  const siteUrl = searchParams.client_id;
  const state = searchParams.state;
  const redirectUri = searchParams.redirect_uri;
  if (!redirectUri || !state) {
    throw new Error("Missing query params");
  }

  const params = new URLSearchParams({ state });
  const response = await fetch(siteUrl + hardConfig.apis.create, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: params,
    cache: "no-cache",
  });
  const data = await response.json();

  if (!data.lnurl) {
    throw new Error("Missing lnurl");
  }

  return {
    data: {
      k1: data.k1,
      lnurl: data.lnurl,
    },
    intervals: {
      poll: data.pollInterval,
      create: data.createInterval,
    },
    query: { state, redirectUri },
  };
}
