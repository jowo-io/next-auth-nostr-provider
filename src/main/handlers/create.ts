import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { randomBytes } from "crypto";

import { createValidation } from "../validation/lnauth";
import { HandlerArguments, HandlerReturn } from "../utils/handlers";

export default async function handler({
  body,
  cookies,
  path,
  url,
  config,
}: HandlerArguments): Promise<HandlerReturn> {
  let state;
  try {
    ({ state } = createValidation.parse(body));
  } catch (e: any) {
    return { error: "BadRequest", log: e.message };
  }

  // if an old k1 is provided, delete it
  if (typeof body?.k1 === "string") {
    try {
      await config.storage.delete({ k1: body.k1 }, path, config);
    } catch (e: any) {
      if (config.flags.logs) {
        console.error(e);
      }
      if (config.flags.diagnostics && config.flags.logs) {
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
    if (config.flags.diagnostics && config.flags.logs) {
      console.warn(
        `An error occurred in the storage.set method. To debug the error see: ${
          config.siteUrl + config.apis.diagnostics
        }`
      );
    }
    return { error: "Default", log: e.message };
  }

  return {
    response: {
      success: true,
      k1,
      lnurl: encoded,
    },
  };
}
