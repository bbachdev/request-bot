'use server'

import { initDb } from '@/lib/db'
import { userTable } from '@/lib/schema'
import { eq } from 'drizzle-orm'

export async function getUserInfo(display_name: string) {
  const db = initDb()
  const queryResults = await db.select({twitch_id: userTable.twitch_id, display_name: userTable.display_name, profile_image_url: userTable.profile_image_url}).from(userTable).where(eq(userTable.display_name, display_name)).limit(1)
  if(queryResults.length === 0){
    return null
  }
  return queryResults[0]
}

// async function getQueue(twitch_id: string) {

// }