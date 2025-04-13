import type { Kysely, Migration } from 'kysely'
import type { Database } from './db.schema'

interface DatabaseMigration {
  readonly name: string
  readonly migration: Migration
}

export async function getMigrationItems(): Promise<DatabaseMigration[]> {
  return [
    {
      name: '202412000_initialize_schema',
      migration: await import('./migrations/202504000_initialize_schema'),
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
