import LnAuthAuth, { LnAuthConfig } from "next-auth-lightning-provider";
import { eq } from "drizzle-orm";

import { lnAuthTable, LnAuth } from "@/schema/db";
import db from "@/utils/db";
import { env } from "@/env.mjs";

export const config: LnAuthConfig = {
  // required
  siteUrl: env.NEXTAUTH_URL,
  clientId: env.LIGHTNING_CLIENT_ID,
  clientSecret: env.LIGHTNING_CLIENT_SECRET,
  storage: {
    async set({ k1, data }) {
      await db.insert(lnAuthTable).values({ ...data });
    },
    async get({ k1 }) {
      const results: LnAuth[] = await db
        .select()
        .from(lnAuthTable)
        .where(eq(lnAuthTable.k1, k1));

      if (!results[0]) throw new Error("Couldn't find item by k1");

      return results[0];
    },
    async update({ k1, data }) {
      await db.update(lnAuthTable).set(data).where(eq(lnAuthTable.k1, k1));
    },
    async delete({ k1 }) {
      await db.delete(lnAuthTable).where(eq(lnAuthTable.k1, k1));
    },
  },

  // optional
  theme: {
    colorScheme: "dark",
  },
};

export default LnAuthAuth(config);
