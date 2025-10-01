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
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().notNull().defaultTo(dbHelper.DEFAULT_UUID_v7)
    )
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
  await db.schema
    .createIndex('idx_sessions_user_id')
    .on(TABLE_NAME)
    .column('user_id')
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_sessions_expires_at')
    .on(TABLE_NAME)
    .column('expires_at')
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_sessions_user_id_expires_at')
    .on(TABLE_NAME)
    .columns(['user_id', 'expires_at'])
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_sessions_ip_address')
    .on(TABLE_NAME)
    .column('ip_address')
    .where(sql<boolean>`ip_address IS NOT NULL`)
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_sessions_device_fingerprint')
    .on(TABLE_NAME)
    .column('device_fingerprint')
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_sessions_token_hash')
    .unique()
    .on(TABLE_NAME)
    .column('token_hash')
    .using('btree')
    .ifNotExists()
    .execute()
}

export const down = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema(SCHEMA)
  await db.schema.dropIndex('idx_sessions_ip_address').ifExists().execute()
  await db.schema.dropIndex('idx_sessions_user_id_expires_at').ifExists().execute()
  await db.schema.dropIndex('idx_sessions_device_fingerprint').ifExists().execute()
  await db.schema.dropIndex('idx_sessions_expires_at').ifExists().execute()
  await db.schema.dropIndex('idx_sessions_token_hash').ifExists().execute()
  await db.schema.dropIndex('idx_sessions_user_id').ifExists().execute()
  await db.schema.dropTable(TABLE_NAME).ifExists().execute()
}
