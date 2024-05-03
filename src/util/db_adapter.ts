import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";

import { neon } from "@neondatabase/serverless";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(process.env.DATABASE_CONNECTION_STRING!);
const db = drizzle(sql);

const userTable = pgTable("user", {
	id: text("id").primaryKey()
});

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

export const DrizzleAdapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);