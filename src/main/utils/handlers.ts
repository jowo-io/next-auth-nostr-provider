import { NextApiRequest, NextApiResponse } from "next/types";
import { NextRequest, NextResponse } from "next/server";

import { Config } from "../config/index";

import { formatRouter } from "../utils/router";
import { cleanParams, paramsToObject } from "./params";

export type HandlerArguments = {
  query?: Record<string, string | boolean | number | undefined | null>;
  body?: Record<string, string | boolean | number | undefined | null>;
  cookies: {
    sessionToken?: string;
  };
  url: URL;
  config: Config;
};

export enum HandlerErrorCodes {
  // An attempted API request was made to an auth endpoint while already logged in.
  Forbidden = "You are already logged in.",

  // An API request was made to a non existent `lnurl-auth` API path.
  NotFound = "Path not found.",

  // Authorizing the user failed because the `lnurl-auth` callback received an invalid `signature` / `pubkey`
  Unauthorized = "You could not be signed in.",

  // The user's session has been deleted. Either their session expired or they had a failed sign in attempt and must create a new session.
  Gone = "Session not found.",

  // An API request was made to the `lnurl-auth` APIs with a missing required query param or body arguments.
  BadRequest = "Missing required query or body arguments.",

  // Generic catch-all error code when one of the above errors is not matched.
  Default = "Unable to sign in.",
}

type HandlerError = {
  // error
  error: keyof typeof HandlerErrorCodes;
  log?: string;
  message?: string;
  status?: 302 | 404 | 410 | 500;
  headers?: Record<string, string>;
};

type HandlerRedirect = {
  // redirect
  redirect: URL;
};

type HandlerResponse = {
  // response
  status?: 200;
  headers?: Record<string, string>;
  response:
    | string
    | Buffer
    | Record<string, string | boolean | number | undefined | null>;
};

export type HandlerReturn = HandlerRedirect | HandlerError | HandlerResponse;

async function pagesHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  config: Config,
  handler: (args: HandlerArguments) => Promise<HandlerReturn>
) {
  const query = cleanParams(req.query);
  const body = req.body || {};

  const url = new URL(config.siteUrl + req.url);

  const args: HandlerArguments = {
    query,
    body,
    cookies: {
      sessionToken: req.cookies["next-auth.session-token"],
    },
    url,
    config,
  };

  let output: HandlerReturn;
  try {
    output = await handler(args);
  } catch (e: any) {
    output = {
      error: "Default",
      message: HandlerErrorCodes.Default,
      status: 500,
      log: e.message,
    };
  }

  if ("error" in output) {
    if (output.log) {
      console.error(output.log);
    }

    const errorUrl = new URL(config.siteUrl + config.pages.error);
    if (config.pages.error === "/api/auth/error") {
      // if using default next-auth error screen
      errorUrl.searchParams.append("error", "OAuthSignin");
    } else {
      // otherwise use `next-auth-lightning-provider` params
      errorUrl.searchParams.append("error", output.error);
      errorUrl.searchParams.append("message", HandlerErrorCodes[output.error]);
    }

    if (output.status === 302) {
      return res.redirect(errorUrl.toString()).end();
    } else {
      Object.entries(output.headers || {}).forEach(([key, value]) =>
        res.setHeader(key, value)
      );
      res.status(output.status || 500);
      return res.send({
        message: HandlerErrorCodes[output.error],
        error: output.error,
        url: errorUrl.toString(),
      });
    }
  }

  if ("redirect" in output) {
    return res.redirect(output.redirect.toString()).end();
  }

  if ("response" in output) {
    if (
      typeof output.response === "string" ||
      output.response instanceof Buffer
    ) {
      Object.entries(output.headers || {}).forEach(([key, value]) =>
        res.setHeader(key, value)
      );
      res.status(output.status || 200);
      return res.send(output.response);
    } else if (typeof output.response === "object") {
      Object.entries(output.headers || {}).forEach(([key, value]) =>
        res.setHeader(key, value)
      );
      res.status(output.status || 200);
      return res.send(JSON.stringify(output.response));
    }
  }
}

async function appHandler(
  req: NextRequest,
  config: Config,
  handler: (args: HandlerArguments) => Promise<HandlerReturn>
) {
  const query = paramsToObject(req.nextUrl.searchParams);
  const text = await req.text();
  const params = new URLSearchParams(text);
  const body = paramsToObject(params);

  const url = new URL(req.nextUrl);

  const args: HandlerArguments = {
    query,
    body,
    cookies: {
      sessionToken: req.cookies.get("next-auth.session-token")?.value,
    },
    url,
    config,
  };

  let output: HandlerReturn;
  try {
    output = await handler(args);
  } catch (e: any) {
    output = {
      error: "Default",
      message: HandlerErrorCodes.Default,
      status: 500,
      log: e.message,
    };
  }

  if ("error" in output) {
    if (output.log) {
      console.error(output.log);
    }

    const errorUrl = new URL(config.siteUrl + config.pages.error);
    if (config.pages.error === "/api/auth/error") {
      // if using default next-auth error screen
      errorUrl.searchParams.append("error", "OAuthSignin");
    } else {
      // otherwise use `next-auth-lightning-provider` params
      errorUrl.searchParams.append("error", output.error);
      errorUrl.searchParams.append("message", HandlerErrorCodes[output.error]);
    }

    if (output.status === 302) {
      return Response.redirect(errorUrl.toString());
    } else {
      return Response.json(
        {
          message: HandlerErrorCodes[output.error],
          error: output.error,
          url: errorUrl.toString(),
        },
        {
          status: output.status || 500,
          headers: output.headers || {},
        }
      );
    }
  }

  if ("redirect" in output) {
    return Response.redirect(output.redirect.toString());
  }

  if ("response" in output) {
    if (
      typeof output.response === "string" ||
      output.response instanceof Buffer
    ) {
      return new Response(output.response, {
        status: output.status || 200,
        headers: output.headers || {},
      });
    } else if (typeof output.response === "object") {
      return Response.json(output.response, {
        status: output.status || 200,
        headers: output.headers || {},
      });
    }
  }
}

export default async function dynamicHandler(
  request: NextApiRequest | NextRequest,
  response: NextApiResponse | NextResponse,
  config: Config,
  handler: (args: HandlerArguments) => Promise<HandlerReturn>
) {
  const { req, res, routerType } = formatRouter(request, response);

  if (routerType === "APP") {
    return await appHandler(req, config, handler);
  } else {
    return await pagesHandler(req, res, config, handler);
  }
}
