import { sql } from 'kysely'
import { defineProtectedEventHandler } from '~/http/handlers'

export default defineProtectedEventHandler(async (event) => {
  const tableName = event.context.params?.table
  const queryParams = getQuery(event)
  const db = event.context.db

  logger.info(`Fetching data from table: ${tableName}`)

  if (!tableName) {
    return { error: 'Table name is required' }
  }

  try {
    const rows = await sql.raw<any>(`SELECT * FROM ${tableName}`).execute(db)

    return {
      data: rows,
      fullUrl: event.node.req.url,
      params: event.context.params,
      query: queryParams,
      method: event.method,
    }
  } catch (error: unknown) {
    logger.error(error)
    return { error: 'Failed to fetch data', details: (error as Error).message }
  }
})
