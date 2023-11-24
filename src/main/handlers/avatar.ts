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

  const { data, type } = await config.generateAvatar(pubkey, config);

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
