import NextAuth, { AuthOptions } from "next-auth";

import lnAuth from "@/utils/lnauth";

export const authOptions: AuthOptions = {
  providers: [lnAuth.provider],
};

export default NextAuth(authOptions);
