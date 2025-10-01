import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'
import { env } from 'std-env'
import { z } from 'zod'
import { DURATION } from '~/utils/datetime'

const rateLimitContextEnum = z.enum(['ip', 'user', 'email', 'global', 'functions'])
export type RateLimitContext = z.infer<typeof rateLimitContextEnum>

// RateLimit schema with validation rules
export const RateLimitSchema = z.object({
  id: z.custom<Generated<string>>(),
  key: z.string(),
  context: rateLimitContextEnum,
  points: z.number().default(0),
  limit: z.number(),
  window: z.number(), // in seconds
  expiresAt: z.custom<ColumnType<number>>(), // Unix timestamp
  blockedUntil: z.custom<ColumnType<number | null>>().nullable(),
  createdAt: z.custom<ColumnType<Date, string | undefined, never>>().optional(),
  updatedAt: z.custom<ColumnType<Date, string | undefined, never>>().nullable(),
})

// Table interface for Kysely
export type IRateLimit = z.infer<typeof RateLimitSchema>

// Kysely types for operations
export type RateLimit = Selectable<IRateLimit>
export type RateLimitInsert = Insertable<IRateLimit>
export type RateLimitUpdate = Updateable<IRateLimit>

// Rate limit configuration with defaults and environment overrides
export const RATE_LIMIT_CONFIG = {
  defaults: {
    window: 60, // 1 minute
    points: 60, // 60 requests per minute
    blockMultiplier: 2, // Block duration multiplier
  },
  ip: {
    points: Number.parseInt(env.SQUELIFY_RATE_LIMIT_IP_POINTS || '100', 10),
    window: Number.parseInt(env.SQUELIFY_RATE_LIMIT_IP_WINDOW || String(DURATION.MINUTE * 5), 10),
  },
  user: {
    points: Number.parseInt(env.SQUELIFY_RATE_LIMIT_USER_POINTS || '200', 10),
    window: Number.parseInt(
      env.SQUELIFY_RATE_LIMIT_USER_WINDOW || String(DURATION.MINUTE * 15),
      10
    ),
  },
  global: {
    points: Number.parseInt(env.SQUELIFY_RATE_LIMIT_GLOBAL_POINTS || '1000', 10),
    window: Number.parseInt(
      env.SQUELIFY_RATE_LIMIT_GLOBAL_WINDOW || String(DURATION.MINUTE * 10),
      10
    ),
  },
  enabled: env.SQUELIFY_RATE_LIMIT_ENABLED?.toLowerCase() !== 'false', // Default: true
} as const
