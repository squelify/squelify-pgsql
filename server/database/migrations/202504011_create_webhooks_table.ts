// For more info, see: https://kysely.dev/docs/migrations
// Up migrations are mandatory. you must implement this function.
// Down migrations are optional. you can safely delete this function.

import { type Kysely, sql } from 'kysely'
import * as dbHelper from '~/database/db.helper'
import type { Database } from '~/database/db.schema'

const TABLE_NAME = 'webhooks'
const SCHEMA = 'internal'

export const up = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema(SCHEMA)

  // Create table
  await db.schema
    .createTable(TABLE_NAME)
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().notNull().defaultTo(dbHelper.DEFAULT_UUID_v7)
    )
    .addColumn('profile_name', 'text', (col) => col.notNull())
    .addColumn('user_id', 'uuid', (col) => col.notNull().references('users.id').onDelete('cascade'))
    .addColumn('webhook_url', 'text', (col) => col.notNull())
    .addColumn('http_method', 'text', (col) =>
      col.notNull().check(sql`http_method IN ('GET', 'POST', 'PUT', 'PATCH', 'DELETE')`)
    )
    .addColumn('payload_template', 'jsonb', (col) => col.defaultTo(null))
    .addColumn('request_headers', 'jsonb', (col) => col.defaultTo(null))
    .addColumn('authentication_type', 'text', (col) =>
      col
        .notNull()
        .check(sql`authentication_type IN ('none', 'basic', 'bearer', 'api_key', 'oauth2')`)
    )
    .addColumn('authentication_config', 'jsonb', (col) => col.defaultTo(null))
    .addColumn('retry_attempts', 'integer', (col) => col.notNull().defaultTo(3))
    .addColumn('retry_backoff_seconds', 'integer', (col) => col.notNull().defaultTo(30))
    .addColumn('request_timeout_seconds', 'integer', (col) => col.notNull().defaultTo(60))
    .addColumn('is_ssl_verification_enabled', 'boolean', (col) => col.notNull().defaultTo(true))
    .addColumn('is_active', 'boolean', (col) => col.notNull().defaultTo(true))
    .addColumn('last_used_at', 'timestamptz', (col) => col.defaultTo(null))
    .addColumn('success_count', 'bigint', (col) => col.notNull().defaultTo(0))
    .addColumn('failure_count', 'bigint', (col) => col.notNull().defaultTo(0))
    .$call(dbHelper.addColumnTimestamps)
    .modifyEnd(sql`USING heap`)
    .ifNotExists()
    .execute()

  await dbHelper.createTriggerUpdatedAt(TABLE_NAME, SCHEMA).execute(db)

  await db.schema
    .createIndex('idx_webhook_profiles_user_id')
    .on(TABLE_NAME)
    .column('user_id')
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_webhook_profiles_is_active')
    .on(TABLE_NAME)
    .column('is_active')
    .using('btree')
    .ifNotExists()
    .execute()
}

export const down = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema(SCHEMA)
  await db.schema.dropIndex('idx_webhook_profiles_is_active').ifExists().execute()
  await db.schema.dropIndex('idx_webhook_profiles_user_id').ifExists().execute()
  await dbHelper.dropTriggerUpdatedAt(TABLE_NAME, SCHEMA).execute(db)
  await db.schema.dropTable(TABLE_NAME).ifExists().execute()
}
