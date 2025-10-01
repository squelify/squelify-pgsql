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
    .$call(dbHelper.addColumnTimestamps) // created_at, updated_at
    .addColumn('email_verified_at', 'timestamptz', (col) => col.defaultTo(null))
    .addColumn('last_login_at', 'timestamptz', (col) => col.defaultTo(null))
    .addColumn('banned_at', 'timestamptz', (col) => col.defaultTo(null))
    .addColumn('ban_expires', 'timestamptz', (col) => col.defaultTo(null))
    .addColumn('ban_reason', 'text', (col) => col.defaultTo(null))
    // Email format validation
    .addCheckConstraint(
      'chk_email_format',
      sql`char_length(email) > 3 AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'`
    )
    // Username format validation
    .addCheckConstraint(
      'chk_username_format',
      sql`username IS NULL OR username ~ '^[a-zA-Z0-9_]{3,32}$'`
    )
    .modifyEnd(sql`USING heap`)
    .ifNotExists()
    .execute()

  // Trigger
  await dbHelper.createTriggerUpdatedAt(TABLE_NAME, SCHEMA).execute(db)

  // Indexes
  await dbHelper
    .createColumnsIndex(db, TABLE_NAME, ['display_name'])
    .using('gin')
    .expression(sql`display_name gin_trgm_ops`)
    .execute()

  await dbHelper
    .createColumnsIndex(db, TABLE_NAME, ['username'])
    .using('gin')
    .expression(sql`username gin_trgm_ops`)
    .where(sql<boolean>`username IS NOT NULL`)
    .execute()

  await dbHelper
    .createColumnsIndex(db, TABLE_NAME, ['email'])
    .expression(sql`LOWER(email)`)
    .execute()

  await dbHelper
    .createColumnsIndex(db, TABLE_NAME, ['username'])
    .unique()
    .expression(sql`LOWER(username)`)
    .using('btree')
    .execute()

  await dbHelper
    .createColumnsIndex(db, TABLE_NAME, ['email'])
    .unique()
    .expression(sql`LOWER(email)`)
    .using('btree')
    .execute()

  await dbHelper
    .createColumnIndex(db, TABLE_NAME, 'banned_at')
    .where(sql<boolean>`banned_at IS NOT NULL`)
    .using('btree')
    .execute()

  await dbHelper
    .createColumnIndex(db, TABLE_NAME, 'ban_expires')
    .where(sql<boolean>`ban_expires IS NOT NULL`)
    .using('btree')
    .execute()

  await dbHelper
    .createColumnsIndex(db, TABLE_NAME, ['banned_at', 'ban_expires'])
    .where(sql<boolean>`banned_at IS NOT NULL AND ban_expires IS NOT NULL`)
    .using('btree')
    .execute()

  await dbHelper.createColumnIndex(db, TABLE_NAME, 'created_at').execute()
  await dbHelper
    .createColumnIndex(db, TABLE_NAME, 'updated_at')
    .where(sql<boolean>`updated_at IS NOT NULL`)
    .using('btree')
    .execute()

  await dbHelper.createColumnIndex(db, TABLE_NAME, 'metadata').using('gin').execute()

  await dbHelper
    .createColumnIndex(db, TABLE_NAME, 'last_login_at')
    .where(sql<boolean>`last_login_at IS NOT NULL`)
    .using('btree')
    .execute()

  await dbHelper
    .createColumnIndex(db, TABLE_NAME, 'email_verified_at')
    .where(sql<boolean>`email_verified_at IS NOT NULL`)
    .using('btree')
    .execute()
}

export const down = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema(SCHEMA)
  await dbHelper.dropTriggerUpdatedAt(TABLE_NAME, SCHEMA).execute(db)

  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'email_verified_at').execute()
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'last_login_at').execute()
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'metadata').execute()
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'updated_at').execute()
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'created_at').execute()
  await dbHelper.dropColumnsIndex(db, TABLE_NAME, ['banned_at', 'ban_expires']).execute()
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'ban_expires').execute()
  await dbHelper.dropColumnIndex(db, TABLE_NAME, 'banned_at').execute()
  await dbHelper.dropColumnsIndex(db, TABLE_NAME, ['email']).execute()
  await dbHelper.dropColumnsIndex(db, TABLE_NAME, ['username']).execute()
  await dbHelper.dropColumnsIndex(db, TABLE_NAME, ['display_name']).execute()
  await dbHelper.dropColumnsIndex(db, TABLE_NAME, ['username']).execute()
  await dbHelper.dropColumnsIndex(db, TABLE_NAME, ['email']).execute()

  await db.schema.dropTable(TABLE_NAME).ifExists().execute()
}
