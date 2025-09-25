/**
 * Configures the Kysely database client with the appropriate dialect and plugins.
 *
 * The configuration includes the following plugins:
 * - `CamelCasePlugin`: Automatically converts column names to camelCase.
 * - `ParseJSONResultsPlugin`: Automatically parses JSON columns.
 *
 * @see https://www.kysely.dev/docs/dialects
 * @see https://github.com/kysely-org/kysely-postgres-js
 */

import { resolve } from 'node:path'
import { PGlite } from '@electric-sql/pglite'
import { pg_trgm } from '@electric-sql/pglite/contrib/pg_trgm'
import { uuid_ossp } from '@electric-sql/pglite/contrib/uuid_ossp'
import { PGliteDialect as KyselyPGliteDialect } from '@squelify/kysely-pglite'
import type { ErrorLogEvent, KyselyConfig, QueryLogEvent } from 'kysely'
import { CamelCasePlugin, Kysely, ParseJSONResultsPlugin } from 'kysely'
import { PostgresJSDialect } from 'kysely-postgres-js'
import postgres from 'postgres'
import { env } from 'std-env'
import type { Database } from '~/database/db.schema'
import logger from '~/utils/logger'

// Using the PGLite dialect with persistence to disk
// Read more about the extensions here: https://pglite.dev/extensions
// Read more about the options here: https://pglite.dev/docs/api
const PGliteDialect = new KyselyPGliteDialect(
  new PGlite(resolve('storage/pgdata'), {
    extensions: { pg_trgm, uuid_ossp },
  })
)

const PostgresDialect = new PostgresJSDialect({
  postgres: postgres(String(env.DATABASE_URL)),
})

const getDialect = () => {
  switch (String(env.DATABASE_ENGINE).toLowerCase()) {
    case 'postgres':
      return PostgresDialect
    case 'pglite':
      return PGliteDialect
    default:
      logger.warn(`Unknown DATABASE_ENGINE "${env.DATABASE_ENGINE}", falling back to pglite.`)
      return PGliteDialect
  }
}

export const kyselyConfig: KyselyConfig = {
  dialect: getDialect(),
  plugins: [new CamelCasePlugin(), new ParseJSONResultsPlugin()],
}

// Initialize Kysely instance with logging capabilities
export default new Kysely<Database>({
  ...kyselyConfig,
  log: (event: QueryLogEvent | ErrorLogEvent): void => {
    if (event.level === 'query' && String(env.APP_LOG_LEVEL).toLowerCase() === 'trace') {
      logger.withTag('kysely').debug(event.query.sql, event.query.parameters)
      return
    }

    if (event.level === 'error' && String(env.APP_LOG_LEVEL).toLowerCase() === 'debug') {
      logger.withTag('kysely').error(event.error)
    }
  },
})
