import { Lucia } from "lucia";
import { Twitch } from "arctic";
import { DrizzleAdapter } from './db_adapter';

const adapter = DrizzleAdapter;

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		// this sets cookies with super long expiration
		// since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
		expires: false,
		attributes: {
			// set to `true` when using HTTPS
			secure: process.env.NODE_ENV === "production"
		}
	}
});

export const twitch = new Twitch(process.env.TWITCH_API_CLIENT_ID!, process.env.TWITCH_API_SECRET!, process.env.TWITCH_REDIRECT_URI!);

// IMPORTANT!
declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
	}
}