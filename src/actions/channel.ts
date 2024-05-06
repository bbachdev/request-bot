'use server'

import * as schema from '@/util/db_schema';
import { initDb } from '@/util/db';
import { eq } from 'drizzle-orm';

export async function getChannelInfo(userId: string) {
  const db = initDb();
  const dbUser = await db.select().from(schema.channelTable).where(eq(schema.channelTable.userId, userId)).limit(1)

  return (dbUser.length > 0) ? dbUser[0] : null;
}