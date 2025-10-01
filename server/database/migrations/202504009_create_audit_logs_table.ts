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
    .addColumn('ip_address', sql`inet`, (col) => col.defaultTo(null))
    .addColumn('user_agent', 'text', (col) => col.defaultTo(null))
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

  // Create required indexes
  await db.schema
    .createIndex('idx_audit_logs_user_id')
    .on(TABLE_NAME)
    .column('user_id')
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_audit_logs_audited_resource_type')
    .on(TABLE_NAME)
    .column('audited_resource_type')
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_audit_logs_audit_action')
    .on(TABLE_NAME)
    .column('audit_action')
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_audit_logs_action_performed_at')
    .on(TABLE_NAME)
    .column('action_performed_at')
    .using('btree')
    .ifNotExists()
    .execute()
}

export const down = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema(SCHEMA)
  await db.schema.dropIndex('idx_audit_logs_action_performed_at').ifExists().execute()
  await db.schema.dropIndex('idx_audit_logs_audit_action').ifExists().execute()
  await db.schema.dropIndex('idx_audit_logs_audited_resource_type').ifExists().execute()
  await db.schema.dropIndex('idx_audit_logs_user_id').ifExists().execute()
  await db.schema.dropTable(TABLE_NAME).ifExists().execute()
}
