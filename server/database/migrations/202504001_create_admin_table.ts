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

export const up = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema('internal')

  // Create table
  await db.schema
    .createTable('admin')
    .addColumn('id', 'text', (col) => col.primaryKey())
    // ----- Add columns here -----
    .$call(addColumnTimestamps) // [created_at, updated_at]
    .modifyEnd(sql`USING heap`)
    .ifNotExists()
    .execute()

  // Create required indexes and auto-update trigger
  await createTriggerUpdatedAt('admin', 'internal').execute(db)
  await createColumnIndex(db, 'admin', 'id').execute()
  await createColumnIndex(db, 'admin', 'created_at').execute()
  await createColumnIndex(db, 'admin', 'updated_at').execute()
}

export const down = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema('internal')
  await dropColumnIndex(db, 'admin', 'id').execute()
  await dropColumnIndex(db, 'admin', 'created_at').execute()
  await dropColumnIndex(db, 'admin', 'updated_at').execute()
  await dropTriggerUpdatedAt('admin', 'internal').execute(db)
  await db.schema.dropTable('admin').ifExists().execute()
}
