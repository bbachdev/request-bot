import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { userTable, sessionTable } from "@/util/db_schema";
import { initDb } from './db';

const db = initDb();

export const DrizzleAdapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);