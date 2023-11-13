import { NextApiRequest, NextApiResponse } from "next/types";

import { pollValidation } from "../validation/lnauth.js";

import { Config } from "../config/index.js";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  config: Config
) {
  const { k1 } = pollValidation.parse(req.body);

  const { success = false } = await config.storage.get({ k1 }, req);

  res.send(
    JSON.stringify({
      status: "OK",
      success,
    })
  );
}
