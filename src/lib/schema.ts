import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
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
  refresh_token: text("refresh_token")
});

export type User = typeof userTable.$inferSelect;
export type NewUser = typeof userTable.$inferInsert;

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

export const libraryTable = pgTable("song", {
	id: text("id").primaryKey(),
	user_id: text("user_id")
		.notNull()
		.references(() => userTable.id),
	title: text("title").notNull(),
	artist: text("description").notNull(),
  //Could be fun to include; perhaps not needed though
	cover_image_url: text("cover_image_url").notNull(),
  times_played: integer("times_played").notNull().default(0),
  last_played: timestamp("last_played")
});

export type Song = typeof libraryTable.$inferSelect;
export type NewSong = typeof libraryTable.$inferInsert;

export const queueTable = pgTable("queue", {
	id: text("id").primaryKey(),
	user_id: text("user_id")
		.notNull()
		.references(() => userTable.id),
  queue_limit: integer("queue_limit").notNull().default(10),
});

export type Queue = typeof queueTable.$inferSelect;
export type NewQueue = typeof queueTable.$inferInsert;

export const queueItemTable = pgTable("queue_item", {
	id: text("id").primaryKey(),
	queue_id: text("queue_id")
		.notNull()
		.references(() => queueTable.id),
	song_id: text("song_id")
		.notNull()
		.references(() => libraryTable.id),
  //See if we want to make this a reference instead
  requested_by: text("requested_by"),
  notes: text("notes"),
	position: integer("position").notNull()
});

export type QueueItemDB = typeof queueItemTable.$inferSelect;
export type NewQueueItemDB = typeof queueItemTable.$inferInsert;

export const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);
