import { oc } from '@orpc/contract'
import { z } from 'zod'

export const SysInfoSchema = z.object({
  status: z.string(),
  timestamp: z.string(),
  uptime: z.string(),
  environment: z.object({
    mode: z.string(),
    logLevel: z.string(),
    nodeVersion: z.string(),
  }),
  memory: z.object({
    heapUsed: z.string(),
    heapTotal: z.string(),
    external: z.string(),
    residentSetSize: z.string(),
  }),
  database: z.object({
    connected: z.boolean(),
    latency: z.string(),
  }),
})

export const sysInfoContract = oc.output(SysInfoSchema)
