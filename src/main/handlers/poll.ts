import { pollValidation, errorMap } from "../validation/lnauth.js";
import { HandlerArguments, HandlerReturn } from "../utils/handlers.js";

export default async function handler({
  body,
  cookies,
  path,
  url,
  config,
}: HandlerArguments): Promise<HandlerReturn> {
  const { k1 } = pollValidation.parse(body, { errorMap });

  const { success = false } = await config.storage.get({ k1 }, path, config);

  return {
    response: {
      success,
    },
  };
}
