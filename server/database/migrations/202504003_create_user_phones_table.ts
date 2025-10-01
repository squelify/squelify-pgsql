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

  await db.schema
    .createIndex('idx_user_phones_user_id')
    .on(TABLE_NAME)
    .column('user_id')
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_user_phones_phone_number')
    .on(TABLE_NAME)
    .column('phone_number')
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_user_phones_verified_at')
    .on(TABLE_NAME)
    .column('verified_at')
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_user_phones_use_for_mfa')
    .on(TABLE_NAME)
    .column('user_id')
    .where(sql<boolean>`use_for_mfa = TRUE`)
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_user_phones_use_for_sign_in')
    .on(TABLE_NAME)
    .column('user_id')
    .where(sql<boolean>`use_for_sign_in = TRUE`)
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_user_phones_primary_per_user')
    .unique()
    .on(TABLE_NAME)
    .column('user_id')
    .where(sql<boolean>`is_primary = TRUE`)
    .using('btree')
    .ifNotExists()
    .execute()
}

export const down = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema(SCHEMA)
  await db.schema.dropIndex('idx_user_phones_primary_per_user').ifExists().execute()
  await db.schema.dropIndex('idx_user_phones_use_for_sign_in').ifExists().execute()
  await db.schema.dropIndex('idx_user_phones_use_for_mfa').ifExists().execute()
  await db.schema.dropIndex('idx_user_phones_verified_at').ifExists().execute()
  await db.schema.dropIndex('idx_user_phones_phone_number').ifExists().execute()
  await db.schema.dropIndex('idx_user_phones_user_id').ifExists().execute()
  await dbHelper.dropTriggerUpdatedAt(TABLE_NAME, SCHEMA).execute(db)
  await db.schema.dropTable(TABLE_NAME).ifExists().execute()
}
