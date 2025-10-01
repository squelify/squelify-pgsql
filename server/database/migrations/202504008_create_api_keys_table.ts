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
    .addColumn('id', 'uuid', (col) => col.primaryKey().notNull().defaultTo(sql`uuidv7()`))
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
    .$call(dbHelper.addColumnTimestamps) // [created_at, updated_at]
    .modifyEnd(sql`USING heap`)
    .ifNotExists()
    .execute()

  // Create required indexes and auto-update trigger
  await dbHelper.createTriggerUpdatedAt(TABLE_NAME, SCHEMA).execute(db)
  await dbHelper.createColumnIndex(db, TABLE_NAME, 'key_hash').using('btree').execute()
  await dbHelper.createColumnIndex(db, TABLE_NAME, 'user_id').using('btree').execute()
  await dbHelper.createColumnIndex(db, TABLE_NAME, 'expires_at').using('btree').execute()
  await dbHelper.createColumnIndex(db, TABLE_NAME, 'is_active').using('btree').execute()
}

export const down = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema(SCHEMA)
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'is_active').execute()
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'expires_at').execute()
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'user_id').execute()
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'key_hash').execute()
  await dbHelper.dropTriggerUpdatedAt(TABLE_NAME, SCHEMA).execute(db)
  await db.schema.dropTable(TABLE_NAME).ifExists().execute()
}
