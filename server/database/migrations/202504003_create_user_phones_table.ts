// For more info, see: https://kysely.dev/docs/migrations
// Up migrations are mandatory. you must implement this function.
// Down migrations are optional. you can safely delete this function.

import { type Kysely, sql } from 'kysely'
import * as dbHelper from '~/database/db.helper'
import type { Database } from '~/database/db.schema'

const TABLE_NAME = 'user_phones'
const SCHEMA = 'internal'

export const up = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema(SCHEMA)

  // Create table
  await db.schema
    .createTable(TABLE_NAME)
    .addColumn('id', 'uuid', (col) => col.primaryKey().notNull().defaultTo(sql`uuidv7()`))
    .addColumn('user_id', 'uuid', (col) => col.notNull().references('users.id').onDelete('cascade'))
    .addColumn('phone_number', 'text', (col) => col.notNull().unique())
    .addColumn('is_primary', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('use_for_sign_in', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('use_for_mfa', 'boolean', (col) => col.notNull().defaultTo(false))
    .$call(dbHelper.addColumnTimestamps)
    .addColumn('verified_at', 'timestamptz', (col) => col.defaultTo(null))
    .addCheckConstraint(
      'chk_phone_format',
      sql`phone_number IS NULL OR phone_number ~ '^\\+?[0-9]{8,20}$'`
    )
    .modifyEnd(sql`USING heap`)
    .ifNotExists()
    .execute()

  // Create required indexes and auto-update trigger
  await dbHelper.createTriggerUpdatedAt(TABLE_NAME, SCHEMA).execute(db)

  await dbHelper.createColumnIndex(db, TABLE_NAME, 'user_id').using('btree').execute()
  await dbHelper.createColumnIndex(db, TABLE_NAME, 'phone_number').using('btree').execute()
  await dbHelper.createColumnIndex(db, TABLE_NAME, 'verified_at').using('btree').execute()

  await dbHelper
    .createColumnsIndex(db, TABLE_NAME, ['user_id'])
    .where(sql<boolean>`use_for_mfa = TRUE`)
    .using('btree')
    .execute()

  await dbHelper
    .createColumnsIndex(db, TABLE_NAME, ['user_id'])
    .where(sql<boolean>`use_for_sign_in = TRUE`)
    .using('btree')
    .execute()

  await dbHelper
    .createColumnsIndex(db, TABLE_NAME, ['user_id'])
    .unique()
    .where(sql<boolean>`is_primary = TRUE`)
    .using('btree')
    .execute()
}

export const down = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema(SCHEMA)
  await dbHelper.dropColumnsIndex(db, TABLE_NAME, ['user_id']).execute()
  await dbHelper.dropColumnsIndex(db, TABLE_NAME, ['user_id']).execute()
  await dbHelper.dropColumnsIndex(db, TABLE_NAME, ['user_id']).execute()
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'verified_at').execute()
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'phone_number').execute()
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'user_id').execute()
  await dbHelper.dropTriggerUpdatedAt(TABLE_NAME, SCHEMA).execute(db)
  await db.schema.dropTable(TABLE_NAME).ifExists().execute()
}
