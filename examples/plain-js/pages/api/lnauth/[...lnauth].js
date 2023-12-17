import NextAuthLightning from "next-auth-lightning-provider";
import generateQr from "next-auth-lightning-provider/generators/qr";
import generateName from "next-auth-lightning-provider/generators/name";
import generateAvatar from "next-auth-lightning-provider/generators/avatar";

import storage from "node-persist"; // ⚠️ WARNING using node-persist is not recommended in lambda or edge environments.

await storage.init();

const config = {
  // required
  baseUrl: process.env.NEXTAUTH_URL,
  secret: process.env.NEXTAUTH_SECRET,
  storage: {
    async set({ k1, data }) {
      await storage.setItem(`k1:${k1}`, data);
    },
    async get({ k1 }) {
      return await storage.getItem(`k1:${k1}`);
    },
    async update({ k1, data }) {
      const old = await storage.getItem(`k1:${k1}`);
      await storage.updateItem(`k1:${k1}`, { ...old, ...session });
    },
    async delete({ k1 }) {
      await storage.removeItem(`k1:${k1}`);
    },
  },
  generateQr,

  // optional
  generateName,
  generateAvatar,

  theme: {
    colorScheme: "dark",
  },
};

const { provider, handler } = NextAuthLightning(config);

export const lightningProvider = provider;

export default handler;
