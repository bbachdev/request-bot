import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
	id: text("id").primaryKey(),
  email: text("email").notNull(),
  twitch_id: text("twitch_id").notNull().unique()
});

export const sessionTable = pgTable("session", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => userTable.id),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date"
	}).notNull(),
  display_name: text("display_name"),
  avatar_url: text("avatar_url")
});

export const channelTable = pgTable("channel", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
});

export const libraryTable = pgTable("library", {
	id: text("id").primaryKey(),
	channelId: text("channel_id")
		.notNull()
		.references(() => channelTable.id),
	name: text("name")
		.notNull(),
});

export const songlistTable = pgTable("song_list", {
	id: text("id").primaryKey(),
	libraryId: text("library")
		.notNull()
		.references(() => libraryTable.id)
});

export const songTable = pgTable("song", {
	id: text("id").primaryKey(),
	songlistId: text("song_list")
		.notNull()
		.references(() => songlistTable.id),
	title: text("name")
		.notNull(),
	artist: text("artist")
		.notNull(),
});

export const queueTable = pgTable("queue", {
	id: text("id").primaryKey(),
	songlistId: text("song_list")
		.notNull()
		.references(() => songlistTable.id),
});

export const requestTable = pgTable("request", {
  id: text("id").primaryKey(),
  queueId: text("queue")
    .notNull()
    .references(() => queueTable.id),
  songId: text("song")
    .notNull()
    .references(() => songTable.id),
  twitchUserName: text("twitch_user_name")
    .notNull(),
  notes: text("notes")
});