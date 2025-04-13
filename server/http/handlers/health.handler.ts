import process from 'node:process'
import { TRPCError } from '@trpc/server'
import status from 'http-status'
import { sql } from 'kysely'
import prettyBytes from 'pretty-bytes'
import { env } from 'std-env'
import type { Context } from '~/http/context'

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

interface HealthCheckParams {
  ctx: Context
  signal: AbortSignal | undefined
}

export async function healthCheckHandler(params: HealthCheckParams): Promise<HealthCheckResponse> {
  const memoryUsage = process.memoryUsage()
  const db = params.ctx.h3Event.context.db

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
      throw new TRPCError({
        code: 'SERVICE_UNAVAILABLE',
        message: status['503_MESSAGE'],
      })
    }
  } catch (error) {
    throw new TRPCError({
      code: 'SERVICE_UNAVAILABLE',
      message: error instanceof Error ? error.message : status['503_MESSAGE'],
    })
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
}
