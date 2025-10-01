// For more info, see: https://kysely.dev/docs/migrations
// Up migrations are mandatory. you must implement this function.
// Down migrations are optional. you can safely delete this function.

import { type Kysely, sql } from 'kysely'
import * as dbHelper from '~/database/db.helper'
import type { Database } from '~/database/db.schema'

export const up = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema('internal')

  // Create table
  await db.schema
    .createTable('rate_limits')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().notNull().defaultTo(dbHelper.DEFAULT_UUID_v7)
    )
    .addColumn('key', 'text', (col) => col.notNull())
    .addColumn('context', 'text', (col) =>
      col.notNull().check(sql`context IN ('ip', 'user', 'email', 'global', 'functions')`)
    )
    .addColumn('points', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('limit', 'integer', (col) => col.notNull())
    .addColumn('window', 'integer', (col) => col.notNull())
    .addColumn('expires_at', 'integer', (col) => col.notNull())
    .addColumn('blocked_until', 'integer')
    .$call(dbHelper.addColumnTimestamps) // [created_at, updated_at]
    .modifyEnd(sql`USING heap`)
    .ifNotExists()
    .execute()

  // Create auto-update trigger
  await dbHelper.createTriggerUpdatedAt('rate_limits', 'internal').execute(db)

  // Create required indexes
  await db.schema
    .createIndex('idx_rate_limits_created_at')
    .on('rate_limits')
    .column('created_at')
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_rate_limits_updated_at')
    .on('rate_limits')
    .column('updated_at')
    .where(sql<boolean>`updated_at IS NOT NULL`)
    .using('btree')
    .ifNotExists()
    .execute()

  /**
   * Unique compound index for rate limit lookups
   * Ensures unique rate limit tracking per key and context
   */
  await db.schema
    .createIndex('idx_rate_limits_key')
    .on('rate_limits')
    .columns(['key', 'context'])
    .unique()
    .ifNotExists()
    .execute()

  /**
   * Index for cleanup and block status checks
   * Optimizes queries that manage rate limit expiration and blocking
   */
  await db.schema
    .createIndex('idx_rate_limits_cleanup')
    .on('rate_limits')
    .columns(['expires_at', 'blocked_until'])
    .ifNotExists()
    .execute()

  /**
   * PostgreSQL function for automatic cleanup of expired rate limits
   * Maintains database hygiene by removing expired entries
   */
  await sql`
    CREATE OR REPLACE FUNCTION internal.cleanup_expired_rate_limits()
    RETURNS TRIGGER AS $$
    BEGIN
      DELETE FROM internal.rate_limits
      WHERE expires_at < EXTRACT(EPOCH FROM NOW())
      AND blocked_until IS NULL;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `.execute(db)

  await sql`
    CREATE TRIGGER trg_rate_limits_cleanup AFTER INSERT ON internal.rate_limits
    FOR EACH ROW EXECUTE FUNCTION internal.cleanup_expired_rate_limits();
  `.execute(db)
}

export const down = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema('internal')

  // Drop trigger and function first (with correct schema prefix)
  await sql`DROP TRIGGER IF EXISTS trg_rate_limits_cleanup ON internal.rate_limits;`.execute(db)
  await sql`DROP FUNCTION IF EXISTS internal.cleanup_expired_rate_limits();`.execute(db)

  // Drop other triggers and indexes
  await dbHelper.dropTriggerUpdatedAt('rate_limits', 'internal').execute(db)
  await db.schema.dropIndex('idx_rate_limits_cleanup').ifExists().execute()
  await db.schema.dropIndex('idx_rate_limits_key').ifExists().execute()
  await db.schema.dropIndex('idx_rate_limits_updated_at').ifExists().execute()
  await db.schema.dropIndex('idx_rate_limits_created_at').ifExists().execute()

  // Drop table at the end
  await db.schema.dropTable('rate_limits').ifExists().execute()
}
