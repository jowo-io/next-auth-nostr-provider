import { NextApiRequest, NextApiResponse } from "next/types";

import { pingValidation } from "../validation/lnurl";

import { Config } from "../config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  config: Config
) {
  const { k1 } = pingValidation.parse(req.body);

  const { success = false } = await config.storage.get({ k1 }, req);

  res.send(
    JSON.stringify({
      status: "OK",
      success,
    })
  );
}
