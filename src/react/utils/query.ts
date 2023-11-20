export function extractQuery(query: any) {
  let { redirect_uri: redirectUri, state } = query;

  if (Array.isArray(redirectUri)) redirectUri = redirectUri[0];
  if (Array.isArray(state)) state = state[0];

  return { redirectUri, state };
}

export function extractSearchParams(params: URLSearchParams) {
  let redirectUri = params.get("redirect_uri");
  let state = params.get("state");

  if (Array.isArray(redirectUri)) redirectUri = redirectUri[0];
  if (Array.isArray(state)) state = state[0];

  return { redirectUri, state };
}
