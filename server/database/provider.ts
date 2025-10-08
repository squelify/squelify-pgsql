import fs from 'node:fs/promises'
import { join, relative, resolve } from 'node:path'
import type { Migration, MigrationProvider } from 'kysely'
import { env } from 'std-env'
import { getMigrationItems } from './automigrate'

export default class NitroMigrator implements MigrationProvider {
  private readonly resolvedPath: string
  private readonly shouldAutoMigrate: boolean

  constructor(absolutePath: string) {
    // Run migrations by default unless explicitly disabled
    const isRunningFromCLI = (): boolean => process.argv.length > 2
    this.shouldAutoMigrate = !isRunningFromCLI() && env.DATABASE_AUTO_MIGRATE !== 'false'

    // Get database migrations folder
    this.resolvedPath = resolve(import.meta.dirname, absolutePath)
  }

  async getMigrations(): Promise<Record<string, Migration>> {
    // ESM File Migration mode
    if (!this.shouldAutoMigrate) {
      const files: string[] = [] // Require 'node:fs/promises' (Node 22+)
      for await (const file of fs.glob(`${this.resolvedPath}/**/*.ts`)) {
        files.push(relative(this.resolvedPath, file))
      }

      return Object.fromEntries(
        await Promise.all(
          files
            .filter((fileName) => fileName.endsWith('.ts'))
            .map(async (fileName) => {
              const migrationKey = fileName.slice(0, -3)
              const importPath = join(this.resolvedPath, fileName).replace(/\\/g, '/')
              const migration = await import(/* @vite-ignore */ importPath)
              return [migrationKey, migration.default || migration] as const
            })
        )
      )
    }

    // TODO: improve this to automatically detect migrations from storage
    // Automatic Migration mode (run when app is started)
    const migrationItems = await getMigrationItems()
    const migrationEntries = await Promise.all(
      migrationItems.map(async ({ name, migration }) => [name, migration])
    )

    return Object.fromEntries(migrationEntries)
  }
}
