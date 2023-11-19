import { AuthOptions } from "next-auth";

import { lightningProvider } from "../../lnauth/[...lnauth]/config";

export const authOptions: AuthOptions = {
  providers: [lightningProvider],
};
