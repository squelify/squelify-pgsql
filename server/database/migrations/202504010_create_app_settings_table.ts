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
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().notNull().defaultTo(dbHelper.DEFAULT_UUID_v7)
    )
    .addColumn('setting_key', 'text', (col) => col.notNull().unique())
    .addColumn('setting_value', 'jsonb', (col) => col.notNull())
    .addColumn('setting_category', 'text', (col) => col.notNull())
    .addColumn('setting_description', 'text', (col) => col.defaultTo(null))
    .addColumn('is_encrypted_setting', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('is_active_setting', 'boolean', (col) => col.notNull().defaultTo(true))
    .$call(dbHelper.addColumnTimestamps) // [created_at, updated_at]
    .modifyEnd(sql`USING heap`)
    .ifNotExists()
    .execute()

  await dbHelper.createTriggerUpdatedAt(TABLE_NAME, SCHEMA).execute(db)

  await db.schema
    .createIndex('idx_app_settings_setting_category')
    .on(TABLE_NAME)
    .column('setting_category')
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_app_settings_is_active_setting')
    .on(TABLE_NAME)
    .column('is_active_setting')
    .using('btree')
    .ifNotExists()
    .execute()
}

export const down = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema(SCHEMA)
  await db.schema.dropIndex('idx_app_settings_is_active_setting').ifExists().execute()
  await db.schema.dropIndex('idx_app_settings_setting_category').ifExists().execute()
  await dbHelper.dropTriggerUpdatedAt(TABLE_NAME, SCHEMA).execute(db)
  await db.schema.dropTable(TABLE_NAME).ifExists().execute()
}
