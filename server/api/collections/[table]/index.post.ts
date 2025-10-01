import { sql } from 'kysely'
import { defineProtectedEventHandler } from '~/http/handlers'

// Example usage:
// curl -X POST "http://localhost:3080/api/collections/internal.users" \
//   -H "Content-Type: application/json" \
//   -H "X-API-Key: pub_xxxxxx" \
//   -d '{"email":"newuser@example.com","username":"new_user","display_name":"New User","metadata":{"role":"user"}}'

// Reuse identifier sanitizer for table name
function sanitizeIdentifier(str: string) {
  const parts = str.split('.')
  if (parts.length > 2 || parts.some((part) => !/^[a-zA-Z0-9_]+$/.test(part)))
    throw new Error('Invalid identifier')
  return parts.join('.')
}

export default defineProtectedEventHandler(async (event) => {
  const tableNameRaw = event.context.params?.table
  if (!tableNameRaw) return { error: 'Table name is required' }

  let tableName: string
  try {
    tableName = sanitizeIdentifier(tableNameRaw)
  } catch {
    return { error: 'Invalid table name' }
  }

  const db = event.context.db

  // Parse JSON body for insert fields
  const body = await readBody(event)
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Request body must be a JSON object with fields to insert' }
  }

  // Build columns and values arrays
  const columns: string[] = []
  const values: any[] = []
  for (const [key, value] of Object.entries(body)) {
    try {
      columns.push(sanitizeIdentifier(key))
      values.push(value)
    } catch {
      return { error: `Invalid column name: ${key}` }
    }
  }
  if (columns.length === 0) {
    return { error: 'No fields to insert' }
  }

  try {
    // Insert row and return the inserted data
    const sqlQuery = sql`
      INSERT INTO ${sql.raw(tableName)}
      (${sql.raw(columns.join(', '))})
      VALUES (${sql.join(
        values.map((v) => sql`${v}`),
        sql`, `
      )})
      RETURNING *
    `
    const compiledQuery = sqlQuery.compile(db)
    const result = await db.executeQuery(compiledQuery)
    const inserted = Array.isArray(result.rows) ? (result.rows[0] ?? null) : (result.rows ?? null)

    return {
      success: !!inserted,
      table: tableName,
      inserted,
      method: event.method,
      url: event.node.req.url,
    }
  } catch (error: unknown) {
    logger.error(error)
    return { error: 'Failed to insert row', details: (error as Error).message }
  }
})
