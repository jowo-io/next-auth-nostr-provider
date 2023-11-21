import { tokenValidation, errorMap } from "../validation/lnauth.js";
import {
  generateIdToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { HandlerArguments, HandlerReturn } from "../utils/handlers.js";

export default async function handler({
  body,
  cookies,
  path,
  url,
  config,
}: HandlerArguments): Promise<HandlerReturn> {
  const {
    grant_type: grantType,
    code: k1,
    refresh_token: refreshToken,
  } = tokenValidation.parse(body, { errorMap });

  let pubkey: string;
  if (grantType === "authorization_code") {
    if (!k1) return { error: "Missing code" };
    const session = await config.storage.get({ k1 }, path, config);
    if (!session?.success) return { error: "Login was not successful" };
    if (!session?.pubkey) return { error: "Missing pubkey" };
    pubkey = session.pubkey;
    await config.storage.delete({ k1 }, path, config);
  } else if (grantType === "refresh_token") {
    if (!refreshToken) return { error: "Missing refresh token" };
    const data = await verifyRefreshToken(refreshToken, config);
    if (!data?.pubkey) return { error: "Missing pubkey" };
    pubkey = data.pubkey;
  } else {
    return { error: "Invalid grant type" };
  }

  const token = {
    // meta
    token_type: "Bearer",
    scope: "user",

    // id token
    expires_in: config.intervals.idToken,
    expires_at: Math.floor(Date.now() / 1000 + config.intervals.idToken),
    id_token: await generateIdToken(pubkey, config),

    // refresh token
    refresh_token: await generateRefreshToken(pubkey, config),
  };

  return {
    response: {
      success: true,
      ...token,
    },
  };
}
