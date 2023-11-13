import type { Config } from "drizzle-kit";

export default {
  schema: "./schema/db/index.ts",
  out: "./drizzle",
} satisfies Config;
