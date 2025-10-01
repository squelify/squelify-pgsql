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
    .addColumn('id', 'uuid', (col) => col.primaryKey().notNull().defaultTo(sql`uuidv7()`))
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

  // Create required indexes and auto-update trigger
  await dbHelper.createColumnIndex(db, TABLE_NAME, 'user_id').using('btree').execute()
  await dbHelper.createColumnIndex(db, TABLE_NAME, 'token_type').using('btree').execute()
  await dbHelper.createColumnIndex(db, TABLE_NAME, 'expires_at').using('btree').execute()
  await dbHelper.createColumnIndex(db, TABLE_NAME, 'created_at').using('btree').execute()
  await dbHelper.createColumnIndex(db, TABLE_NAME, 'updated_at').using('btree').execute()
  await dbHelper
    .createColumnsIndex(db, TABLE_NAME, ['relates_to'])
    .expression(sql`lower(relates_to)`)
    .using('btree')
    .execute()
  await dbHelper.createColumnIndex(db, TABLE_NAME, 'metadata').using('gin').execute()
}

export const down = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema(SCHEMA)
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'metadata').execute()
  await dbHelper.dropColumnsIndex(db, TABLE_NAME, ['relates_to']).execute()
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'updated_at').execute()
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'created_at').execute()
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'expires_at').execute()
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'token_type').execute()
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'user_id').execute()
  await db.schema.dropTable(TABLE_NAME).ifExists().execute()
}
