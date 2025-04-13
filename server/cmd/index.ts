import 'dotenv/config'
import { defineCommand, runMain, showUsage } from 'citty'
import { appConfig } from '~~/app.config'

const main = defineCommand({
  meta: {
    name: 'cmd',
    version: appConfig.version,
    description: `${appConfig.meta.title} Command Line Interface`,
  },
  args: {
    help: {
      type: 'boolean',
      description: 'Print information about the application',
      default: false,
    },
  },
  subCommands: {
    'db:migrate': () => import('./commands/migrate').then((r) => r.default),
    'db:reset': () => import('./commands/db-reset').then((r) => r.default),
    'db:seed': () => import('./commands/db-seed').then((r) => r.default),
    'db:status': () => import('./commands/db-status').then((r) => r.default),
    'make:app-key': () => import('./commands/make-app-key').then((r) => r.default),
    'make:migration': () => import('./commands/make-migration').then((r) => r.default),
    'make:seeder': () => import('./commands/make-seeder').then((r) => r.default),
  },
  async run({ args, cmd }) {
    // Show help page if --help flag is used or no subcommand provided
    if (args.help || args._.length === 0) {
      showUsage(cmd)
      return
    }
  },
})

runMain(main)
