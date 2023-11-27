import { HandlerArguments, HandlerReturn } from "../utils/handlers";

const cacheDuration = 24 * 60 * 60; // 1 day cache duration
const base64Regex = /^data:image\/(svg\+xml|png|jpeg|jpg);base64,/;

const fileTypeHeaders = {
  png: "image/png",
  jpg: "image/jpg",
  svg: "image/svg+xml",
};

export default async function handler({
  query,
  cookies,
  path,
  url,
  config,
}: HandlerArguments): Promise<HandlerReturn> {
  if (!config.generateAvatar) return { error: "Avatars are not enabled" };
  if (!path) return { error: "Invalid url" };

  const pubkey = path.split("/").slice(-1)[0];
  if (!pubkey) return { error: "Invalid pubkey" };

  let generation;
  try {
    generation = await config.generateAvatar(pubkey, config);
    if (
      !generation.type ||
      typeof generation.type !== "string" ||
      !fileTypeHeaders[generation.type]
    ) {
      throw new Error(
        `Invalid 'type' property returned from the generateAvatar method, expected ${Object.keys(
          fileTypeHeaders
        )}, received ${generation.type || null}.`
      );
    }
    if (!generation.data || typeof generation.data !== "string") {
      throw new Error(
        `Invalid 'data' property returned from the generateAvatar method.`
      );
    }
  } catch (e: any) {
    console.error(e);
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `An error occurred in the generateAvatar method. To debug the error see: ${
          config.siteUrl + config.apis.diagnostics
        }`
      );
    }
    return { error: "Something went wrong" };
  }

  if (base64Regex.test(generation.data)) {
    const buffer = generation.data.replace(base64Regex, "");
    return {
      headers: {
        "content-type": fileTypeHeaders[generation.type],
        "content-length": buffer.length.toString(),
        "cache-control": `public, max-age=${cacheDuration}`,
      },
      response: Buffer.from(buffer, "base64"),
    };
  } else if (generation.type === "svg") {
    return {
      headers: {
        "content-type": fileTypeHeaders[generation.type],
        "cache-control": `public, max-age=${cacheDuration}`,
      },
      response: generation.data,
    };
  }

  return { error: "Something went wrong" };
}
