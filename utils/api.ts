import { hardConfig } from "../config.js";

export async function pingApiRequest(
  k1: string,
  state: string,
  redirectUri: string
) {
  const response = await fetch(hardConfig.apis.ping, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ k1 }),
    cache: "default",
  });

  const data = await response.json();

  if (data.success) {
    let url = new URL(redirectUri);
    url.searchParams.append("state", state);
    url.searchParams.append("code", k1);
    window.location.replace(url);
  }
}

export async function createApiRequest(clientId: string, state: string) {
  const params = new URLSearchParams({
    client_id: clientId,
    state,
  });
  const response = await fetch(
    `${hardConfig.apis.create}?${params.toString()}`
  );
  return await response.json();
}
