import {
  boolean,
  int,
  index,
  mysqlTable,
  varchar,
  timestamp,
} from "drizzle-orm/mysql-core";

export const lnurlTable = mysqlTable(
  "lnurl",
  {
    id: int("id").primaryKey().autoincrement().notNull(),
    state: varchar("state", { length: 255 }).notNull(),
    k1: varchar("k1", { length: 255 }).notNull(),
    pubkey: varchar("pubkey", { length: 255 }),
    sig: varchar("sig", { length: 255 }),
    success: boolean("success").default(false).notNull(),
    successAt: timestamp("successAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (lnurl) => ({
    stateIndex: index("lnurl__state__idx").on(lnurl.state),
    k1Index: index("lnurl__k1__idx").on(lnurl.k1),
  })
);

export type Lnurl = typeof lnurlTable.$inferSelect;
export type NewLnurl = typeof lnurlTable.$inferInsert;
