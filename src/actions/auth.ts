'use server'
import { lucia, validateRequest } from '@/lib/lucia';
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

export async function signOut() : Promise<ActionResult> {
  const { session } = await validateRequest();
  if(!session){
    return {
			error: "Unauthorized"
		}
  }

  await lucia.invalidateSession(session.id)

  const sessionCookie = lucia.createBlankSessionCookie()
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
  return redirect("/")
}

interface ActionResult {
	error: string | null;
}