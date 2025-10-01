import { sql } from 'kysely'
import type { QueryObject } from 'ufo'
import { defineProtectedEventHandler } from '~/http/handlers'

// Example usage:
// http://localhost:3080/api/collections/internal.users?apiKey=pub_xxxxxx&select=id,email,username,display_name,created_at,last_login_at,banned_at&order=created_at.desc&limit=10&offset=20&display_name=ilike.John*&email=ilike.%@gmail.com&username=eq.john_doe&banned_at=is.NULL&metadata=cs.{%22role%22:%22admin%22}

// Map of supported query operators to their SQL equivalents
const operatorMap: Record<string, string> = {
  eq: '=',
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<=',
  neq: '<>',
  like: 'LIKE',
  ilike: 'ILIKE',
  match: '~',
  imatch: '~*',
  in: 'IN',
  is: 'IS',
  isdistinct: 'IS DISTINCT FROM',
  fts: '@@',
  plfts: '@@',
  phfts: '@@',
  wfts: '@@',
  cs: '@>',
  cd: '<@',
  ov: '&&',
  sl: '<<',
  sr: '>>',
  nxr: '&<',
  nxl: '&>',
  adj: '-|-',
  not: 'NOT',
  or: 'OR',
  and: 'AND',
  all: 'ALL',
  any: 'ANY',
}

// Validate table and column names to prevent SQL injection.
// Accepts schema.table format and checks each part.
function sanitizeIdentifier(str: string) {
  const parts = str.split('.')
  if (parts.length > 2 || parts.some((part) => !/^[a-zA-Z0-9_]+$/.test(part)))
    throw new Error('Invalid identifier')
  return parts.join('.')
}

// Parse query parameters into SQL WHERE clauses using Kysely's SQL builder.
// Handles various operators, including JSON containment and NULL checks.
function parseQueryOperators(query: QueryObject) {
  const clauses: any[] = []

  for (const [field, raw] of Object.entries(query)) {
    // Skip reserved keywords for pagination, selection, and ordering
    if (['limit', 'offset', 'order', 'select'].includes(field)) continue
    if (typeof raw !== 'string' || !raw) continue
    const [op, ...rest] = raw.split('.')
    let value = rest.join('.')
    const sqlOp = operatorMap[op]
    if (!sqlOp) continue

    const safeField = sanitizeIdentifier(field)

    // Handle 'IN' operator with multiple values
    if (op === 'in') {
      const inValues = value.replace(/^\(|\)$/g, '').split(',')
      clauses.push(
        sql`${sql.raw(safeField)} IN (${sql.join(
          inValues.map((v) => sql`${v}`),
          sql`,`
        )})`
      )
      // Handle LIKE/ILIKE operator with wildcard conversion
    } else if (op === 'like' || op === 'ilike') {
      clauses.push(sql`${sql.raw(safeField)} ${sql.raw(sqlOp)} ${value.replace(/\*/g, '%')}`)
      // Handle JSON containment operators (cs, cd, ov)
    } else if (['cs', 'cd', 'ov'].includes(op)) {
      try {
        // Parse JSON value from URL encoding
        value = JSON.parse(decodeURIComponent(value))
      } catch {
        // Fallback: treat as string if not valid JSON
      }
      clauses.push(sql`${sql.raw(safeField)} ${sql.raw(sqlOp)} ${value}`)
      // Handle IS operator for NULL
    } else if (op === 'is' && value.toUpperCase() === 'NULL') {
      clauses.push(sql`${sql.raw(safeField)} IS NULL`)
      // Handle other operators
    } else {
      clauses.push(sql`${sql.raw(safeField)} ${sql.raw(sqlOp)} ${value}`)
    }
  }

  // Combine all clauses with AND, or return empty if no filters
  return clauses.length > 0 ? sql`WHERE ${sql.join(clauses, sql` AND `)}` : sql``
}

export default defineProtectedEventHandler(async (event) => {
  // Get table name from route parameter and validate it
  const tableNameRaw = event.context.params?.table
  if (!tableNameRaw) return { error: 'Table name is required' }

  let tableName: string
  try {
    tableName = sanitizeIdentifier(tableNameRaw)
  } catch {
    return { error: 'Invalid table name' }
  }

  const queryParams = getQuery(event) as QueryObject
  const db = event.context.db

  // Build WHERE clause from query params (as Kysely SQL builder)
  const whereClause = parseQueryOperators(queryParams)

  // Build SELECT clause for specific columns if provided
  let selectClause = sql`*`
  if (typeof queryParams.select === 'string') {
    const columns = queryParams.select.split(',').map(sanitizeIdentifier)
    selectClause = sql`${sql.raw(columns.join(', '))}`
  }

  // Build ORDER BY clause if provided
  let orderClause = sql``
  if (typeof queryParams.order === 'string') {
    const [col, dir] = queryParams.order.split('.')
    if (col)
      orderClause = sql`ORDER BY ${sql.raw(sanitizeIdentifier(col))} ${dir === 'desc' ? sql`DESC` : sql`ASC`}`
  }

  // Build LIMIT clause for pagination
  let limitClause = sql``
  if (typeof queryParams.limit === 'string' && /^\d+$/.test(queryParams.limit)) {
    limitClause = sql`LIMIT ${Number(queryParams.limit)}`
  }
  // Build OFFSET clause for pagination
  let offsetClause = sql``
  if (typeof queryParams.offset === 'string' && /^\d+$/.test(queryParams.offset)) {
    offsetClause = sql`OFFSET ${Number(queryParams.offset)}`
  }

  try {
    // Compose the final SQL query using Kysely's SQL builder
    const sqlQuery = sql`
      SELECT ${selectClause}
      FROM ${sql.raw(tableName)}
      ${whereClause}
      ${orderClause}
      ${limitClause}
      ${offsetClause}
    `
    const compiledQuery = sqlQuery.compile(db)
    const rows = await db.executeQuery(compiledQuery)

    // Prepare response metadata and pagination info
    const data = rows.rows ?? rows
    const returned = Array.isArray(data) ? data.length : 0
    const limit = typeof queryParams.limit === 'string' ? Number(queryParams.limit) : undefined
    const offset = typeof queryParams.offset === 'string' ? Number(queryParams.offset) : undefined
    const hasMore = limit !== undefined && returned === limit

    // Extract selected fields from query parameter, or return 'all'
    const fields =
      typeof queryParams.select === 'string'
        ? queryParams.select.split(',').map((f) => f.trim())
        : 'all'

    // Return structured and relevant API response
    return {
      success: true,
      table: tableName,
      fields,
      count: returned,
      data,
      pagination: {
        limit,
        offset,
        returned,
        hasMore,
      },
    }
  } catch (error: unknown) {
    logger.error(error)
    return { error: 'Failed to fetch data', details: (error as Error).message }
  }
})
