import type { Config } from 'drizzle-kit';

export default {
  schema: './src/util/db_schema.ts',
  out: './drizzle',
  driver: 'pg',
} satisfies Config;