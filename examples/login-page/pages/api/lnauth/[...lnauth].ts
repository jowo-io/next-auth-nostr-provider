import NextAuthLightning, {
  LnAuthData,
  NextAuthLightningConfig,
} from "next-auth-lightning-provider";

import { env } from "@/env.mjs";

import storage from "node-persist"; // ⚠️ WARNING using node-persist is not recommended in lambda or edge environments.

await storage.init();

const config: NextAuthLightningConfig = {
  // required
  siteUrl: env.NEXTAUTH_URL,
  secret: env.NEXTAUTH_SECRET,
  storage: {
    async set({ k1, data }) {
      await storage.setItem(`k1:${k1}`, data);
    },
    async get({ k1 }) {
      const results = await storage.getItem(`k1:${k1}`);

      if (!results) throw new Error("Couldn't find item by k1");

      return results as LnAuthData;
    },
    async update({ k1, data }) {
      await storage.setItem(`k1:${k1}`, data);
    },
    async delete({ k1 }) {
      await storage.removeItem(`k1:${k1}`);
    },
  },

  pages: {
    signIn: "/login",
  },

  // optional
  theme: {
    colorScheme: "dark",
  },
};

const { provider, handler } = NextAuthLightning(config);

export const lightningProvider = provider;

export default handler;
