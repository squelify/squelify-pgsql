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
    .addColumn('id', 'uuid', (col) => col.primaryKey().notNull().defaultTo(sql`uuidv7()`))
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
  await dbHelper.createColumnIndex(db, 'roles', 'name').using('btree').execute()
  await dbHelper.createColumnIndex(db, 'roles', 'slug').using('btree').execute()
  await dbHelper.createColumnIndex(db, 'roles', 'role_type').using('btree').execute()
  await dbHelper.createColumnIndex(db, 'roles', 'is_active').using('btree').execute()
  await dbHelper.createColumnIndex(db, 'roles', 'created_at').using('btree').execute()
  await dbHelper.createColumnIndex(db, 'roles', 'updated_at').using('btree').execute()

  // permissions
  await db.schema
    .createTable('permissions')
    .addColumn('id', 'uuid', (col) => col.primaryKey().notNull().defaultTo(sql`uuidv7()`))
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
  await dbHelper.createColumnIndex(db, 'permissions', 'name').using('btree').execute()
  await dbHelper.createColumnIndex(db, 'permissions', 'slug').using('btree').execute()
  await dbHelper.createColumnIndex(db, 'permissions', 'resource_type').using('btree').execute()
  await dbHelper.createColumnIndex(db, 'permissions', 'action').using('btree').execute()
  await dbHelper.createColumnIndex(db, 'permissions', 'is_active').using('btree').execute()
  await dbHelper.createColumnIndex(db, 'permissions', 'created_at').using('btree').execute()
  await dbHelper.createColumnIndex(db, 'permissions', 'updated_at').using('btree').execute()

  // role_permissions
  await db.schema
    .createTable('role_permissions')
    .addColumn('id', 'uuid', (col) => col.primaryKey().notNull().defaultTo(sql`uuidv7()`))
    .addColumn('role_id', 'uuid', (col) => col.notNull().references('roles.id').onDelete('cascade'))
    .addColumn('permission_id', 'uuid', (col) =>
      col.notNull().references('permissions.id').onDelete('cascade')
    )
    .$call(dbHelper.addColumnTimestamps)
    .addUniqueConstraint('role_permission_unique', ['role_id', 'permission_id'])
    .modifyEnd(sql`USING heap`)
    .ifNotExists()
    .execute()
  await dbHelper.createColumnIndex(db, 'role_permissions', 'role_id').using('btree').execute()
  await dbHelper.createColumnIndex(db, 'role_permissions', 'permission_id').using('btree').execute()
  await dbHelper.createColumnIndex(db, 'role_permissions', 'created_at').using('btree').execute()
  await dbHelper.createColumnIndex(db, 'role_permissions', 'updated_at').using('btree').execute()

  // user_roles
  await db.schema
    .createTable('user_roles')
    .addColumn('id', 'uuid', (col) => col.primaryKey().notNull().defaultTo(sql`uuidv7()`))
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
  await dbHelper.createColumnIndex(db, 'user_roles', 'user_id').using('btree').execute()
  await dbHelper.createColumnIndex(db, 'user_roles', 'role_id').using('btree').execute()
  await dbHelper
    .createColumnsIndex(db, 'user_roles', ['scope_type', 'scope_id'])
    .using('btree')
    .execute()
  await dbHelper.createColumnIndex(db, 'user_roles', 'is_active').using('btree').execute()
  await dbHelper.createColumnIndex(db, 'user_roles', 'created_at').using('btree').execute()
  await dbHelper.createColumnIndex(db, 'user_roles', 'updated_at').using('btree').execute()

  // user_permissions
  await db.schema
    .createTable('user_permissions')
    .addColumn('id', 'uuid', (col) => col.primaryKey().notNull().defaultTo(sql`uuidv7()`))
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
  await dbHelper.createColumnIndex(db, 'user_permissions', 'user_id').using('btree').execute()
  await dbHelper.createColumnIndex(db, 'user_permissions', 'permission_id').using('btree').execute()
  await dbHelper
    .createColumnsIndex(db, 'user_permissions', ['scope_type', 'scope_id'])
    .using('btree')
    .execute()
  await dbHelper.createColumnIndex(db, 'user_permissions', 'is_active').using('btree').execute()
  await dbHelper.createColumnIndex(db, 'user_permissions', 'created_at').using('btree').execute()
  await dbHelper.createColumnIndex(db, 'user_permissions', 'updated_at').using('btree').execute()
}

export const down = async (database: Kysely<Database>): Promise<void> => {
  const db = database.withSchema(SCHEMA)
  await db.schema.dropTable('user_permissions').ifExists().execute()
  await db.schema.dropTable('user_roles').ifExists().execute()
  await db.schema.dropTable('role_permissions').ifExists().execute()
  await db.schema.dropTable('permissions').ifExists().execute()
  await db.schema.dropTable('roles').ifExists().execute()
}
