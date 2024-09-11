import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";

import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL!

const client = postgres(connectionString, { prepare: false })
const db = drizzle(client);

export const userTable = pgTable("user", {
	id: text("id").primaryKey(),
  twitch_id: text("twitch_id").notNull()
});

export type NewUser = typeof userTable.$inferInsert;
export type User = typeof userTable.$inferSelect;

const sessionTable = pgTable("session", {
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
