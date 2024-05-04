import * as schema from '@/util/db_schema';
import { cookies } from 'next/headers'
import { twitch, lucia } from "@/util/auth";
import { OAuth2RequestError, TwitchTokens } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { initDb } from '@/util/db';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { TWITCH_ACCESS_TOKEN_NAME, TWITCH_REFRESH_TOKEN_NAME } from '@/util/twitch';


export async function GET(request: Request) {
    const cookieStore = cookies()
    const url = new URL(request.url);
    const state = url.searchParams.get("state");
    const code = url.searchParams.get("code");

    const storedState = cookieStore.get("twitch_oauth_state");

    // Verify State
	  if (!state || !storedState || !code || storedState?.value !== state) {
      redirect("/");
	  }

    try {
      const tokens: TwitchTokens = await twitch.validateAuthorizationCode(code);
      const response = await fetch("https://api.twitch.tv/helix/users", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
          "Client-Id": process.env.TWITCH_API_CLIENT_ID!,
          "state": storedState?.value
        }
      });
      const userRes = await response.json();

      const user = userRes.data[0]

      // Check if user already exists, and log in if so
      const db = initDb();

      console.log('Access Token:',tokens.accessToken);
      console.log('Refresh Token:',tokens.refreshToken);

      const dbUser = await db.select().from(schema.userTable).where(eq(schema.userTable.twitch_id, user.id)).limit(1)
      if(dbUser.length > 0) {
        const session = await lucia.createSession(dbUser[0].id, {
          display_name: user.display_name,
          avatar_url: user.profile_image_url,
        });

        console.log('Session:',session);

        const sessionCookie = lucia.createSessionCookie(session.id);

        cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      }else {
          // Else, create user
        const newUserId = generateIdFromEntropySize(16);

        type NewUser = typeof schema.userTable.$inferInsert;

        const newUser: NewUser = {
          id: newUserId,
          email: user.email,
          twitch_id: user.id
        };

        await db.insert(schema.userTable).values(newUser);

        const session = await lucia.createSession(newUserId, {
          display_name: user.display_name,
          avatar_url: user.profile_image_url,
        });
        const sessionCookie = lucia.createSessionCookie(session.id);

        cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      }
      cookieStore.set(TWITCH_ACCESS_TOKEN_NAME, tokens.accessToken, { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", maxAge: 60 * 10, path: "/" });
      cookieStore.set(TWITCH_REFRESH_TOKEN_NAME, tokens.refreshToken, { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", maxAge: 60 * 10, path: "/" });
    }
    catch (error) {
      console.log('Error:',error);
      if (error instanceof OAuth2RequestError) {
        // bad verification code, invalid credentials, etc
        return new Response(null, {
          status: 400
        });
      }
      return new Response(null, {
        status: 500
      });
    }
    finally {
      return redirect('/');
    }
}