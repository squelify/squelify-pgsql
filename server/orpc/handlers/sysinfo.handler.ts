import process from 'node:process'
import { implement, ORPCError } from '@orpc/server'
import status from 'http-status'
import { sql } from 'kysely'
import prettyBytes from 'pretty-bytes'
import { env } from 'std-env'
import { ORPCContext } from '~/orpc/context'
import { sysInfoContract } from '~/orpc/schemas/sysinfo.schema'

const sysinfo = implement(sysInfoContract).$context<ORPCContext>()

export const sysInfoHandler = sysinfo.handler(async ({ context }) => {
  const memoryUsage = process.memoryUsage()
  const db = context.db

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
      throw new ORPCError(`SERVICE_UNAVAILABLE`, { status: 503, message: status['503_MESSAGE'] })
    }
  } catch (error) {
    throw new ORPCError(`SERVICE_UNAVAILABLE`, {
      status: 503,
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
      mode: env.SQUELIFY_APP_MODE ?? 'production',
      logLevel: env.SQUELIFY_LOG_LEVEL ?? 'info',
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
