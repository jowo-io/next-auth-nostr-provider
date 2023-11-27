import { pollValidation, errorMap } from "../validation/lnauth";
import { HandlerArguments, HandlerReturn } from "../utils/handlers";

export default async function handler({
  body,
  cookies,
  path,
  url,
  config,
}: HandlerArguments): Promise<HandlerReturn> {
  const { k1 } = pollValidation.parse(body, { errorMap });

  let session;
  try {
    session = await config.storage.get({ k1 }, path, config);
  } catch (e: any) {
    console.error(e);
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `An error occurred in the storage.get get. To debug the error see: ${
          config.siteUrl + config.apis.diagnostics
        }`
      );
    }
    return { error: "Something went wrong" };
  }

  if (!session) {
    return { error: "Session not found", status: 404 };
  }

  return {
    response: {
      success: session?.success || false,
    },
  };
}
