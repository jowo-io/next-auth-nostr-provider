import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

import { env } from "@/env.mjs";

const connection = await mysql.createConnection({
  host: env.DB_HOST,
  user: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  ...(env.NODE_ENV === "production" ? { ssl: {} } : {}),
});

const db = drizzle(connection);

export default db;
