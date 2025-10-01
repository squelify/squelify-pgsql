import { sql } from 'kysely'
import { defineProtectedEventHandler } from '~/http/handlers'

// Example usage:
// curl -X PUT "http://localhost:3080/api/collections/internal.users/UUID_ROW" \
//   -H "Content-Type: application/json" \
//   -H "X-API-Key: pub_xxxxxx" \
//   -d '{"display_name":"New Admin","email":"admin@example.com"}'

// Reuse identifier sanitizer for table name
function sanitizeIdentifier(str: string) {
  const parts = str.split('.')
  if (parts.length > 2 || parts.some((part) => !/^[a-zA-Z0-9_]+$/.test(part)))
    throw new Error('Invalid identifier')
  return parts.join('.')
}

export default defineProtectedEventHandler(async (event) => {
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

  const db = event.context.db

  // Parse JSON body for update fields
  const body = await readBody(event)
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Request body must be a JSON object with fields to update' }
  }

  // Build SET clause dynamically from body keys
  const setClauses: any[] = []
  for (const [key, value] of Object.entries(body)) {
    try {
      setClauses.push(sql`${sql.raw(sanitizeIdentifier(key))} = ${value}`)
    } catch {
      return { error: `Invalid column name: ${key}` }
    }
  }
  if (setClauses.length === 0) {
    return { error: 'No fields to update' }
  }

  try {
    // Update row by primary key 'id'
    const sqlQuery = sql`
      UPDATE ${sql.raw(tableName)}
      SET ${sql.join(setClauses, sql`, `)}
      WHERE id = ${rowId}
      RETURNING *
    `
    const compiledQuery = sqlQuery.compile(db)
    const result = await db.executeQuery(compiledQuery)
    const updated = Array.isArray(result.rows) ? (result.rows[0] ?? null) : (result.rows ?? null)

    return {
      success: !!updated,
      table: tableName,
      id: rowId,
      updated,
      method: event.method,
      url: event.node.req.url,
    }
  } catch (error: unknown) {
    logger.error(error)
    return { error: 'Failed to update row', details: (error as Error).message }
  }
})
