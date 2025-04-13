import { env } from 'std-env'
import { runMigration, runSeeds } from '~/database/migrator'
import logger from '~/utils/logger'

/**
 * Automatically runs database migrations on application startup.
 * This will run by default unless explicitly disabled by setting
 * DATABASE_AUTO_MIGRATE=false. Migration runs only once when the
 * application starts.
 *
 * This flag indicate whether the migration has been carried out.
 */
let migrationExecuted = false
let seederExecuted = false

export default defineNitroPlugin(async (_nitroApp) => {
  if (migrationExecuted || seederExecuted) return

  const shouldAutoMigrate = env.DATABASE_AUTO_MIGRATE !== 'false'

  if (!shouldAutoMigrate) {
    logger.withTag('migration').info('Skipped automatic database migration')
    return
  }

  try {
    // Execute system migrations
    logger.withTag('migration').info('Running database migrations...')
    await runMigration('migrate').then(() => {
      logger.withTag('migration').info('Database migrations completed successfully')
      migrationExecuted = true
    })

    // Execute automated seeders
    logger.withTag('migration').info('Populating database with seeders...')
    await runSeeds().then(() => {
      logger.withTag('migration').info('Database seeders completed successfully')
      seederExecuted = true
    })
  } catch (err) {
    logger.withTag('migration').error(`Automatic migrations failed: ${(err as Error).message}`)
  }
})
