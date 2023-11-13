import NextAuth, { AuthOptions } from "next-auth";

import lnurl from "@/utils/lnurl";

export const authOptions: AuthOptions = {
  providers: [lnurl.provider],
};

export default NextAuth(authOptions);
