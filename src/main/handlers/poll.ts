import { NextApiRequest, NextApiResponse } from "next/types";

import {
  pollValidation,
  formatErrorMessage,
  errorMap,
} from "../validation/lnauth.js";

import { Config } from "../config/index.js";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  config: Config
) {
  try {
    const { k1 } = pollValidation.parse(req.body, { errorMap });

    const { success = false } = await config.storage.get({ k1 }, req);

    res.send(
      JSON.stringify({
        status: "OK",
        success,
      })
    );
  } catch (e: any) {
    res.status(500).send(formatErrorMessage(e));
  }
}
