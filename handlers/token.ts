import { NextApiRequest, NextApiResponse } from "next/types";

import { tokenValidation } from "../validation/lnurl";

import { generateIdToken } from "../utils/jwt";
import { Config } from "../config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  config: Config
) {
  const { code: k1 } = tokenValidation.parse(req.body);

  const { pubkey, success } = await config.storage.get({ k1 }, req);

  if (!pubkey) throw new Error("Missing pubkey");

  if (!success) throw new Error("Login was not successful");

  // TODO check if db item has been used already
  // TODO check successAt is within a 5 min time limit

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
