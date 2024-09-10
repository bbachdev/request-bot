'use server'
import { Twitch } from "arctic";
import { generateState } from "arctic";

export async function signInTwitch() {
  const twitch = new Twitch(process.env.TWTICH_CLIENT_ID!, process.env.TWITCH_CLIENT_SECRET!, process.env.TWITCH_REDIRECT_URI!);
  const state = generateState();
  const scopes = ["activity:write", "read"];
  const url = twitch.createAuthorizationURL(state, scopes);

}