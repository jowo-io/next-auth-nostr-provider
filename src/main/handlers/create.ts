import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { randomBytes } from "crypto";

import { createValidation, errorMap } from "../validation/lnauth";
import { HandlerArguments, HandlerReturn } from "../utils/handlers";

export default async function handler({
  body,
  cookies,
  path,
  url,
  config,
}: HandlerArguments): Promise<HandlerReturn> {
  const { state } = createValidation.parse(body, { errorMap });

  // if an old k1 is provided, delete it
  if (typeof body?.k1 === "string") {
    try {
      await config.storage.delete({ k1: body.k1 }, path, config);
    } catch (e: any) {
      console.error(e);
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `An error occurred in the storage.delete method. To debug the error see: ${
            config.siteUrl + config.apis.diagnostics
          }`
        );
      }
    }
  }

  const k1 = randomBytes(32).toString("hex");

  const callbackUrl = new URL(config.siteUrl + config.apis.callback);
  callbackUrl.searchParams.append("k1", k1);
  callbackUrl.searchParams.append("tag", "login");

  const lnurl = require("lnurl");
  const encoded = lnurl.encode(callbackUrl.toString()).toUpperCase();

  try {
    await config.storage.set({ k1, session: { k1, state } }, path, config);
  } catch (e: any) {
    console.error(e);
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `An error occurred in the storage.set method. To debug the error see: ${
          config.siteUrl + config.apis.diagnostics
        }`
      );
    }
    return { error: "Something went wrong" };
  }

  return {
    response: {
      success: true,
      k1,
      lnurl: encoded,
    },
  };
}
