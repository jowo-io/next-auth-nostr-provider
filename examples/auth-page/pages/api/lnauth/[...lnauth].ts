import NextAuthLightning, {
  LightningAuthSession,
  NextAuthLightningConfig,
} from "next-auth-lightning-provider";
import { generateQr } from "next-auth-lightning-provider/generators/qr";
import { generateName } from "next-auth-lightning-provider/generators/name";
import { generateAvatar } from "next-auth-lightning-provider/generators/avatar";

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
      const session = await storage.getItem(`k1:${k1}`);

      if (!session) throw new Error("Couldn't find item by k1");

      return session as LightningAuthSession;
    },
    async update({ k1, data }) {
      await storage.setItem(`k1:${k1}`, data);
    },
    async delete({ k1 }) {
      await storage.removeItem(`k1:${k1}`);
    },
  },
  generateQr,

  // optional
  generateName,
  generateAvatar,
  pages: {
    signIn: "/signin",
  },
  theme: {
    colorScheme: "dark",
  },
};

const { provider, handler } = NextAuthLightning(config);

export const lightningProvider = provider;

export default handler;
