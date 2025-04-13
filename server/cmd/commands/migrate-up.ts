import { defineCommand, showUsage } from 'citty'
import { runMigration } from '~/database/migrator'
import logger from '~/utils/logger'

export default defineCommand({
  meta: {
    name: 'up',
    description: 'Migrate the database schema to the latest version',
  },
  args: {
    help: {
      type: 'boolean',
      description: 'Print information about the command',
      default: false,
    },
  },
  async run({ args, cmd }) {
    // Show help page if --help flag is used
    if (args.help) {
      showUsage(cmd)
      return
    }

    try {
      logger.withTag('migration').info('Running database migration...')
      await runMigration('migrate')
      logger.withTag('migration').info('Database migration completed successfully')
      process.exit(0)
    } catch (error) {
      logger
        .withTag('migration')
        .error(error instanceof Error ? error.message : 'Unknown error occurred')
      process.exit(1)
    }
  },
})
