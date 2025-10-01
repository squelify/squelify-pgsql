// For more info, see: https://kysely.dev/docs/migrations
// Up migrations are mandatory. you must implement this function.
// Down migrations are optional. you can safely delete this function.

import { type Kysely, sql } from 'kysely'
import * as dbHelper from '~/database/db.helper'
import type { Database } from '~/database/db.schema'

const TABLE_NAME = 'sessions'
const SCHEMA = 'internal'

export const up = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema(SCHEMA)

  // Create table
  await db.schema
    .createTable(TABLE_NAME)
    .addColumn('id', 'uuid', (col) => col.primaryKey().notNull().defaultTo(sql`uuidv7()`))
    .addColumn('user_id', 'uuid', (col) => col.notNull().references('users.id').onDelete('cascade'))
    .addColumn('token_hash', 'text', (col) => col.notNull().unique())
    .addColumn('user_agent', 'text', (col) => col.defaultTo(null))
    .addColumn('device_name', 'text', (col) => col.defaultTo(null))
    .addColumn('device_fingerprint', 'text', (col) => col.defaultTo(null))
    .addColumn('ip_address', sql`inet`, (col) => col.defaultTo(null))
    .addColumn('expires_at', 'timestamptz', (col) =>
      col.notNull().check(sql`expires_at > CURRENT_TIMESTAMP`)
    )
    .$call(dbHelper.addColumnTimestamps)
    .addColumn('last_access_at', 'timestamptz', (col) => col.defaultTo(null))
    .addColumn('refreshed_at', 'timestamptz', (col) => col.defaultTo(null))
    .addColumn('revoked_at', 'timestamptz', (col) => col.defaultTo(null))
    .addColumn('revoked_by', 'uuid', (col) =>
      col.references('users.id').onDelete('set null').defaultTo(null)
    )
    .modifyEnd(sql`USING heap`)
    .ifNotExists()
    .execute()

  // Create required indexes and auto-update trigger
  await dbHelper.createColumnIndex(db, TABLE_NAME, 'user_id').using('btree').execute()
  await dbHelper.createColumnIndex(db, TABLE_NAME, 'expires_at').using('btree').execute()
  await dbHelper
    .createColumnsIndex(db, TABLE_NAME, ['user_id', 'expires_at'])
    .using('btree')
    .execute()
  await dbHelper
    .createColumnIndex(db, TABLE_NAME, 'ip_address')
    .using('btree')
    .where(sql<boolean>`ip_address IS NOT NULL`)
    .execute()
  await dbHelper.createColumnIndex(db, TABLE_NAME, 'device_fingerprint').using('btree').execute()
  await dbHelper.createColumnIndex(db, TABLE_NAME, 'token_hash').unique().using('btree').execute()
}

export const down = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema(SCHEMA)
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'ip_address').execute()
  await dbHelper.dropColumnsIndex(db, TABLE_NAME, ['user_id', 'expires_at']).execute()
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'device_fingerprint').execute()
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'expires_at').execute()
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'token_hash').execute()
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'user_id').execute()
  await db.schema.dropTable(TABLE_NAME).ifExists().execute()
}
