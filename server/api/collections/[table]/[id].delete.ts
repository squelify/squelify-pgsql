import { sql } from 'kysely'
import { defineProtectedEventHandler } from '~/http/handlers'

// curl -X DELETE "http://localhost:3080/api/collections/internal.users/UUID_ROW" \
//   -H "Content-Type: application/json" \
//   -H "X-API-Key: pub_xxxxxx"

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

  try {
    // Delete row by primary key 'id'
    const sqlQuery = sql`
      DELETE FROM ${sql.raw(tableName)}
      WHERE id = ${rowId}
      RETURNING *
    `
    const compiledQuery = sqlQuery.compile(db)
    const result = await db.executeQuery(compiledQuery)
    const deleted = Array.isArray(result.rows) ? (result.rows[0] ?? null) : (result.rows ?? null)

    return {
      success: !!deleted,
      table: tableName,
      id: rowId,
      deleted,
    }
  } catch (error: unknown) {
    logger.error(error)
    return { error: 'Failed to delete row', details: (error as Error).message }
  }
})
