import NextAuth from "next-auth";

import { lightningProvider } from "../lnauth/[...lnauth].js";

export const authOptions = {
  providers: [lightningProvider],
};

export default NextAuth(authOptions);
