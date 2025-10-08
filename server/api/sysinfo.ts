import os from 'node:os'
import process from 'node:process'
import status from 'http-status'
import { sql } from 'kysely'
import prettyBytes from 'pretty-bytes'
import { env } from 'std-env'
import { z } from 'zod'
import { SysInfoSchema } from '~/orpc/schemas/sysinfo.schema'

type HealthCheckResponse = z.infer<typeof SysInfoSchema>

function buildOsInfo({
  platform,
  arch,
  distro,
  version,
}: {
  platform: string
  arch: string
  distro: string
  version: string
}) {
  let result = platform.charAt(0).toUpperCase() + platform.slice(1)
  if (distro) result += ` (${distro})`
  result += ` • ${arch}`
  result += ` • ${version}`
  return result
}

async function getLinuxDistro(): Promise<string> {
  if (os.platform() !== 'linux') return ''
  try {
    const fs = await import('node:fs/promises')
    const osRelease = await fs.readFile('/etc/os-release', 'utf8')
    const match = osRelease.match(/^PRETTY_NAME="(.+)"$/m)
    return match ? match[1] : ''
  } catch {
    return ''
  }
}

export default eventHandler(async (event): Promise<HealthCheckResponse> => {
  // Extract authorization header
  const authHeader = getHeader(event, 'Authorization')

  // TODO: replace with the real token validation
  const isAuthenticated = authHeader?.startsWith('Bearer 123123')

  const memoryUsage = process.memoryUsage()
  const db = event.context.db

  // Check database connection and get version with timing
  let dbConnected = false
  let dbLatency = '0ms'
  let dbVersion = ''

  try {
    const startTime = performance.now()
    const dbStatus = await sql.raw<{ version: string }>(`SELECT version()`).execute(db)
    const endTime = performance.now()

    dbLatency = `${Math.round(endTime - startTime)}ms`
    dbConnected = !!dbStatus && !!dbStatus.rows[0]?.version
    dbVersion = dbStatus.rows[0]?.version || (isAuthenticated ? 'N/A' : '')

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

  // OS Info (human readable)
  let osInfo = ''
  if (isAuthenticated) {
    const distro = await getLinuxDistro()
    osInfo = buildOsInfo({
      platform: process.platform,
      arch: process.arch,
      distro,
      version: os.release(),
    })
  }

  // Base response for all users
  const response: HealthCheckResponse = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime,
    environment: {
      mode: env.SQUELIFY_APP_MODE ?? 'production',
      logLevel: env.SQUELIFY_LOG_LEVEL ?? 'info',
      nodeVersion: isAuthenticated ? process.version : '',
      osInfo,
    },
    memory: {
      heapUsed: isAuthenticated ? prettyBytes(memoryUsage.heapUsed) : '',
      heapTotal: isAuthenticated ? prettyBytes(memoryUsage.heapTotal) : '',
      external: isAuthenticated ? prettyBytes(memoryUsage.external) : '',
      residentSetSize: isAuthenticated ? prettyBytes(memoryUsage.rss) : '',
    },
    database: {
      connected: isAuthenticated ? dbConnected : false,
      latency: dbLatency,
      version: isAuthenticated ? dbVersion : '',
    },
  }

  return response
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
      {
        in: 'header',
        name: 'Authorization',
        required: false,
        example: 'Bearer <token>',
        description: 'Bearer token for accessing detailed health information',
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
