// For more info, see: https://kysely.dev/docs/migrations
// Up migrations are mandatory. you must implement this function.
// Down migrations are optional. you can safely delete this function.

import { type Kysely, sql } from 'kysely'
import { createTriggerUpdatedAt, dropTriggerUpdatedAt } from '~/database/db.helper'
import { addColumnTimestamps, createColumnIndex, dropColumnIndex } from '~/database/db.helper'
import type { Database } from '~/database/db.schema'

export const up = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema('public')

  // Create table
  await db.schema
    .createTable('users')
    .addColumn('id', 'text', (col) => col.primaryKey())
    // ----- Add columns here -----
    .$call(addColumnTimestamps) // [created_at, updated_at]
    .modifyEnd(sql`USING heap`)
    .ifNotExists()
    .execute()

  // Create required indexes and auto-update trigger
  await createTriggerUpdatedAt('users', 'public').execute(db)
  await createColumnIndex(db, 'users', 'id').execute()
  await createColumnIndex(db, 'users', 'created_at').execute()
  await createColumnIndex(db, 'users', 'updated_at').execute()
}

export const down = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema('public')
  await dropColumnIndex(db, 'users', 'id').execute()
  await dropColumnIndex(db, 'users', 'created_at').execute()
  await dropColumnIndex(db, 'users', 'updated_at').execute()
  await dropTriggerUpdatedAt('users', 'public').execute(db)
  await db.schema.dropTable('users').ifExists().execute()
}
