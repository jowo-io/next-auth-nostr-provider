import { callbackValidation, errorMap } from "../validation/lnauth.js";
import { HandlerArguments, HandlerReturn } from "../utils/handlers.js";

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

  await config.storage.update(
    { k1, session: { pubkey, sig, success: true } },
    path,
    config
  );

  return {
    response: {
      status: "OK", // important status, confirms to wallet that auth was success
      success: true,
      k1,
    },
  };
}
