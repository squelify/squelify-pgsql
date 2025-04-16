import process from 'node:process'
import status from 'http-status'
import { sql } from 'kysely'
import prettyBytes from 'pretty-bytes'
import { env } from 'std-env'

interface HealthCheckResponse {
  status: string
  timestamp: string
  uptime: string
  environment: {
    mode: string
    logLevel: string
    nodeVersion: string
  }
  memory: {
    heapUsed: string
    heapTotal: string
    external: string
    residentSetSize: string
  }
  database: {
    connected: boolean
    latency: string
  }
}

export default eventHandler(async (event): Promise<HealthCheckResponse> => {
  const memoryUsage = process.memoryUsage()
  const db = event.context.db

  // Check database connection with timing
  let dbConnected = false
  let dbLatency = '0ms'

  try {
    const startTime = performance.now()
    const dbStatus = await sql.raw<{ status: number }>(`SELECT 1 as status`).execute(db)
    const endTime = performance.now()

    dbLatency = `${Math.round(endTime - startTime)}ms`
    dbConnected = dbStatus && dbStatus.rows[0].status === 1

    if (!dbConnected) {
      throw createErrorResponse(event, status['503_MESSAGE'], 503)
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : status['503_MESSAGE']
    throw createErrorResponse(event, message, 503)
  }

  // Format uptime
  const uptimeSeconds = process.uptime()
  const days = Math.floor(uptimeSeconds / 86400)
  const hours = Math.floor((uptimeSeconds % 86400) / 3600)
  const minutes = Math.floor((uptimeSeconds % 3600) / 60)
  const seconds = Math.floor(uptimeSeconds % 60)
  const uptime = `${days}d ${hours}h ${minutes}m ${seconds}s`

  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime,
    environment: {
      mode: env.APP_MODE ?? 'production',
      logLevel: env.APP_LOG_LEVEL ?? 'info',
      nodeVersion: process.version,
    },
    memory: {
      heapUsed: prettyBytes(memoryUsage.heapUsed),
      heapTotal: prettyBytes(memoryUsage.heapTotal),
      external: prettyBytes(memoryUsage.external),
      residentSetSize: prettyBytes(memoryUsage.rss),
    },
    database: {
      connected: dbConnected,
      latency: dbLatency,
    },
  }
})

defineRouteMeta({
  openAPI: {
    summary: 'Health Check',
    tags: ['System'],
    parameters: [
      {
        in: 'header',
        name: 'Content-Type',
        required: true,
        example: 'application/json',
      },
    ],
    responses: {
      200: { $ref: 'resp-ok' },
      400: { $ref: 'resp-bad-request' },
      401: { $ref: 'resp-unauthorized' },
      403: { $ref: 'resp-forbidden' },
      404: { $ref: 'resp-not-found' },
      500: { $ref: 'resp-internal-server-error' },
      503: { $ref: 'resp-service-unavailable' },
    },
  },
})
