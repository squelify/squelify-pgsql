/**
 * Export PostgreSQL Database schema to SQL file
 *
 * This command exports the current database schema including:
 * - Table definitions (CREATE TABLE statements)
 * - Index definitions (CREATE INDEX statements)
 * - Unique index definitions (CREATE UNIQUE INDEX statements)
 * - Constraint definitions (ALTER TABLE ADD CONSTRAINT statements)
 * - Sequence definitions (CREATE SEQUENCE statements)
 * - Function definitions (CREATE FUNCTION statements)
 *
 * Features:
 * - All CREATE statements are made idempotent where possible
 * - System schemas (pg_catalog, information_schema) are excluded
 * - Output filename includes UTC timestamp
 * - Includes database version info
 * - Wrapped in transaction
 *
 * Usage:
 *   pnpm -s cmd db:export
 *   pnpm -s cmd db:export --output=output.sql
 *   pnpm -s cmd db:export --verbose
 *   pnpm -s cmd db:export --help
 */

import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { defineCommand, showUsage } from 'citty'
import consola from 'consola'
import { makeDirectory } from 'make-dir'
import postgres from 'postgres'
import { env } from 'std-env'
import { getDatabaseVersion, getSqlHeader, getTimestamp } from '../pgdump/utils'

export default defineCommand({
  meta: {
    name: 'db:export',
    description: 'Export current PostgreSQL database schema to SQL file',
  },
  args: {
    output: {
      type: 'string',
      description: 'Output file path',
      default: 'schema.sql',
      required: false,
    },
    schema: {
      type: 'string',
      description: 'Schema to export (default: public)',
      default: 'public',
      required: false,
    },
    verbose: {
      type: 'boolean',
      description: 'Verbose output (default: false)',
      required: false,
      alias: 'v',
    },
    help: {
      type: 'boolean',
      description: 'Print information about the command',
      default: false,
    },
  },
  async setup() {
    await makeDirectory(resolve('storage/backup'), { mode: 0o755 })
  },
  async run({ args, cmd }) {
    if (args.help) {
      showUsage(cmd)
      return
    }

    // Prepare the filename with timestamp
    const filename = args.output.replace('.sql', `-${getTimestamp()}.sql`)
    const exportPath = `storage/backup/${filename}`

    try {
      consola.start('Exporting Squelify database:', exportPath)

      const sql = postgres(String(env.DATABASE_URL))
      const dbVersion = await getDatabaseVersion(sql)

      // TODO: add table, indexes, constraints, etc.
      const schema = [getSqlHeader(dbVersion)].join('\n\n')

      const outputPath = resolve(process.cwd(), exportPath)
      writeFileSync(outputPath, schema, 'utf-8')

      consola.success('Database exported successfully:', exportPath)

      process.exit(0)
    } catch (error) {
      consola.error(error instanceof Error ? error.message : 'Unknown error occurred')
      process.exit(1)
    }
  },
})
