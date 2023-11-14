import NextAuthLightningProvider, {
  LnAuthData,
  NextAuthLightningProviderConfig,
} from "next-auth-lightning-provider";
import { kv } from "@vercel/kv";

import { env } from "@/env.mjs";

const config: NextAuthLightningProviderConfig = {
  // required
  siteUrl: env.NEXTAUTH_URL,
  secret: env.NEXTAUTH_SECRET,
  storage: {
    async set({ k1, data }) {
      await kv.set(`k1:${k1}`, data);
    },
    async get({ k1 }) {
      const results = await kv.get(`k1:${k1}`);

      if (!results) throw new Error("Couldn't find item by k1");

      return results as LnAuthData;
    },
    async update({ k1, data }) {
      await kv.set(`k1:${k1}`, data);
    },
    async delete({ k1 }) {
      await kv.del(`k1:${k1}`);
    },
  },

  // optional
  theme: {
    colorScheme: "dark",
  },
};

const { provider, handler } = NextAuthLightningProvider(config);

export const lightningProvider = provider;

export default handler;
