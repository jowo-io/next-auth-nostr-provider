import path from "path";
import { NextApiRequest, NextApiResponse } from "next/types";

import { Config } from "../config/index.js";

const cacheDuration = 5 * 60; // short cache duration for the QR since it's short lived

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  config: Config
) {
  if (!config.generateQr) throw new Error("QRs are not enabled");

  const url = req.url?.toString();
  if (!url) throw new Error("Invalid url");

  const { name, ext } = path.parse(url);
  if (!name) throw new Error("Invalid file name");
  if (ext !== ".svg") throw new Error("Invalid file type");

  const { qr } = await config.generateQr(`lightning:${name}`, config);

  res.setHeader("content-type", "image/svg+xml");
  res.setHeader("cache-control", `public, max-age=${cacheDuration}`);
  res.end(qr);
}
