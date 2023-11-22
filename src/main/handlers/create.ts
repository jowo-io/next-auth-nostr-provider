import { randomBytes } from "crypto";

import { createValidation, errorMap } from "../validation/lnauth.js";
import { HandlerArguments, HandlerReturn } from "../utils/handlers.js";

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
    await config.storage.delete({ k1: body.k1 }, path, config);
  }

  const k1 = randomBytes(32).toString("hex");

  let inputUrl = new URL(config.siteUrl + config.apis.callback);
  inputUrl.searchParams.append("k1", k1);
  inputUrl.searchParams.append("tag", "login");

  const lnurl = require("lnurl");
  const encoded = lnurl.encode(inputUrl.toString()).toUpperCase();

  await config.storage.set({ k1, session: { k1, state } }, path, config);

  return {
    response: {
      success: true,
      k1,
      lnurl: encoded,
    },
  };
}
