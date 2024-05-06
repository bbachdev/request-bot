'use server'

import { lucia, twitch } from "@/util/auth";
import { validateRequest } from '@/util/auth_validate';
import { TWITCH_ACCESS_TOKEN_EXPIRES, TWITCH_ACCESS_TOKEN_NAME, TWITCH_REFRESH_TOKEN_NAME } from '@/util/twitch';
import { generateState } from "arctic";
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';

export async function createAuthUrl() {
  console.log("createAuthUrl");
  const scopes = ["channel:read:subscriptions", "channel:read:vips", "moderation:read", "user:read:email", "user:read:moderated_channels", "user:read:blocked_users"]
  const state = generateState();
  const url = await twitch.createAuthorizationURL(state, { scopes });
  console.log(url);
  const cookieStore = cookies()
  cookieStore.set("twitch_oauth_state", state, { httpOnly: true, secure: process.env.NODE_ENV === "production", path: "/" });
  redirect(url.toString());
}

export async function signOut() {
  console.log("signOut");
  const { session } = await validateRequest();
	if (!session) {
		return {
			error: "Unauthorized"
		};
	}
  const cookieStore = cookies()
  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
	cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  cookieStore.delete('twitch_oauth_state')
  cookieStore.delete(TWITCH_ACCESS_TOKEN_NAME)
  cookieStore.delete(TWITCH_REFRESH_TOKEN_NAME)
  cookieStore.delete(TWITCH_ACCESS_TOKEN_EXPIRES)
  return redirect("/")
}