import { NextApiRequest, NextApiResponse } from "next/types";
import { NextRequest, NextResponse } from "next/server";

import { Config } from "../config/index.js";
import { formatRouter } from "../utils/router.js";

const cacheDuration = 5 * 60; // short cache duration for the QR since it's short lived
const base64Regex = /^data:image\/(png|jpeg|jpg);base64,/;

const fileTypeHeaders = {
  png: "image/png",
  jpg: "image/jpg",
  svg: "image/svg+xml",
};

async function logic(
  path: string,
  config: Config
): Promise<{
  headers: HeadersInit;
  data: string | Buffer;
}> {
  if (!config.generateQr) throw new Error("QRs are not enabled");
  if (!path) throw new Error("Invalid url");

  const k1 = path.split("/").slice(-1)[0];
  if (!k1) throw new Error("Invalid k1");

  const { data, type } = await config.generateQr(`lightning:${k1}`, config);

  if (base64Regex.test(data)) {
    const buffer = data.replace(base64Regex, "");
    return {
      headers: {
        "content-type": fileTypeHeaders[type],
        "content-length": buffer.length.toString(),
        "cache-control": `public, max-age=${cacheDuration}`,
      },
      data: Buffer.from(buffer, "base64"),
    };
  } else if (type === "svg") {
    return {
      headers: {
        "content-type": fileTypeHeaders[type],
        "cache-control": `public, max-age=${cacheDuration}`,
      },
      data,
    };
  }

  throw new Error("Something went wrong");
}

async function pagesHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  path: string,
  config: Config
) {
  const { data, headers } = await logic(path, config);

  Object.entries(headers).forEach(([key, value]) => res.setHeader(key, value));
  res.end(data);
}

async function appHandler(req: NextRequest, path: string, config: Config) {
  const { data, headers } = await logic(path, config);

  return new Response(data, { status: 200, headers });
}

export default async function handler(
  request: NextApiRequest | NextRequest,
  response: NextApiResponse | NextResponse,
  config: Config
) {
  const { req, res, path, routerType } = formatRouter(request, response);

  if (routerType === "APP") {
    return await appHandler(req, path, config);
  }
  return await pagesHandler(req, res, path, config);
}
