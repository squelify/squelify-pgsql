import { IncomingHttpHeaders } from 'node:http'
import { Kysely } from 'kysely'
import { Database } from '~/database/db.schema'

/**
 * Context holds data that all of your oRPC procedures will
 * have access to, and is a great place to put things like
 * database connections or authentication information.
 *
 * @link https://orpc.unnoq.com/docs/context
 */
export interface ORPCContext {
  headers: IncomingHttpHeaders
  db: Kysely<Database>
}
