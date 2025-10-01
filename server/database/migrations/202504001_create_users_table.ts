// For more info, see: https://kysely.dev/docs/migrations
// Up migrations are mandatory. you must implement this function.
// Down migrations are optional. you can safely delete this function.

import { type Kysely, sql } from 'kysely'
import {
  addColumnTimestamps,
  createColumnIndex,
  createTriggerUpdatedAt,
  dropColumnIndex,
  dropTriggerUpdatedAt,
} from '~/database/db.helper'
import type { Database } from '~/database/db.schema'

const TABLE_NAME = 'users'

export const up = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema('internal')

  // Create table
  await db.schema
    .createTable(TABLE_NAME)
    .addColumn('id', 'text', (col) => col.primaryKey())
    // ----- Add columns here -----
    .$call(addColumnTimestamps) // [created_at, updated_at]
    .modifyEnd(sql`USING heap`)
    .ifNotExists()
    .execute()

  // Create required indexes and auto-update trigger
  await createTriggerUpdatedAt(TABLE_NAME, 'internal').execute(db)
  await createColumnIndex(db, TABLE_NAME, 'id').execute()
  await createColumnIndex(db, TABLE_NAME, 'created_at').execute()
  await createColumnIndex(db, TABLE_NAME, 'updated_at').execute()
}

export const down = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema('internal')
  await dropColumnIndex(db, TABLE_NAME, 'id').execute()
  await dropColumnIndex(db, TABLE_NAME, 'created_at').execute()
  await dropColumnIndex(db, TABLE_NAME, 'updated_at').execute()
  await dropTriggerUpdatedAt(TABLE_NAME, 'internal').execute(db)
  await db.schema.dropTable(TABLE_NAME).ifExists().execute()
}
