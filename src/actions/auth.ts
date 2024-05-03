'use server'

import { twitch } from "@/util/auth";
import { generateState } from "arctic";
import { serializeCookie } from "oslo/cookie";
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';

export async function createAuthUrl() {
  console.log("createAuthUrl");
  const scopes = ["channel:read:subscriptions", "channel:read:vips", "moderation:read", "user:read:email", "user:read:moderated_channels", "user:read:blocked_users"]
  const state = generateState();
  const url = await twitch.createAuthorizationURL(state, { scopes });
  console.log(url);
  const cookieStore = cookies()
  cookieStore.set("twitch_oauth_state", state, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 60 * 10, path: "/" });
  redirect(url.toString());
}
