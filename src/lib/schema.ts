import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { date, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL!

const client = postgres(connectionString, { prepare: false })
const db = drizzle(client);

export const userTable = pgTable("user", {
	id: text("id").primaryKey(),
  twitch_id: text("twitch_id").notNull(),
  display_name: text("display_name").notNull(),
  profile_image_url: text("profile_image_url"),
  access_token: text("access_token"),
  refresh_token: text("refresh_token"),
  token_expires_at: timestamp("token_expires_at"),
  last_updated: date("last_updated").defaultNow()
});

export type NewUser = typeof userTable.$inferInsert;
export type User = typeof userTable.$inferSelect;

export const sessionTable = pgTable("session", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => userTable.id),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date"
	}).notNull()
});

export const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);
