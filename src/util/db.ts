import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

export function initDb() {
  const sql = neon(process.env.DATABASE_CONNECTION_STRING!);
  const db = drizzle(sql);
  return db;
}