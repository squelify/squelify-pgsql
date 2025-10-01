import { defineProtectedEventHandler } from '~/http/handlers'

export default defineProtectedEventHandler(async (event) => {
  const tableName = event.context.params?.table
  const queryParams = getQuery(event)

  logger.info(`Fetching data from table: ${tableName}`)

  return {
    message: 'Not implemented yet',
    fullUrl: event.node.req.url,
    params: event.context.params,
    query: queryParams,
    method: event.method,
  }
})
