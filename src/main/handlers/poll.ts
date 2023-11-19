import { NextApiRequest, NextApiResponse } from "next/types";
import { NextRequest, NextResponse } from "next/server";

import {
  pollValidation,
  formatErrorMessage,
  errorMap,
} from "../validation/lnauth.js";
import { Config } from "../config/index.js";
import { formatRouter } from "../utils/router.js";

async function logic(
  body: Record<string, any>,
  req: NextApiRequest | NextRequest,
  config: Config
) {
  const { k1 } = pollValidation.parse(body, { errorMap });

  const { success = false } = await config.storage.get({ k1 }, req);

  return {
    status: "OK",
    success,
  };
}

async function pagesHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  config: Config
) {
  try {
    const result = await logic(req.body, req, config);

    res.send(JSON.stringify(result));
  } catch (e: any) {
    res.status(500).send(formatErrorMessage(e));
  }
}

async function appHandler(req: NextRequest, config: Config) {
  const body = await req.json();

  const result = await logic(body, req, config);

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
