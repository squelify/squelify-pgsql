import os from 'node:os'
import process from 'node:process'
import { implement, ORPCError } from '@orpc/server'
import status from 'http-status'
import { sql } from 'kysely'
import prettyBytes from 'pretty-bytes'
import { env } from 'std-env'
import { ORPCContext } from '~/orpc/context'
import { sysInfoContract } from '~/orpc/schemas/sysinfo.schema'

const sysinfo = implement(sysInfoContract).$context<ORPCContext>()

function formatUptime(seconds: number) {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  return `${days}d ${hours}h ${minutes}m ${secs}s`
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

export const sysInfoHandler = sysinfo.handler(async ({ context }) => {
  const memoryUsage = process.memoryUsage()
  const db = context.db

  // Database check & version
  let dbConnected = false
  let dbLatency = '0ms'
  let dbVersion = ''

  try {
    const startTime = performance.now()
    const dbStatus = await sql.raw<{ version: string }>(`SELECT version()`).execute(db)
    const endTime = performance.now()

    dbLatency = `${Math.round(endTime - startTime)}ms`
    dbConnected = !!dbStatus && !!dbStatus.rows[0]?.version
    dbVersion = dbStatus.rows[0]?.version || ''

    if (!dbConnected) {
      throw new ORPCError(`SERVICE_UNAVAILABLE`, { status: 503, message: status['503_MESSAGE'] })
    }
  } catch (error) {
    throw new ORPCError(`SERVICE_UNAVAILABLE`, {
      status: 503,
      message: error instanceof Error ? error.message : status['503_MESSAGE'],
    })
  }

  // OS Info
  const distro = await getLinuxDistro()
  const osInfo = buildOsInfo({
    platform: os.platform(),
    arch: os.arch(),
    distro,
    version: os.release(),
  })

  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: formatUptime(process.uptime()),
    environment: {
      mode: env.SQUELIFY_APP_MODE ?? 'production',
      logLevel: env.SQUELIFY_LOG_LEVEL ?? 'info',
      nodeVersion: process.version,
      osInfo,
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
      version: dbVersion,
    },
  }
})
