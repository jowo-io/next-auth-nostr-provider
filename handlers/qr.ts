import path from "path";
import { NextApiRequest, NextApiResponse } from "next/types";

import { Config } from "../config";

const cacheDuration = 24 * 60 * 60;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  config: Config
) {
  if (!config.qr.generateQr) throw new Error("Avatars are not enabled");

  const url = req.url?.toString();
  if (!url) throw new Error("Invalid url");

  const { name, ext } = path.parse(url);
  if (!name) throw new Error("Invalid file name");
  if (ext !== ".svg") throw new Error("Invalid file type");

  const { qr } = await config.qr.generateQr(`lightning:${name}`, config);

  res.setHeader("content-type", "image/svg+xml");
  // res.setHeader("cache-control", `public, max-age=${cacheDuration}`);
  res.end(qr);
}
