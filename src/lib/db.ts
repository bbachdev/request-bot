import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js'

export function initDb() {
  const connectionString = process.env.DATABASE_URL!

  const client = postgres(connectionString)
  const db = drizzle(client);
  return db;
}