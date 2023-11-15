import { NextApiRequest, NextApiResponse } from "next/types";

import { tokenValidation } from "../validation/lnauth.js";

import { generateIdToken } from "../utils/jwt.js";
import { Config } from "../config/index.js";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  config: Config
) {
  const { code: k1 } = tokenValidation.parse(req.body);

  const { pubkey, success } = await config.storage.get({ k1 }, req);

  if (!pubkey) throw new Error("Missing pubkey");

  if (!success) throw new Error("Login was not successful");

  const idToken = await generateIdToken(pubkey, config);

  await config.storage.delete({ k1 }, req);

  res.send(
    JSON.stringify({
      status: "OK",
      success: true,
      token_type: "Bearer",
      // expires_in: 30 * 24 * 60 * 60,
      id_token: idToken,
      // refresh_token: "",
      scope: "user",
    })
  );
}
