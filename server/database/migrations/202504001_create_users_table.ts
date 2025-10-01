// For more info, see: https://kysely.dev/docs/migrations
// Up migrations are mandatory. you must implement this function.
// Down migrations are optional. you can safely delete this function.

import { type Kysely, sql } from 'kysely'
import * as dbHelper from '~/database/db.helper'
import type { Database } from '~/database/db.schema'

const TABLE_NAME = 'users'
const SCHEMA = 'internal'

export const up = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema(SCHEMA)

  // Create table
  await db.schema
    .createTable(TABLE_NAME)
    .addColumn('id', 'uuid', (col) => col.primaryKey().notNull().defaultTo(sql`uuidv7()`))
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('username', 'text', (col) => col.unique().defaultTo(null))
    .addColumn('display_name', 'text', (col) =>
      col.notNull().check(sql`char_length(display_name) > 0`)
    )
    .addColumn('avatar_url', 'text', (col) => col.defaultTo(null))
    .addColumn('metadata', 'jsonb', (col) => col.defaultTo(null))
    .$call(dbHelper.addColumnTimestamps)
    .addColumn('email_verified_at', 'timestamptz', (col) => col.defaultTo(null))
    .addColumn('last_login_at', 'timestamptz', (col) => col.defaultTo(null))
    .addColumn('banned_at', 'timestamptz', (col) => col.defaultTo(null))
    .addColumn('ban_expires', 'timestamptz', (col) => col.defaultTo(null))
    .addColumn('ban_reason', 'text', (col) => col.defaultTo(null))
    .addCheckConstraint(
      'chk_email_format',
      sql`char_length(email) > 3 AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'`
    )
    .addCheckConstraint(
      'chk_username_format',
      sql`username IS NULL OR username ~ '^[a-zA-Z0-9_]{3,32}$'`
    )
    .modifyEnd(sql`USING heap`)
    .ifNotExists()
    .execute()

  // Trigger
  await dbHelper.createTriggerUpdatedAt(TABLE_NAME, SCHEMA).execute(db)

  // Create required indexes
  await db.schema
    .createIndex('idx_users_display_name')
    .on(TABLE_NAME)
    .using('gin')
    .expression(sql`display_name gin_trgm_ops`)
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_users_username')
    .on(TABLE_NAME)
    .using('gin')
    .expression(sql`username gin_trgm_ops`)
    .where(sql<boolean>`username IS NOT NULL`)
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_users_email')
    .on(TABLE_NAME)
    .expression(sql`LOWER(email)`)
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_users_normalized_username')
    .unique()
    .on(TABLE_NAME)
    .expression(sql`LOWER(username)`)
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_users_normalized_email')
    .unique()
    .on(TABLE_NAME)
    .expression(sql`LOWER(email)`)
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_users_banned_at')
    .on(TABLE_NAME)
    .column('banned_at')
    .where(sql<boolean>`banned_at IS NOT NULL`)
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_users_ban_expires')
    .on(TABLE_NAME)
    .column('ban_expires')
    .where(sql<boolean>`ban_expires IS NOT NULL`)
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_users_banned_expires')
    .on(TABLE_NAME)
    .columns(['banned_at', 'ban_expires'])
    .where(sql<boolean>`banned_at IS NOT NULL AND ban_expires IS NOT NULL`)
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_users_created_at')
    .on(TABLE_NAME)
    .column('created_at')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_users_updated_at')
    .on(TABLE_NAME)
    .column('updated_at')
    .where(sql<boolean>`updated_at IS NOT NULL`)
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_users_metadata_gin')
    .on(TABLE_NAME)
    .using('gin')
    .column('metadata')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_users_last_login_at')
    .on(TABLE_NAME)
    .column('last_login_at')
    .where(sql<boolean>`last_login_at IS NOT NULL`)
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_users_email_verified_at')
    .on(TABLE_NAME)
    .column('email_verified_at')
    .where(sql<boolean>`email_verified_at IS NOT NULL`)
    .using('btree')
    .ifNotExists()
    .execute()
}

export const down = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema(SCHEMA)
  await dbHelper.dropTriggerUpdatedAt(TABLE_NAME, SCHEMA).execute(db)

  await db.schema.dropIndex('idx_users_email_verified_at').ifExists().execute()
  await db.schema.dropIndex('idx_users_last_login_at').ifExists().execute()
  await db.schema.dropIndex('idx_users_metadata_gin').ifExists().execute()
  await db.schema.dropIndex('idx_users_updated_at').ifExists().execute()
  await db.schema.dropIndex('idx_users_created_at').ifExists().execute()
  await db.schema.dropIndex('idx_users_banned_expires').ifExists().execute()
  await db.schema.dropIndex('idx_users_ban_expires').ifExists().execute()
  await db.schema.dropIndex('idx_users_banned_at').ifExists().execute()
  await db.schema.dropIndex('idx_users_normalized_email').ifExists().execute()
  await db.schema.dropIndex('idx_users_normalized_username').ifExists().execute()
  await db.schema.dropIndex('idx_users_email').ifExists().execute()
  await db.schema.dropIndex('idx_users_username').ifExists().execute()
  await db.schema.dropIndex('idx_users_display_name').ifExists().execute()

  await db.schema.dropTable(TABLE_NAME).ifExists().execute()
}
