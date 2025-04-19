// For more info, see: https://kysely.dev/docs/migrations
// Up migrations are mandatory. you must implement this function.
// Down migrations are optional. you can safely delete this function.

import { type Kysely, sql } from 'kysely'
import type { Database } from '~/database/db.schema'
import logger from '~/utils/logger'

// This is optional, recomended if you want to separate your schema.
const ADDITIONAL_SCHEMAS: string[] = []

export const up = async (db: Kysely<Database>): Promise<void> => {
  // Prepare extra schema and extensions
  await sql`SET timezone = 'UTC'`.execute(db) /* Set to UTC timezone */
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`.execute(db)
  await sql`CREATE EXTENSION IF NOT EXISTS "pg_trgm";`.execute(db)

  if (ADDITIONAL_SCHEMAS.length > 0) {
    // This is optional, recomended if you want to separate your schema.
    logger.withTag('migration').info(`Creating additional schemas: ${ADDITIONAL_SCHEMAS}`)
    for (const schema of ADDITIONAL_SCHEMAS) {
      await sql`CREATE SCHEMA IF NOT EXISTS ${sql.raw(schema)};`.execute(db)
    }
  }

  // Create auto-update function, fill updated_at column automatically.
  // CURRENT_TIMESTAMP similar to timezone('utc'::text, now())::timestamptz
  await sql`CREATE OR REPLACE FUNCTION internal.fn_updated_at_value()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `.execute(db)
}

export const down = async (db: Kysely<Database>): Promise<void> => {
  // Drop function first
  await sql`DROP FUNCTION IF EXISTS internal.fn_updated_at_value();`.execute(db)

  // Drop schemas in reverse order
  if (ADDITIONAL_SCHEMAS.length > 0) {
    for (const schema of ADDITIONAL_SCHEMAS.reverse()) {
      await sql`DROP SCHEMA IF EXISTS ${sql.raw(schema)} CASCADE;`.execute(db)
    }
  }

  // Drop extension last
  await sql`DROP EXTENSION IF EXISTS "uuid-ossp";`.execute(db)
  await sql`DROP EXTENSION IF EXISTS "pg_trgm";`.execute(db)
}
