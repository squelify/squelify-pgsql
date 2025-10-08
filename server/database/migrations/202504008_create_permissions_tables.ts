// For more info, see: https://kysely.dev/docs/migrations
// Up migrations are mandatory. you must implement this function.
// Down migrations are optional. you can safely delete this function.

import { type Kysely, sql } from 'kysely'
import * as dbHelper from '~/database/db.helper'
import type { Database } from '~/database/db.schema'

const SCHEMA = 'internal'

export const up = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema(SCHEMA)

  // permissions
  await db.schema
    .createTable('permissions')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().notNull().defaultTo(dbHelper.DEFAULT_UUID_v7)
    )
    .addColumn('name', 'text', (col) => col.notNull().unique())
    .addColumn('slug', 'text', (col) => col.notNull().unique())
    .addColumn('description', 'text', (col) => col.defaultTo(null))
    .addColumn('resource_type', 'text', (col) => col.notNull())
    .addColumn('action', 'text', (col) => col.notNull())
    .addColumn('is_active', 'boolean', (col) => col.notNull().defaultTo(true))
    .addColumn('last_used_at', 'timestamptz', (col) => col.defaultTo(null))
    .$call(dbHelper.addColumnTimestamps)
    .modifyEnd(sql`USING heap`)
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_permissions_name')
    .on('permissions')
    .column('name')
    .using('btree')
    .ifNotExists()
    .execute()
  await db.schema
    .createIndex('idx_permissions_slug')
    .on('permissions')
    .column('slug')
    .using('btree')
    .ifNotExists()
    .execute()
  await db.schema
    .createIndex('idx_permissions_resource_type')
    .on('permissions')
    .column('resource_type')
    .using('btree')
    .ifNotExists()
    .execute()
  await db.schema
    .createIndex('idx_permissions_action')
    .on('permissions')
    .column('action')
    .using('btree')
    .ifNotExists()
    .execute()
  await db.schema
    .createIndex('idx_permissions_is_active')
    .on('permissions')
    .column('is_active')
    .using('btree')
    .ifNotExists()
    .execute()

  // role_permissions
  await db.schema
    .createTable('role_permissions')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().notNull().defaultTo(dbHelper.DEFAULT_UUID_v7)
    )
    .addColumn('role_id', 'uuid', (col) => col.notNull().references('roles.id').onDelete('cascade'))
    .addColumn('permission_id', 'uuid', (col) =>
      col.notNull().references('permissions.id').onDelete('cascade')
    )
    .$call(dbHelper.addColumnTimestamps)
    .addUniqueConstraint('role_permission_unique', ['role_id', 'permission_id'])
    .modifyEnd(sql`USING heap`)
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('idx_role_permissions_role_id')
    .on('role_permissions')
    .column('role_id')
    .using('btree')
    .ifNotExists()
    .execute()
  await db.schema
    .createIndex('idx_role_permissions_permission_id')
    .on('role_permissions')
    .column('permission_id')
    .using('btree')
    .ifNotExists()
    .execute()

  // user_permissions
  await db.schema
    .createTable('user_permissions')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().notNull().defaultTo(dbHelper.DEFAULT_UUID_v7)
    )
    .addColumn('user_id', 'uuid', (col) => col.notNull().references('users.id').onDelete('cascade'))
    .addColumn('permission_id', 'uuid', (col) =>
      col.notNull().references('permissions.id').onDelete('cascade')
    )
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
    .createIndex('idx_user_permissions_user_id')
    .on('user_permissions')
    .column('user_id')
    .using('btree')
    .ifNotExists()
    .execute()
  await db.schema
    .createIndex('idx_user_permissions_permission_id')
    .on('user_permissions')
    .column('permission_id')
    .using('btree')
    .ifNotExists()
    .execute()
  await db.schema
    .createIndex('idx_user_permissions_scope')
    .on('user_permissions')
    .columns(['scope_type', 'scope_id'])
    .using('btree')
    .ifNotExists()
    .execute()
  await db.schema
    .createIndex('idx_user_permissions_is_active')
    .on('user_permissions')
    .column('is_active')
    .using('btree')
    .ifNotExists()
    .execute()
}

export const down = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema(SCHEMA)
  await db.schema.dropTable('user_permissions').ifExists().execute()
  await db.schema.dropTable('role_permissions').ifExists().execute()
  await db.schema.dropTable('permissions').ifExists().execute()
}
