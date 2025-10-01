// For more info, see: https://kysely.dev/docs/migrations
// Up migrations are mandatory. you must implement this function.
// Down migrations are optional. you can safely delete this function.

import { type Kysely, sql } from 'kysely'
import * as dbHelper from '~/database/db.helper'
import type { Database } from '~/database/db.schema'

const TABLE_NAME = 'audit_logs'
const SCHEMA = 'internal'

export const up = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema(SCHEMA)

  // Create table
  await db.schema
    .createTable(TABLE_NAME)
    .addColumn('id', 'uuid', (col) => col.primaryKey().notNull().defaultTo(sql`uuidv7()`))
    .addColumn('user_id', 'uuid', (col) =>
      col.references('users.id').onDelete('set null').defaultTo(null)
    )
    .addColumn('audited_resource_type', 'text', (col) => col.notNull())
    .addColumn('audited_resource_id', 'uuid', (col) => col.notNull())
    .addColumn('audit_action', 'text', (col) =>
      col.notNull().check(sql`audit_action IN ('create', 'update', 'delete', 'login', 'logout')`)
    )
    .addColumn('previous_values', 'jsonb', (col) => col.defaultTo(null))
    .addColumn('new_values', 'jsonb', (col) => col.defaultTo(null))
    .addColumn('client_ip_address', sql`inet`, (col) => col.defaultTo(null))
    .addColumn('client_user_agent', 'text', (col) => col.defaultTo(null))
    .addColumn('session_id', 'uuid', (col) =>
      col.references('sessions.id').onDelete('set null').defaultTo(null)
    )
    .addColumn('action_performed_at', 'timestamptz', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .modifyEnd(sql`USING heap`)
    .ifNotExists()
    .execute()

  // Create required indexes and auto-update trigger
  await dbHelper.createColumnIndex(db, TABLE_NAME, 'user_id').using('btree').execute()
  await dbHelper.createColumnIndex(db, TABLE_NAME, 'audited_resource_type').using('btree').execute()
  await dbHelper.createColumnIndex(db, TABLE_NAME, 'audit_action').using('btree').execute()
  await dbHelper.createColumnIndex(db, TABLE_NAME, 'action_performed_at').using('btree').execute()
}

export const down = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema(SCHEMA)
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'action_performed_at').execute()
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'audit_action').execute()
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'audited_resource_type').execute()
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'user_id').execute()
  await db.schema.dropTable(TABLE_NAME).ifExists().execute()
}
