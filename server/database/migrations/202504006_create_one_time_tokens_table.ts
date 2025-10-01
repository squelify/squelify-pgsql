// For more info, see: https://kysely.dev/docs/migrations
// Up migrations are mandatory. you must implement this function.
// Down migrations are optional. you can safely delete this function.

import { type Kysely, sql } from 'kysely'
import * as dbHelper from '~/database/db.helper'
import type { Database } from '~/database/db.schema'

const TABLE_NAME = 'one_time_tokens'
const SCHEMA = 'internal'

export const up = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema(SCHEMA)

  // Create table
  await db.schema
    .createTable(TABLE_NAME)
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().notNull().defaultTo(dbHelper.DEFAULT_UUID_v7)
    )
    .addColumn('user_id', 'uuid', (col) =>
      col.references('users.id').onDelete('cascade').defaultTo(null)
    )
    .addColumn('token_type', 'text', (col) => col.notNull())
    .addColumn('token_hash', 'text', (col) => col.notNull().unique())
    .addColumn('relates_to', 'text', (col) => col.notNull())
    .addColumn('metadata', 'jsonb', (col) => col.defaultTo(null))
    .$call(dbHelper.addColumnTimestamps)
    .addColumn('expires_at', 'timestamptz', (col) =>
      col.notNull().check(sql`expires_at > CURRENT_TIMESTAMP`)
    )
    .addColumn('last_sent_at', 'timestamptz', (col) => col.defaultTo(null))
    .modifyEnd(sql`USING heap`)
    .ifNotExists()
    .execute()

  // Create required indexes
  await db.schema
    .createIndex('idx_one_time_tokens_user_id')
    .on(TABLE_NAME)
    .column('user_id')
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_one_time_tokens_token_type')
    .on(TABLE_NAME)
    .column('token_type')
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_one_time_tokens_expires_at')
    .on(TABLE_NAME)
    .column('expires_at')
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_one_time_tokens_created_at')
    .on(TABLE_NAME)
    .column('created_at')
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_one_time_tokens_updated_at')
    .on(TABLE_NAME)
    .column('updated_at')
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_one_time_tokens_relates_to_lower')
    .on(TABLE_NAME)
    .expression(sql`lower(relates_to)`)
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_one_time_tokens_metadata_gin')
    .on(TABLE_NAME)
    .using('gin')
    .column('metadata')
    .ifNotExists()
    .execute()
}

export const down = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema(SCHEMA)
  await db.schema.dropIndex('idx_one_time_tokens_metadata_gin').ifExists().execute()
  await db.schema.dropIndex('idx_one_time_tokens_relates_to_lower').ifExists().execute()
  await db.schema.dropIndex('idx_one_time_tokens_updated_at').ifExists().execute()
  await db.schema.dropIndex('idx_one_time_tokens_created_at').ifExists().execute()
  await db.schema.dropIndex('idx_one_time_tokens_expires_at').ifExists().execute()
  await db.schema.dropIndex('idx_one_time_tokens_token_type').ifExists().execute()
  await db.schema.dropIndex('idx_one_time_tokens_user_id').ifExists().execute()
  await db.schema.dropTable(TABLE_NAME).ifExists().execute()
}
