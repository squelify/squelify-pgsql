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
    .addColumn('ip_address', 'text', (col) => col.defaultTo(null))
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
  await dbHelper.createColumnIndex(db, TABLE_NAME, 'user_id').using('btree').execute()
  await dbHelper.createColumnIndex(db, TABLE_NAME, 'session_id').using('btree').execute()
  await dbHelper.createColumnIndex(db, TABLE_NAME, 'expires_at').using('btree').execute()
  await dbHelper
    .createColumnIndex(db, TABLE_NAME, 'last_used_at')
    .using('btree')
    .where(sql<boolean>`last_used_at IS NOT NULL`)
    .execute()
  await dbHelper
    .createColumnIndex(db, TABLE_NAME, 'revoked_at')
    .using('btree')
    .where(sql<boolean>`revoked_at IS NOT NULL`)
    .execute()
  await dbHelper.createColumnIndex(db, TABLE_NAME, 'created_at').using('btree').execute()
  await dbHelper
    .createColumnIndex(db, TABLE_NAME, 'ip_address')
    .using('btree')
    .where(sql<boolean>`ip_address IS NOT NULL`)
    .execute()
  await dbHelper
    .createColumnIndex(db, TABLE_NAME, 'user_agent')
    .using('btree')
    .where(sql<boolean>`user_agent IS NOT NULL`)
    .execute()
  await dbHelper.createColumnIndex(db, TABLE_NAME, 'token_hash').unique().using('btree').execute()
}

export const down = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema(SCHEMA)
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'token_hash').execute()
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'user_agent').execute()
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'ip_address').execute()
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'created_at').execute()
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'revoked_at').execute()
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'last_used_at').execute()
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'expires_at').execute()
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'session_id').execute()
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'user_id').execute()
  await dbHelper.dropTriggerUpdatedAt(TABLE_NAME, SCHEMA).execute(db)
  await db.schema.dropTable(TABLE_NAME).ifExists().execute()
}
