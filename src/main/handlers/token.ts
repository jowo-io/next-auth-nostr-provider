import { NextApiRequest, NextApiResponse } from "next/types";

import {
  tokenValidation,
  formatErrorMessage,
  errorMap,
} from "../validation/lnauth.js";
import {
  generateIdToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { Config } from "../config/index.js";

const handleAuthCode = async function (
  k1: string,
  req: NextApiRequest,
  config: Config
) {
  const { pubkey, success } = await config.storage.get({ k1 }, req);

  if (!success) throw new Error("Login was not successful");

  await config.storage.delete({ k1 }, req);

  return pubkey;
};

const handleRefreshToken = async function (
  refreshToken: string,
  req: NextApiRequest,
  config: Config
) {
  const { pubkey } = await verifyRefreshToken(refreshToken, config);

  return pubkey;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  config: Config
) {
  try {
    const {
      grant_type: grantType,
      code: k1,
      refresh_token: refreshToken,
    } = tokenValidation.parse(req.body, { errorMap });

    let pubkey;
    if (grantType === "authorization_code") {
      if (!k1) throw new Error("Missing code");

      pubkey = await handleAuthCode(k1, req, config);
    } else if (grantType === "refresh_token") {
      if (!refreshToken) throw new Error("Missing refresh token");

      pubkey = await handleRefreshToken(refreshToken, req, config);
    } else {
      throw new Error("Invalid grant type");
    }

    if (!pubkey) throw new Error("Missing pubkey");

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

    res.send(
      JSON.stringify({
        status: "OK",
        success: true,
        ...token,
      })
    );
  } catch (e: any) {
    res.status(500).send(formatErrorMessage(e));
  }
}
