import { NextApiRequest, NextApiResponse } from "next/types";
import lnurl from "lnurl";

import { callbackValidation } from "../validation/lnauth.js";

import { Config } from "../config.js";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  config: Config
) {
  const { k1, key: pubkey, sig } = callbackValidation.parse(req.query);

  const authorize = await lnurl.verifyAuthorizationSignature(sig, k1, pubkey);
  if (!authorize) {
    throw new Error("Error in keys");
  }

  await config.storage.update(
    { k1, data: { pubkey, sig, success: true } },
    req
  );

  res.send(
    JSON.stringify({
      status: "OK",
      success: true,
      k1,
    })
  );
}
