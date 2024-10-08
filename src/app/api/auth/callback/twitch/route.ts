import { OAuth2RequestError } from "arctic";
import { cookies } from 'next/headers';
import { Twitch } from "arctic";
import { eq } from 'drizzle-orm'
import { userTable, User } from '@/lib/schema'
import { generateIdFromEntropySize } from "lucia";
import { lucia } from '@/lib/lucia';
import { NextRequest } from 'next/server';
import { initDb } from '@/lib/db';


export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const storedState = cookies().get("state")?.value
  if (code === null || storedState === null || state !== storedState) {
    // 400
    throw new Error("Invalid request");
  }

  try {
    const clientId = process.env.TWITCH_CLIENT_ID!;
    const twitch = new Twitch(clientId, process.env.TWITCH_CLIENT_SECRET!, process.env.TWITCH_REDIRECT_URI!);
    const tokens = await twitch.validateAuthorizationCode(code);
    const accessToken = tokens.accessToken();
    const refreshToken = tokens.refreshToken();

    const response = await fetch("https://api.twitch.tv/helix/users", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Client-Id": clientId
      }
    });
    const userResponse = await response.json();
    const userData = userResponse.data[0];
    
    //Check if user exists in DB
    const db = initDb()

    let user: User | undefined = undefined
    const existingUser = await db.select().from(userTable).where(eq(userTable.twitch_id, userData.id))
    if(existingUser.length > 0){
      //Update user with new tokens and, if changed, name and profile image
      existingUser[0].display_name = userData.display_name
      existingUser[0].profile_image_url = userData.profile_image_url
      existingUser[0].access_token = accessToken
      existingUser[0].refresh_token = refreshToken
      await db.update(userTable).set(existingUser[0]).where(eq(userTable.twitch_id, userData.id))

      //Set user
      user = existingUser[0]
    }else{
      //If not found, create user
      user = {
        id: generateIdFromEntropySize(10),
        twitch_id: userData.id,
        display_name: userData.display_name,
        profile_image_url: userData.profile_image_url,
        access_token: accessToken,
        refresh_token: refreshToken,
      }
      await db.insert(userTable).values(user)
    }
    //Log in user
    const session = await lucia.createSession(user.id, {display_name: userData.display_name, profile_image_url: userData.profile_image_url});
		const sessionCookie = lucia.createSessionCookie(session.id);
    return new Response(null, {
			status: 302,
			headers: {
				Location: "/",
				"Set-Cookie": sessionCookie.serialize()
			}
		});
  }catch(e){
    console.log("Error: ", e)
    if (e instanceof OAuth2RequestError) {
      // Invalid authorization code, credentials, or redirect URI
      return new Response(null, {
				status: 400
			});

    }
    return new Response(null, {
			status: 500
		});
  }
}