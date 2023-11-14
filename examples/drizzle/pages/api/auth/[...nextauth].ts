import NextAuth, { AuthOptions } from "next-auth";

import { lightningProvider } from "../lnauth/[...lnauth]";

export const authOptions: AuthOptions = {
  providers: [lightningProvider],
};

export default NextAuth(authOptions);
