'use server'
import { Twitch } from "arctic";
import { generateState } from "arctic";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signInTwitch() {
  const twitch = new Twitch(process.env.TWTICH_CLIENT_ID!, process.env.TWITCH_CLIENT_SECRET!, process.env.TWITCH_REDIRECT_URI!);
  const state = generateState();
  const scopes = ["activity:write", "read", "user:read:email"];
  const url = twitch.createAuthorizationURL(state, scopes);

  cookies().set("state", state, {
    secure: false, // set to false in localhost, true in prod
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10 // 10 min
  });
  
  return redirect(url.toString());
}