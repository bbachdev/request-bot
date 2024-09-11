CREATE TABLE IF NOT EXISTS "song" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"cover_image_url" text NOT NULL,
	"times_played" integer DEFAULT 0 NOT NULL,
	"last_played" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "queue_item" (
	"id" text PRIMARY KEY NOT NULL,
	"queue_id" text NOT NULL,
	"song_id" text NOT NULL,
	"requested_by" text,
	"notes" text,
	"position" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "queue" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"queue_limit" integer DEFAULT 10 NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "song" ADD CONSTRAINT "song_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "queue_item" ADD CONSTRAINT "queue_item_queue_id_queue_id_fk" FOREIGN KEY ("queue_id") REFERENCES "public"."queue"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "queue_item" ADD CONSTRAINT "queue_item_song_id_song_id_fk" FOREIGN KEY ("song_id") REFERENCES "public"."song"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "queue" ADD CONSTRAINT "queue_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
