// For more info, see: https://kysely.dev/docs/migrations
// Up migrations are mandatory. you must implement this function.
// Down migrations are optional. you can safely delete this function.

import { type Kysely, sql } from 'kysely'
import * as dbHelper from '~/database/db.helper'
import type { Database } from '~/database/db.schema'

const TABLE_NAME = 'app_settings'
const SCHEMA = 'internal'

export const up = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema(SCHEMA)

  // Create table
  await db.schema
    .createTable(TABLE_NAME)
    .addColumn('id', 'uuid', (col) => col.primaryKey().notNull().defaultTo(sql`uuidv7()`))
    .addColumn('setting_key', 'text', (col) => col.notNull().unique())
    .addColumn('setting_value', 'jsonb', (col) => col.notNull())
    .addColumn('setting_category', 'text', (col) =>
      col
        .notNull()
        .check(sql`setting_category IN ('retention', 'backup', 'performance', 'security')`)
    )
    .addColumn('setting_description', 'text', (col) => col.defaultTo(null))
    .addColumn('is_encrypted_setting', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('is_active_setting', 'boolean', (col) => col.notNull().defaultTo(true))
    .$call(dbHelper.addColumnTimestamps) // [created_at, updated_at]
    .modifyEnd(sql`USING heap`)
    .ifNotExists()
    .execute()

  // Create required indexes and auto-update trigger
  await dbHelper.createTriggerUpdatedAt(TABLE_NAME, SCHEMA).execute(db)
  await dbHelper.createColumnIndex(db, TABLE_NAME, 'id').using('btree').execute()
  await dbHelper.createColumnIndex(db, TABLE_NAME, 'created_at').using('btree').execute()
  await dbHelper.createColumnIndex(db, TABLE_NAME, 'updated_at').using('btree').execute()
  await dbHelper.createColumnIndex(db, TABLE_NAME, 'setting_category').using('btree').execute()
  await dbHelper.createColumnIndex(db, TABLE_NAME, 'is_active_setting').using('btree').execute()
}

export const down = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema(SCHEMA)
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'is_active_setting').execute()
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'setting_category').execute()
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'updated_at').execute()
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'created_at').execute()
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'id').execute()
  await dbHelper.dropTriggerUpdatedAt(TABLE_NAME, SCHEMA).execute(db)
  await db.schema.dropTable(TABLE_NAME).ifExists().execute()
}
