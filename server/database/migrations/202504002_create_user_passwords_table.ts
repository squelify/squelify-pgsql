// For more info, see: https://kysely.dev/docs/migrations
// Up migrations are mandatory. you must implement this function.
// Down migrations are optional. you can safely delete this function.

import { type Kysely, sql } from 'kysely'
import * as dbHelper from '~/database/db.helper'
import type { Database } from '~/database/db.schema'

const TABLE_NAME = 'user_passwords'
const SCHEMA = 'internal'

export const up = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema(SCHEMA)

  // Create table
  await db.schema
    .createTable(TABLE_NAME)
    .addColumn('user_id', 'uuid', (col) =>
      col.primaryKey().notNull().references('users.id').onDelete('cascade')
    )
    .addColumn('password_hash', 'bytea', (col) => col.notNull())
    .$call(dbHelper.addColumnTimestamps)
    .addUniqueConstraint('user_passwords_one_per_user', ['user_id'])
    .modifyEnd(sql`USING heap`)
    .ifNotExists()
    .execute()

  // Create required indexes and auto-update trigger
  await dbHelper.createTriggerUpdatedAt(TABLE_NAME, SCHEMA).execute(db)

  await db.schema
    .createIndex('idx_user_passwords_created_at')
    .on(TABLE_NAME)
    .column('created_at')
    .using('btree')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_user_passwords_updated_at')
    .on(TABLE_NAME)
    .column('updated_at')
    .where(sql<boolean>`updated_at IS NOT NULL`)
    .using('btree')
    .ifNotExists()
    .execute()
}

export const down = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema(SCHEMA)
  await db.schema.dropIndex('idx_user_passwords_updated_at').ifExists().execute()
  await db.schema.dropIndex('idx_user_passwords_created_at').ifExists().execute()
  await dbHelper.dropTriggerUpdatedAt(TABLE_NAME, SCHEMA).execute(db)
  await db.schema.dropTable(TABLE_NAME).ifExists().execute()
}
