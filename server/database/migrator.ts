import { join } from 'node:path'
import process from 'node:process'
import { styleText } from 'node:util'
import { Kysely, Migrator, NO_MIGRATIONS } from 'kysely'
import { env } from 'std-env'
import { kyselyConfig } from '~/database/db.client'
import type { Database } from '~/database/db.schema'
import NitroMigrator from '~/database/provider'
import logger from '~/utils/logger'
import { getSeederItems } from './automigrate'

export const MIGRATION_FOLDER = join(process.cwd(), 'server/database/migrations')
export const SEEDER_FOLDER = join(process.cwd(), 'server/database/seeders')

type MigrationAction = 'migrate' | 'rollback' | 'reset'

export const migrateDBClient = new Kysely<Database>({
  ...kyselyConfig,
  // Only log errors and queries if the log level is `trace`
  log:
    String(env.SQUELIFY_APP_LOG_LEVEL).toLowerCase() === 'trace' ? ['error', 'query'] : ['error'],
})

export const migrateClient = new Migrator({
  db: migrateDBClient,
  provider: new NitroMigrator(MIGRATION_FOLDER),
  migrationTableSchema: 'internal',
  migrationTableName: 'app_migrations',
  migrationLockTableName: 'app_migration_lock',
  allowUnorderedMigrations: false,
})

export async function runSeeds(): Promise<void> {
  try {
    // Get seeders item from the defined list
    const seeders = await getSeederItems()

    if (seeders.length > 0) {
      for (const { name, seeder } of seeders) {
        logger.withTag('migration:seed').info(`Table ${name} will be populated with seed data.`)
        await seeder.default(migrateDBClient).then(() => {
          logger.withTag('migration:seed').info(`Table ${name} has been populated with seed data.`)
        })
      }
    } else {
      logger.withTag('migration:seed').info('No seeders provided. Skipping database seeding.')
    }
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error)
    logger.withTag('migration:seed').error('Database seeding failed:', errMsg)
    throw error
  }
}

// Helper function to check if the script is running from the CLI
const isRunningFromCLI = (): boolean => process.argv.length > 2

const migrationActions: Record<MigrationAction, () => Promise<void>> = {
  migrate: async () => {
    const { error, results } = await migrateClient.migrateToLatest()

    if (results) {
      for (const it of results) {
        const migrationName = styleText('green', `${it.migrationName}:up`)
        if (it.status === 'Success') {
          logger
            .withTag('migration:migrate')
            .info(`Migration ${migrationName} was executed successfully`)
        } else if (it.status === 'Error') {
          logger.withTag('migration:migrate').error(`Failed to execute migration ${migrationName}`)
        }
      }
    }

    if (error) {
      logger.withTag('migration:migrate').error('Failed to migrate:', error)
      if (isRunningFromCLI()) {
        process.exit(1)
      }
    }
  },
  rollback: async () => {
    const { error, results } = await migrateClient.migrateDown()

    if (results) {
      for (const it of results) {
        const migrationName = styleText('green', `${it.migrationName}:down`)
        if (it.status === 'Success') {
          logger
            .withTag('migration:rollback')
            .info(`Migration ${migrationName} was executed successfully`)
        } else if (it.status === 'Error') {
          logger.withTag('migration:rollback').error(`Failed to execute migration ${migrationName}`)
        }
      }
    }

    if (error) {
      logger.withTag('migration:rollback').error('Failed to rollback:', error)
      if (isRunningFromCLI()) {
        process.exit(1)
      }
    }
  },
  reset: async () => {
    await migrateClient
      .migrateTo(NO_MIGRATIONS)
      .then(async () => {
        logger.withTag('migration:reset').info('Database has been reset successfully')

        // If has parameter --migrate then run the migration.
        if (process.argv.includes('--migrate')) {
          logger.withTag('migration').info('Running database migration...')
          await runMigration('migrate')
        }

        // If has parameter --seed then run the migration.
        if (process.argv.includes('--seed')) {
          logger.withTag('migration').info('Populating database with seeders...')
          await runSeeds()
        }

        process.exit(0)
      })
      .catch((e) => {
        logger.withTag('migration').error('Failed to reset database:', e.message)
        if (isRunningFromCLI()) {
          process.exit(1)
        }
      })
      .finally(async () => await migrateDBClient.destroy())
  },
}

export async function runMigration(action: MigrationAction): Promise<void> {
  try {
    await migrationActions[action]()
  } catch (error) {
    logger.withTag('migration').error(`Migration action '${action}' failed:`, error)
    throw error
  }
}
