import { HandlerArguments, HandlerReturn } from "../utils/handlers";

const cacheDuration = 5 * 60; // short cache duration for the QR since it's short lived
const base64Regex = /^data:image\/(png|jpeg|jpg);base64,/;

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
  const k1 = path.split("/").slice(-1)[0];
  if (!k1) return { error: "NotFound", status: 404 };

  let generation;
  try {
    if (!config.generateQr) {
      throw new Error(`The generateQr method is not defined.`);
    }
    generation = await config.generateQr(`lightning:${k1}`, config);
    if (
      !generation.type ||
      typeof generation.type !== "string" ||
      !fileTypeHeaders[generation.type]
    ) {
      throw new Error(
        `Invalid 'type' property returned from the generateQr method, expected ${Object.keys(
          fileTypeHeaders
        )}, received ${generation.type || null}.`
      );
    }
    if (!generation.data || typeof generation.data !== "string") {
      throw new Error(
        `Invalid 'data' property returned from the generateQr method.`
      );
    }
  } catch (e: any) {
    if (config.flags.diagnostics && config.flags.logs) {
      console.warn(
        `An error occurred in the generateQr method. To debug the error see: ${
          config.siteUrl + config.apis.diagnostics
        }`
      );
    }

    return { error: "Default", log: e.message };
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
