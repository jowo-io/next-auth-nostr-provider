import { callbackValidation } from "../validation/lnauth";
import { HandlerArguments, HandlerReturn } from "../utils/handlers";

export default async function handler({
  query,
  cookies,
  url,
  config,
}: HandlerArguments): Promise<HandlerReturn> {
  let k1, pubkey, sig;
  try {
    ({ k1, key: pubkey, sig } = callbackValidation.parse(query));
  } catch (e: any) {
    return { error: "BadRequest", log: e.message };
  }

  const lnurlVerifyAuthorizationSignature = // @ts-ignore
    (await import("lnurl/lib/verifyAuthorizationSignature.js")).default;

  let authorize;
  try {
    authorize = await lnurlVerifyAuthorizationSignature(sig, k1, pubkey);
  } catch (e: any) {
    return { error: "Unauthorized", log: e.message };
  }

  if (!authorize) {
    try {
      await config.storage.delete({ k1 }, url, config);
    } catch (e: any) {
      if (config.flags.logs) {
        console.error(e);
      }
      if (config.flags.diagnostics && config.flags.logs) {
        console.warn(
          `An error occurred in the storage.delete method. To debug the error see: ${
            config.baseUrl + config.apis.diagnostics
          }`
        );
      }
    }

    return { error: "Unauthorized" };
  }

  try {
    await config.storage.update(
      { k1, session: { pubkey, sig, success: true } },
      url,
      config
    );
  } catch (e: any) {
    if (config.flags.diagnostics && config.flags.logs) {
      console.warn(
        `An error occurred in the storage.update method. To debug the error see: ${
          config.baseUrl + config.apis.diagnostics
        }`
      );
    }
    return { error: "Default", log: e.message };
  }

  return {
    response: {
      status: "OK", // important status, confirms to wallet that auth was success
      success: true,
      k1,
    },
  };
}
