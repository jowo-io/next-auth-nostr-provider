import { HandlerArguments, HandlerReturn } from "../utils/handlers.js";

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
  if (!config.generateQr) return { error: "QRs are not enabled" };
  if (!path) return { error: "Invalid url" };

  const k1 = path.split("/").slice(-1)[0];
  if (!k1) return { error: "Invalid k1" };

  const { data, type } = await config.generateQr(`lightning:${k1}`, config);

  if (base64Regex.test(data)) {
    const buffer = data.replace(base64Regex, "");
    return {
      headers: {
        "content-type": fileTypeHeaders[type],
        "content-length": buffer.length.toString(),
        "cache-control": `public, max-age=${cacheDuration}`,
      },
      response: Buffer.from(buffer, "base64"),
    };
  } else if (type === "svg") {
    return {
      headers: {
        "content-type": fileTypeHeaders[type],
        "cache-control": `public, max-age=${cacheDuration}`,
      },
      response: data,
    };
  }

  return { error: "Something went wrong" };
}
