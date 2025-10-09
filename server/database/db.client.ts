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

import type { ErrorLogEvent, KyselyConfig, QueryLogEvent } from 'kysely'
import { CamelCasePlugin, Kysely, ParseJSONResultsPlugin } from 'kysely'
import { PostgresJSDialect } from 'kysely-postgres-js'
import postgres from 'postgres'
import { env } from 'std-env'
import type { Database } from '~/database/db.schema'
import logger from '~/utils/logger'

const DialectPostgres = new PostgresJSDialect({
  postgres: postgres(String(env.SQUELIFY_DATABASE_URL)),
})

export const kyselyConfig: KyselyConfig = {
  dialect: DialectPostgres,
  plugins: [new CamelCasePlugin(), new ParseJSONResultsPlugin()],
}

// Initialize Kysely instance with logging capabilities
export default new Kysely<Database>({
  ...kyselyConfig,
  log: (event: QueryLogEvent | ErrorLogEvent): void => {
    if (event.level === 'query' && String(env.SQUELIFY_LOG_LEVEL).toLowerCase() === 'trace') {
      logger.withTag('kysely').debug(event.query.sql, event.query.parameters)
      return
    }

    if (event.level === 'error' && String(env.SQUELIFY_LOG_LEVEL).toLowerCase() === 'debug') {
      logger.withTag('kysely').error(event.error)
    }
  },
})
