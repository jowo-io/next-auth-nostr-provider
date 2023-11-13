import LnurlAuth, { LnurlAuthConfig } from "next-auth-lightning-provider";
import { eq } from "drizzle-orm";

import { lnurlTable, Lnurl } from "@/schema/db";
import db from "@/utils/db";
import { env } from "@/env.mjs";

export const config: LnurlAuthConfig = {
  // required
  siteUrl: env.NEXTAUTH_URL,
  clientId: env.LIGHTNING_CLIENT_ID,
  clientSecret: env.LIGHTNING_CLIENT_SECRET,
  storage: {
    async set({ k1, data }) {
      await db.insert(lnurlTable).values({ ...data });
    },
    async get({ k1 }) {
      const results: Lnurl[] = await db
        .select()
        .from(lnurlTable)
        .where(eq(lnurlTable.k1, k1));

      if (!results[0]) throw new Error("Couldn't find item by k1");

      return results[0];
    },
    async update({ k1, data }) {
      await db.update(lnurlTable).set(data).where(eq(lnurlTable.k1, k1));
    },
    async delete({ k1 }) {
      await db.delete(lnurlTable).where(eq(lnurlTable.k1, k1));
    },
  },

  // optional
  theme: {
    colorScheme: "dark",
  },
};

export default LnurlAuth(config);
