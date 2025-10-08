// For more info, see: https://kysely.dev/docs/migrations
// Up migrations are mandatory. you must implement this function.
// Down migrations are optional. you can safely delete this function.

import { type Kysely, sql } from 'kysely'
import * as dbHelper from '~/database/db.helper'
import type { Database } from '~/database/db.schema'

const SCHEMA = 'internal'

export const up = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema(SCHEMA)

  // roles
  await db.schema
    .createTable('roles')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().notNull().defaultTo(dbHelper.DEFAULT_UUID_v7)
    )
    .addColumn('name', 'text', (col) => col.notNull().unique())
    .addColumn('slug', 'text', (col) => col.notNull().unique())
    .addColumn('description', 'text', (col) => col.defaultTo(null))
    .addColumn('role_type', 'text', (col) =>
      col.notNull().check(sql`role_type IN ('system', 'organization', 'custom')`)
    )
    .addColumn('is_active', 'boolean', (col) => col.notNull().defaultTo(true))
    .addColumn('is_default', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('last_used_at', 'timestamptz', (col) => col.defaultTo(null))
    .$call(dbHelper.addColumnTimestamps)
    .modifyEnd(sql`USING heap`)
    .ifNotExists()
    .execute()
  await dbHelper.createTriggerUpdatedAt('roles', SCHEMA).execute(db)

  await db.schema
    .createIndex('idx_roles_name')
    .on('roles')
    .column('name')
    .using('btree')
    .ifNotExists()
    .execute()
  await db.schema
    .createIndex('idx_roles_slug')
    .on('roles')
    .column('slug')
    .using('btree')
    .ifNotExists()
    .execute()
  await db.schema
    .createIndex('idx_roles_role_type')
    .on('roles')
    .column('role_type')
    .using('btree')
    .ifNotExists()
    .execute()
  await db.schema
    .createIndex('idx_roles_is_active')
    .on('roles')
    .column('is_active')
    .using('btree')
    .ifNotExists()
    .execute()

  // user_roles
  await db.schema
    .createTable('user_roles')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().notNull().defaultTo(dbHelper.DEFAULT_UUID_v7)
    )
    .addColumn('user_id', 'uuid', (col) => col.notNull().references('users.id').onDelete('cascade'))
    .addColumn('role_id', 'uuid', (col) => col.notNull().references('roles.id').onDelete('cascade'))
    .addColumn('granted_by', 'uuid', (col) =>
      col.references('users.id').onDelete('set null').defaultTo(null)
    )
    .addColumn('scope_type', 'text', (col) =>
      col.notNull().check(sql`scope_type IN ('global', 'team', 'resource')`)
    )
    .addColumn('scope_id', 'uuid', (col) => col.defaultTo(null))
    .addColumn('is_active', 'boolean', (col) => col.notNull().defaultTo(true))
    .addColumn('assigned_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .addColumn('revoked_at', 'timestamptz', (col) => col.defaultTo(null))
    .addColumn('revoked_by', 'uuid', (col) =>
      col.references('users.id').onDelete('set null').defaultTo(null)
    )
    .$call(dbHelper.addColumnTimestamps)
    .modifyEnd(sql`USING heap`)
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_user_roles_user_id')
    .on('user_roles')
    .column('user_id')
    .using('btree')
    .ifNotExists()
    .execute()
  await db.schema
    .createIndex('idx_user_roles_role_id')
    .on('user_roles')
    .column('role_id')
    .using('btree')
    .ifNotExists()
    .execute()
  await db.schema
    .createIndex('idx_user_roles_scope')
    .on('user_roles')
    .columns(['scope_type', 'scope_id'])
    .using('btree')
    .ifNotExists()
    .execute()
  await db.schema
    .createIndex('idx_user_roles_is_active')
    .on('user_roles')
    .column('is_active')
    .using('btree')
    .ifNotExists()
    .execute()
}

export const down = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema(SCHEMA)
  await db.schema.dropTable('user_roles').ifExists().execute()
  await db.schema.dropTable('roles').ifExists().execute()
}
