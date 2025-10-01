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
    .createTable('roles')
    .addColumn('id', 'text', (col) => col.primaryKey())
    // ----- Add columns here -----
    .$call(addColumnTimestamps) // [created_at, updated_at]
    .modifyEnd(sql`USING heap`)
    .ifNotExists()
    .execute()

  // Create required indexes and auto-update trigger
  await createTriggerUpdatedAt('roles', 'internal').execute(db)
  await createColumnIndex(db, 'roles', 'id').execute()
  await createColumnIndex(db, 'roles', 'created_at').execute()
  await createColumnIndex(db, 'roles', 'updated_at').execute()
}

export const down = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema('internal')
  await dropColumnIndex(db, 'roles', 'id').execute()
  await dropColumnIndex(db, 'roles', 'created_at').execute()
  await dropColumnIndex(db, 'roles', 'updated_at').execute()
  await dropTriggerUpdatedAt('roles', 'internal').execute(db)
  await db.schema.dropTable('roles').ifExists().execute()
}
