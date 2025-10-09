export default async function (event) {
  const { db, sql } = event

  try {
    // Using Kysely's sql template for raw query
    const result = await sql`SELECT version() AS version`.execute(db)
    return {
      postgres_version: result.rows?.[0]?.version || 'unknown',
      connection_status: 'connected',
    }
  } catch (error) {
    return {
      error: 'Database connection failed',
      primary_error: error.message,
      secondary_error: secondError.message,
      db_methods: Object.getOwnPropertyNames(db).slice(0, 10),
    }
  }
}
