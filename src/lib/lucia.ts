import { Lucia } from "lucia";
import { adapter } from "./schema";
import { cache } from 'react';
import { cookies } from 'next/headers';
import type { Session, User } from "lucia";


export const lucia = new Lucia(adapter, {
  getUserAttributes: (attributes) => {
		return {
			display_name: attributes.display_name,
      profile_image_url: attributes.profile_image_url
		};
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

// IMPORTANT!
declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes
	}
}

interface DatabaseUserAttributes {
	display_name: string
  profile_image_url: string
}


export const validateRequest = cache(
  async (): Promise<{ user: User; session: Session } | { user: null; session: null }> => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
			return {
				user: null,
				session: null
			};
		}
    const result = await lucia.validateSession(sessionId);
    try {
			if (result.session && result.session.fresh) {
				const sessionCookie = lucia.createSessionCookie(result.session.id);
				cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			}
			if (!result.session) {
				const sessionCookie = lucia.createBlankSessionCookie();
				cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			}
		} catch {}
    return result
  }
)
