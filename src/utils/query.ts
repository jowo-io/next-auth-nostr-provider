export function extractQuery(query: any) {
  let { client_id: clientId, redirect_uri: redirectUri, state } = query;

  if (Array.isArray(clientId)) clientId = clientId[0];
  if (Array.isArray(redirectUri)) redirectUri = redirectUri[0];
  if (Array.isArray(state)) state = state[0];

  return { clientId, redirectUri, state };
}
