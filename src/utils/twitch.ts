import { initDb } from '@/lib/db';
import { User, userTable } from '@/lib/schema';
import { eq } from 'drizzle-orm';

//Wrapper function for making requests to the Twitch API (handles token refreshing)
//TODO: See if there's a better way to type this
export async function makeTwitchRequest<T>(endpoint: string, method: string, user: User, body?: Record<string, T>) : Promise<Response | null> {

  let response = await fetch(endpoint, {
    method: method,
    headers: {
      Authorization: `Bearer ${user.access_token}`,
      "Client-Id": process.env.TWITCH_CLIENT_ID!
    },
    body: JSON.stringify(body)
  });

  //If unauthorized, refresh token and try again
  if (response.status === 401) {
    if (!user.refresh_token) {
      console.log('No refresh token found')
      return null
    }
    response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: process.env.TWITCH_CLIENT_ID!,
        client_secret: process.env.TWITCH_CLIENT_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: user.refresh_token!
      })
    })
    if (response.status !== 400) {
      const data = await response.json()
      user.access_token = data.access_token
      user.refresh_token = data.refresh_token
      //Update user in database
      const db = initDb()
      await db.update(userTable).set(user).where(eq(userTable.twitch_id, user.twitch_id))
    }

    //Make request again
    response = await fetch(endpoint, {
      method: method,
      headers: {
        Authorization: `Bearer ${user.access_token}`,
        "Client-Id": process.env.TWITCH_CLIENT_ID!
      },
      body: JSON.stringify(body)
    });

    return response
  }
  return response
}