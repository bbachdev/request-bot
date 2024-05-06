CREATE TABLE IF NOT EXISTS "channel" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "library" (
	"id" text PRIMARY KEY NOT NULL,
	"channel_id" text NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "queue" (
	"id" text PRIMARY KEY NOT NULL,
	"song_list" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "request" (
	"id" text PRIMARY KEY NOT NULL,
	"queue" text NOT NULL,
	"song" text NOT NULL,
	"twitch_user_name" text NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "song" (
	"id" text PRIMARY KEY NOT NULL,
	"song_list" text NOT NULL,
	"name" text NOT NULL,
	"artist" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "song_list" (
	"id" text PRIMARY KEY NOT NULL,
	"library" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "channel" ADD CONSTRAINT "channel_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "library" ADD CONSTRAINT "library_channel_id_channel_id_fk" FOREIGN KEY ("channel_id") REFERENCES "channel"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "queue" ADD CONSTRAINT "queue_song_list_song_list_id_fk" FOREIGN KEY ("song_list") REFERENCES "song_list"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "request" ADD CONSTRAINT "request_queue_queue_id_fk" FOREIGN KEY ("queue") REFERENCES "queue"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "request" ADD CONSTRAINT "request_song_song_id_fk" FOREIGN KEY ("song") REFERENCES "song"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "song" ADD CONSTRAINT "song_song_list_song_list_id_fk" FOREIGN KEY ("song_list") REFERENCES "song_list"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "song_list" ADD CONSTRAINT "song_list_library_library_id_fk" FOREIGN KEY ("library") REFERENCES "library"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
