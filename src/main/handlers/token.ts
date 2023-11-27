import { tokenValidation, errorMap } from "../validation/lnauth";
import {
  generateIdToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { HandlerArguments, HandlerReturn } from "../utils/handlers";

export default async function handler({
  body,
  cookies,
  path,
  url,
  config,
}: HandlerArguments): Promise<HandlerReturn> {
  const {
    grant_type: grantType,
    code: k1,
    refresh_token: refreshToken,
  } = tokenValidation.parse(body, { errorMap });

  let pubkey: string;
  if (grantType === "authorization_code") {
    if (!k1) return { error: "Missing code" };
    let session;
    try {
      session = await config.storage.get({ k1 }, path, config);
    } catch (e: any) {
      console.error(e);
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `An error occurred in the storage.get method. To debug the error see: ${
            config.siteUrl + config.apis.diagnostics
          }`
        );
      }
      return { error: "Something went wrong" };
    }
    if (!session?.success) return { error: "Login was not successful" };
    if (!session?.pubkey) return { error: "Missing pubkey" };
    pubkey = session.pubkey;

    try {
      await config.storage.delete({ k1 }, path, config);
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
  } else if (grantType === "refresh_token") {
    if (!refreshToken) return { error: "Missing refresh token" };
    const data = await verifyRefreshToken(refreshToken, config);
    if (!data.pubkey) return { error: "Missing pubkey" };
    pubkey = data.pubkey;
  } else {
    return { error: "Invalid grant type" };
  }

  let name = "";
  if (config.generateName) {
    try {
      name = (await config.generateName(pubkey, config))?.name;
      if (!name || typeof name !== "string") {
        throw new Error(
          `Invalid 'name' property returned from the generateName method.`
        );
      }
    } catch (e: any) {
      console.error(e);
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `An error occurred in the generateName method. To debug the error see: ${
            config.siteUrl + config.apis.diagnostics
          }`
        );
      }
      return { error: "Something went wrong" };
    }
  }
  const image = config?.generateAvatar
    ? `${config.siteUrl}${config.apis.avatar}/${pubkey}`
    : "";

  const token = {
    // meta
    token_type: "Bearer",
    scope: "user",

    // id token
    expires_in: config.intervals.idToken,
    expires_at: Math.floor(Date.now() / 1000 + config.intervals.idToken),
    id_token: await generateIdToken(pubkey, name, image, config),

    // refresh token
    refresh_token: await generateRefreshToken(pubkey, config),
  };

  return {
    response: {
      success: true,
      ...token,
    },
  };
}
