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
  url,
  config,
}: HandlerArguments): Promise<HandlerReturn> {
  const pubkey = url.pathname.split("/").slice(-1)[0];
  if (!pubkey) return { error: "NotFound", status: 404 };

  let generation;
  try {
    if (!config.generateAvatar) {
      throw new Error(`The generateAvatar method is not defined.`);
    }
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
  } catch (e) {
    if (config.flags.diagnostics && config.flags.logs) {
      console.warn(
        `An error occurred in the generateAvatar method. To debug the error see: ${
          config.baseUrl + config.apis.diagnostics
        }`
      );
    }
    return { error: "Default", log: e instanceof Error ? e.message : "" };
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

  return { error: "Default" };
}
