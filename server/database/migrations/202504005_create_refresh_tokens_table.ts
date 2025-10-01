// For more info, see: https://kysely.dev/docs/migrations
// Up migrations are mandatory. you must implement this function.
// Down migrations are optional. you can safely delete this function.

import { type Kysely, sql } from 'kysely'
import * as dbHelper from '~/database/db.helper'
import type { Database } from '~/database/db.schema'

const TABLE_NAME = 'refresh_tokens'
const SCHEMA = 'internal'

export const up = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema(SCHEMA)

  // Create table
  await db.schema
    .createTable(TABLE_NAME)
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`uuidv7()`))
    .addColumn('user_id', 'uuid', (col) => col.notNull().references('users.id').onDelete('cascade'))
    .addColumn('session_id', 'uuid', (col) =>
      col.references('sessions.id').onDelete('cascade').defaultTo(null)
    )
    .addColumn('token_hash', 'bytea', (col) => col.notNull().unique())
    .addColumn('ip_address', sql`inet`, (col) => col.defaultTo(null))
    .addColumn('user_agent', 'text', (col) => col.defaultTo(null))
    .addColumn('last_used_at', 'timestamptz', (col) =>
      col.defaultTo(null).check(sql`last_used_at > created_at`)
    )
    .addColumn('expires_at', 'timestamptz', (col) =>
      col.notNull().check(sql`expires_at > CURRENT_TIMESTAMP`)
    )
    .$call(dbHelper.addColumnTimestamps)
    .addColumn('revoked_at', 'timestamptz', (col) => col.defaultTo(null))
    .addColumn('revoked_by', 'uuid', (col) =>
      col.references('users.id').onDelete('set null').defaultTo(null)
    )
    .modifyEnd(sql`USING heap`)
    .ifNotExists()
    .execute()

  // Create required indexes and auto-update trigger
  await dbHelper.createTriggerUpdatedAt(TABLE_NAME, SCHEMA).execute(db)

  await db.schema
    .createIndex('idx_refresh_tokens_user_id')
    .on(TABLE_NAME)
    .column('user_id')
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_refresh_tokens_session_id')
    .on(TABLE_NAME)
    .column('session_id')
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_refresh_tokens_expires_at')
    .on(TABLE_NAME)
    .column('expires_at')
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_refresh_tokens_last_used_at')
    .on(TABLE_NAME)
    .column('last_used_at')
    .where(sql<boolean>`last_used_at IS NOT NULL`)
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_refresh_tokens_revoked_at')
    .on(TABLE_NAME)
    .column('revoked_at')
    .where(sql<boolean>`revoked_at IS NOT NULL`)
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_refresh_tokens_created_at')
    .on(TABLE_NAME)
    .column('created_at')
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_refresh_tokens_ip_address')
    .on(TABLE_NAME)
    .column('ip_address')
    .where(sql<boolean>`ip_address IS NOT NULL`)
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_refresh_tokens_user_agent')
    .on(TABLE_NAME)
    .column('user_agent')
    .where(sql<boolean>`user_agent IS NOT NULL`)
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_refresh_tokens_token_hash')
    .unique()
    .on(TABLE_NAME)
    .column('token_hash')
    .using('btree')
    .ifNotExists()
    .execute()
}

export const down = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema(SCHEMA)
  await db.schema.dropIndex('idx_refresh_tokens_token_hash').ifExists().execute()
  await db.schema.dropIndex('idx_refresh_tokens_user_agent').ifExists().execute()
  await db.schema.dropIndex('idx_refresh_tokens_ip_address').ifExists().execute()
  await db.schema.dropIndex('idx_refresh_tokens_created_at').ifExists().execute()
  await db.schema.dropIndex('idx_refresh_tokens_revoked_at').ifExists().execute()
  await db.schema.dropIndex('idx_refresh_tokens_last_used_at').ifExists().execute()
  await db.schema.dropIndex('idx_refresh_tokens_expires_at').ifExists().execute()
  await db.schema.dropIndex('idx_refresh_tokens_session_id').ifExists().execute()
  await db.schema.dropIndex('idx_refresh_tokens_user_id').ifExists().execute()
  await dbHelper.dropTriggerUpdatedAt(TABLE_NAME, SCHEMA).execute(db)
  await db.schema.dropTable(TABLE_NAME).ifExists().execute()
}
