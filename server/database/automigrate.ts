import type { Kysely, Migration } from 'kysely'
import type { Database } from './db.schema'

interface DatabaseMigration {
  readonly name: string
  readonly migration: Migration
}

export async function getMigrationItems(): Promise<DatabaseMigration[]> {
  return [
    {
      name: '202504000_initialize_schema',
      migration: await import('./migrations/202504000_initialize_schema'),
    },
    {
      name: '202504001_create_users_table',
      migration: await import('./migrations/202504001_create_users_table'),
    },
    {
      name: '202504002_create_user_passwords_table',
      migration: await import('./migrations/202504002_create_user_passwords_table'),
    },
    {
      name: '202504003_create_user_phones_table',
      migration: await import('./migrations/202504003_create_user_phones_table'),
    },
    {
      name: '202504004_create_sessions_table',
      migration: await import('./migrations/202504004_create_sessions_table'),
    },
    {
      name: '202504005_create_refresh_tokens_table',
      migration: await import('./migrations/202504005_create_refresh_tokens_table'),
    },
    {
      name: '202504006_create_one_time_tokens_table',
      migration: await import('./migrations/202504006_create_one_time_tokens_table'),
    },
    {
      name: '202504007_create_roles_permissions_tables',
      migration: await import('./migrations/202504007_create_roles_permissions_tables'),
    },
    {
      name: '202504008_create_api_keys_table',
      migration: await import('./migrations/202504008_create_api_keys_table'),
    },
    {
      name: '202504009_create_audit_logs_table',
      migration: await import('./migrations/202504009_create_audit_logs_table'),
    },
    {
      name: '202504010_create_app_settings_table',
      migration: await import('./migrations/202504010_create_app_settings_table'),
    },
    {
      name: '202504011_create_webhooks_table',
      migration: await import('./migrations/202504011_create_webhooks_table'),
    },
  ]
}

interface DatabaseSeeder {
  readonly name: string
  readonly seeder: { default: (db: Kysely<Database>) => Promise<void> }
}

export async function getSeederItems(): Promise<DatabaseSeeder[]> {
  return []
}
