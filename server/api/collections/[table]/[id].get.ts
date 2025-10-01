import { sql } from 'kysely'
import { defineProtectedEventHandler } from '~/http/handlers'

// Example usage:
// curl -X GET "http://localhost:3080/api/collections/internal.users/UUID_ROW?apiKey=pub_xxxxxx&select=id,email,display_name"

// Reuse identifier sanitizer from index.get.ts
function sanitizeIdentifier(str: string) {
  const parts = str.split('.')
  if (parts.length > 2 || parts.some((part) => !/^[a-zA-Z0-9_]+$/.test(part)))
    throw new Error('Invalid identifier')
  return parts.join('.')
}

export default defineProtectedEventHandler(async (event) => {
  // Get table name and row id from route parameters
  const tableNameRaw = event.context.params?.table
  const rowId = event.context.params?.id
  if (!tableNameRaw) return { error: 'Table name is required' }
  if (!rowId) return { error: 'Row id is required' }

  let tableName: string
  try {
    tableName = sanitizeIdentifier(tableNameRaw)
  } catch {
    return { error: 'Invalid table name' }
  }

  // Optional: allow select parameter for specific columns
  const queryParams = getQuery(event)
  let selectClause = sql`*`
  if (typeof queryParams.select === 'string') {
    const columns = queryParams.select.split(',').map(sanitizeIdentifier)
    selectClause = sql`${sql.raw(columns.join(', '))}`
  }

  const db = event.context.db

  try {
    // Build SQL query for detail row by id (assume primary key column is 'id')
    const sqlQuery = sql`
      SELECT ${selectClause}
      FROM ${sql.raw(tableName)}
      WHERE id = ${rowId}
      LIMIT 1
    `
    const compiledQuery = sqlQuery.compile(db)
    const rows = await db.executeQuery(compiledQuery)
    const data = Array.isArray(rows.rows) ? (rows.rows[0] ?? null) : (rows.rows ?? null)

    // Extract selected fields from query parameter, or return 'all'
    const fields =
      typeof queryParams.select === 'string'
        ? queryParams.select.split(',').map((f) => f.trim())
        : 'all'

    return {
      success: true,
      table: tableName,
      id: rowId,
      fields,
      data,
    }
  } catch (error: unknown) {
    logger.error(error)
    return { error: 'Failed to fetch data', details: (error as Error).message }
  }
})
