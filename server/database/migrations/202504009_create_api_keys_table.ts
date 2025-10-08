// For more info, see: https://kysely.dev/docs/migrations
// Up migrations are mandatory. you must implement this function.
// Down migrations are optional. you can safely delete this function.

import { type Kysely, sql } from 'kysely'
import * as dbHelper from '~/database/db.helper'
import type { Database } from '~/database/db.schema'

const TABLE_NAME = 'api_keys'
const SCHEMA = 'internal'

export const up = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema(SCHEMA)

  // Create table
  await db.schema
    .createTable(TABLE_NAME)
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().notNull().defaultTo(dbHelper.DEFAULT_UUID_v7)
    )
    .addColumn('user_id', 'uuid', (col) => col.notNull().references('users.id').onDelete('cascade'))
    .addColumn('key_name', 'text', (col) => col.notNull())
    .addColumn('key_hash', 'text', (col) => col.notNull().unique())
    .addColumn('key_prefix', 'text', (col) => col.notNull())
    .addColumn('permissions', 'jsonb', (col) => col.notNull())
    .addColumn('scope_restrictions', 'jsonb', (col) => col.defaultTo(null))
    .addColumn('usage_count', 'bigint', (col) => col.notNull().defaultTo(0))
    .addColumn('last_used_at', 'timestamptz', (col) => col.defaultTo(null))
    .addColumn('expires_at', 'timestamptz', (col) =>
      col.defaultTo(null).check(sql`expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP`)
    )
    .addColumn('is_active', 'boolean', (col) => col.notNull().defaultTo(true))
    .$call(dbHelper.addColumnTimestamps)
    .modifyEnd(sql`USING heap`)
    .ifNotExists()
    .execute()

  await dbHelper.createTriggerUpdatedAt(TABLE_NAME, SCHEMA).execute(db)

  await db.schema
    .createIndex('idx_api_keys_key_hash')
    .on(TABLE_NAME)
    .column('key_hash')
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_api_keys_user_id')
    .on(TABLE_NAME)
    .column('user_id')
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_api_keys_expires_at')
    .on(TABLE_NAME)
    .column('expires_at')
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_api_keys_is_active')
    .on(TABLE_NAME)
    .column('is_active')
    .using('btree')
    .ifNotExists()
    .execute()
}

export const down = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema(SCHEMA)
  await db.schema.dropIndex('idx_api_keys_is_active').ifExists().execute()
  await db.schema.dropIndex('idx_api_keys_expires_at').ifExists().execute()
  await db.schema.dropIndex('idx_api_keys_user_id').ifExists().execute()
  await db.schema.dropIndex('idx_api_keys_key_hash').ifExists().execute()
  await dbHelper.dropTriggerUpdatedAt(TABLE_NAME, SCHEMA).execute(db)
  await db.schema.dropTable(TABLE_NAME).ifExists().execute()
}
