// Imports
// =================================
import { relations, sql } from "drizzle-orm";
import { text, pgTableCreator, timestamp } from "drizzle-orm/pg-core";

// Config
// =================================
/**
 *
 */
export const createTable = pgTableCreator((name) => name);

// Tables
// =================================
/**
 * Main user table
 */
export const userTable = createTable("user", {
  id: text("id")
    .default(sql`gen_random_uuid()`)
    .notNull()
    .primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique(),
  provider_id: text("provider_id"),
});

/**
 * Main account table
 */
export const accountTable = createTable("account", {
  id: text("id")
    .default(sql`gen_random_uuid()`)
    .notNull()
    .primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  provider: text("provider"),
  providerAccountId: text("provider_account_id"),
  refreshToken: text("refresh_token"),
  accessToken: text("access_token"),
  expiresAt: text("expires_at"),
  tokenType: text("token_type"),
  scope: text("scope")
});

export const userRelations = relations(userTable, ({ many }) => ({
  accounts: many(accountTable),
}));

export const accountRelations = relations(accountTable, ({ one }) => ({
  user: one(userTable, {
    fields: [accountTable.userId],
    references: [userTable.id]
  }),
}));

/**
 * Main session table
 */
export const sessionTable = createTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
