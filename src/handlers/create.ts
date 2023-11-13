import { NextApiRequest, NextApiResponse } from "next/types";
import lnurl from "lnurl";
import { randomBytes } from "crypto";

import { createValidation } from "../validation/lnauth.js";

import { Config } from "../config.js";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  config: Config
) {
  const { state } = createValidation.parse(req.query);

  const k1 = randomBytes(32).toString("hex");

  let inputUrl = new URL(config.siteUrl + config.apis.callback);
  inputUrl.searchParams.append("k1", k1);
  inputUrl.searchParams.append("tag", "login");

  const encoded = lnurl.encode(inputUrl.toString()).toUpperCase();

  await config.storage.set({ k1, data: { k1, state } }, req);

  res.send(
    JSON.stringify({
      status: "OK",
      success: true,
      k1,
      lnurl: encoded,
    })
  );
}
