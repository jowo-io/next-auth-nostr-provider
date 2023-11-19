import { NextApiRequest, NextApiResponse } from "next/types";
import { NextRequest, NextResponse } from "next/server";

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
import { formatRouter } from "../utils/router.js";
import { paramsToObject } from "../utils/params.js";

const handleAuthCode = async function (
  k1: string,
  req: NextApiRequest | NextRequest,
  config: Config
) {
  const { pubkey, success } = await config.storage.get({ k1 }, req);

  if (!success) throw new Error("Login was not successful");

  await config.storage.delete({ k1 }, req);

  return pubkey;
};

const handleRefreshToken = async function (
  refreshToken: string,
  req: NextApiRequest | NextRequest,
  config: Config
) {
  const { pubkey } = await verifyRefreshToken(refreshToken, config);

  return pubkey;
};

async function logic(
  body: Record<string, any>,
  req: NextApiRequest | NextRequest,
  config: Config
) {
  const {
    grant_type: grantType,
    code: k1,
    refresh_token: refreshToken,
  } = tokenValidation.parse(body, { errorMap });

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

  return {
    status: "OK",
    success: true,
    ...token,
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
  const text = await req.text();
  const searchParams = new URLSearchParams(text);
  const body = paramsToObject(searchParams);

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
