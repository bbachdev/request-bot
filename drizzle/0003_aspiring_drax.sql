ALTER TABLE "user" ADD COLUMN "access_token" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "refresh_token" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "token_expires_at" timestamp;