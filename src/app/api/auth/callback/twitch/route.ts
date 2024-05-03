import * as schema from '@/util/db_schema';
import { cookies } from 'next/headers'
import { twitch, lucia } from "@/util/auth";
import { OAuth2RequestError, TwitchTokens } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { initDb } from '@/util/db';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';


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
          "Client-Id": process.env.TWITCH_API_CLIENT_ID!
        }
      });
      const userRes = await response.json();

      const user = userRes.data[0]

      // Check if user already exists, and log in if so
      const db = initDb();

      const dbUser = await db.select().from(schema.userTable).where(eq(schema.userTable.twitch_id, user.id)).limit(1)
      if(dbUser.length > 0) {
        const session = await lucia.createSession(dbUser[0].id, {
          display_name: user.display_name,
          avatar_url: user.profile_image_url,
        });

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