import { NextApiRequest, NextApiResponse } from "next/types";
import { NextRequest, NextResponse } from "next/server";

import {
  callbackValidation,
  formatErrorMessage,
  errorMap,
} from "../validation/lnauth.js";

import { Config } from "../config/index.js";
import { formatRouter } from "../utils/router.js";
import { paramsToObject } from "../utils/params.js";

async function logic(
  query: Record<string, any>,
  req: NextApiRequest | NextRequest,
  config: Config
) {
  const {
    k1,
    key: pubkey,
    sig,
  } = callbackValidation.parse(query, { errorMap });

  const lnurl = require("lnurl");
  const authorize = await lnurl.verifyAuthorizationSignature(sig, k1, pubkey);
  if (!authorize) {
    throw new Error("Error in keys");
  }

  await config.storage.update(
    { k1, data: { pubkey, sig, success: true } },
    req
  );

  return {
    status: "OK",
    success: true,
    k1,
  };
}

async function pagesHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  config: Config
) {
  try {
    const result = await logic(req.query, req, config);

    res.send(JSON.stringify(result));
  } catch (e: any) {
    res.status(500).send(formatErrorMessage(e));
  }
}

async function appHandler(req: NextRequest, config: Config) {
  const query = paramsToObject(req.nextUrl.searchParams);

  const result = await logic(query, req, config);

  return Response.json(result);
}

export default async function handler(
  request: NextApiRequest | NextRequest,
  response: NextApiResponse | NextResponse,
  config: Config
) {
  const { req, res, routerType } = formatRouter(request, response);

  if (routerType === "APP") {
    return await appHandler(req, config);
  }
  return await pagesHandler(req, res, config);
}
