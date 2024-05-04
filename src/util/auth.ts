import { Lucia } from "lucia";
import { Twitch } from "arctic";
import { DrizzleAdapter } from './db_adapter';

const adapter = DrizzleAdapter;

export const lucia = new Lucia(adapter, {
  getSessionAttributes: (attributes) => {
    return {
      displayName: attributes.display_name,
      avatarUrl: attributes.avatar_url,
    }
  },
  getUserAttributes: (attributes) => {
    return {
      twitchId: attributes.twitch_id
    }
  },
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
    DatabaseSessionAttributes: DatabaseSessionAttributes;
    DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseSessionAttributes {
  display_name: string;
  avatar_url: string;
}
interface DatabaseUserAttributes {
  twitch_id: string;
}