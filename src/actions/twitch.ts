'use server'
import { initDb } from '@/lib/db';
import { validateRequest } from '@/lib/lucia';
import { userTable } from '@/lib/schema';
import { makeTwitchRequest } from '@/utils/twitch';
import { eq } from 'drizzle-orm'

export async function getTwitchUser(clientUserId: string, twitchId: string) {
  //Validate user
  const { user } = await validateRequest();
  if(!user) {
    return 'Unauthorized'
  }
  //Grab user info from DB
  const db = initDb()
  const clientUser = await db.select().from(userTable).where(eq(userTable.id, clientUserId)).limit(1)
  if(clientUser.length === 0){
    return 'Unauthorized'
  }

  const response = await makeTwitchRequest('https://api.twitch.tv/helix/users?id=' + twitchId, 'GET', clientUser[0])
  if(!response){
    return 'Unauthorized'
  }

  const userResponse = await response.json();
  return userResponse.data[0];
}