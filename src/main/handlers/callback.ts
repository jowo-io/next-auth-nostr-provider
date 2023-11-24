import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { callbackValidation, errorMap } from "../validation/lnauth";
import { HandlerArguments, HandlerReturn } from "../utils/handlers";

export default async function handler({
  query,
  cookies,
  path,
  url,
  config,
}: HandlerArguments): Promise<HandlerReturn> {
  const {
    k1,
    key: pubkey,
    sig,
  } = callbackValidation.parse(query, { errorMap });

  const lnurl = require("lnurl");
  const authorize = await lnurl.verifyAuthorizationSignature(sig, k1, pubkey);

  if (!authorize) {
    return { error: "Error in keys" };
  }

  try {
    await config.storage.update(
      { k1, session: { pubkey, sig, success: true } },
      path,
      config
    );
  } catch (e) {
    console.error(e);
    if (process.env.NODE_ENV === "development")
      console.warn(
        `An error occurred in the storage.update method. To debug the error see: ${
          config.siteUrl + config.apis.diagnostics
        }`
      );
    return { error: "Something went wrong" };
  }

  return {
    response: {
      status: "OK", // important status, confirms to wallet that auth was success
      success: true,
      k1,
    },
  };
}
