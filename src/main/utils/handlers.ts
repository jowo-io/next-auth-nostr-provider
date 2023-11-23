import { NextApiRequest, NextApiResponse } from "next/types";
import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";

import { Config } from "../config/index.js";

import { formatRouter } from "../utils/router.js";
import { cleanParams, paramsToObject } from "./params.js";
import { formatErrorMessage } from "../validation/lnauth.js";

export type HandlerArguments = {
  query?: Record<string, string | boolean | number | undefined | null>;
  body?: Record<string, string | boolean | number | undefined | null>;
  cookies: {
    sessionToken?: string;
  };
  path: string;
  url: URL;
  config: Config;
};

export type HandlerReturn = {
  // redirect
  redirect?: URL;

  // error
  isRedirect?: boolean;
  error?: string;

  // response
  status?: number;
  headers?: Record<string, string>;
  response?:
    | string
    | Buffer
    | Record<string, string | boolean | number | undefined | null>;
};

async function pagesHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  path: string,
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
    path,
    url,
    config,
  };

  let output: HandlerReturn;
  try {
    output = await handler(args);
  } catch (e: any) {
    console.error(e);
    output = { error: formatErrorMessage(e) };
  }

  if (output.error) {
    console.error(output.error);
    if (output.isRedirect) {
      const errorUrl = new URL(config.siteUrl + config.pages.error);
      errorUrl.searchParams.append("error", "OAuthSignin");
      errorUrl.searchParams.append("message", output.error);
      return res.redirect(errorUrl.toString()).end();
    } else {
      Object.entries(output.headers || {}).forEach(([key, value]) =>
        res.setHeader(key, value)
      );
      res.status(output.status || 500);
      return res.send(output.error);
    }
  }

  if (output.redirect) {
    return res.redirect(output.redirect.toString()).end();
  }

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

async function appHandler(
  req: NextRequest,
  path: string,
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
    path,
    url,
    config,
  };

  let output: HandlerReturn;
  try {
    output = await handler(args);
  } catch (e: any) {
    console.error(e);
    output = { error: formatErrorMessage(e) };
  }

  if (output.error) {
    if (output.isRedirect) {
      const errorUrl = new URL(config.siteUrl + config.pages.error);
      errorUrl.searchParams.append("error", "OAuthSignin");
      errorUrl.searchParams.append("message", output.error);
      redirect(errorUrl.toString());
    } else {
      return new Response(output.error, {
        status: output.status || 500,
        headers: output.headers || {},
      });
    }
  }

  if (output.redirect) {
    redirect(output.redirect.toString());
  }

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

export default async function dynamicHandler(
  request: NextApiRequest | NextRequest,
  response: NextApiResponse | NextResponse,
  config: Config,
  handler: (args: HandlerArguments) => Promise<HandlerReturn>
) {
  const { req, res, path, routerType } = formatRouter(request, response);

  if (routerType === "APP") {
    return await appHandler(req, path, config, handler);
  } else {
    return await pagesHandler(req, res, path, config, handler);
  }
}
