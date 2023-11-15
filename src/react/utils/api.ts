import { hardConfig } from "../../main/config/hard.js";

export async function pollApiRequest(k1: string) {
  const response = await fetch(hardConfig.apis.poll, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ k1 }),
    cache: "default",
  });

  return await response.json();
}

export async function createApiRequest(state: string) {
  const params = new URLSearchParams({ state });
  const response = await fetch(
    `${hardConfig.apis.create}?${params.toString()}`
  );
  return await response.json();
}
