import { createError } from 'h3'
import { Kysely, sql } from 'kysely'
import type { Database } from '~/database/db.schema'
import type { RateLimitContext, RateLimitInsert } from '~/database/schemas/rate_limit'
import { RATE_LIMIT_CONFIG } from '~/database/schemas/rate_limit'

interface RateLimitInfo {
  isLimited: boolean
  remainingPoints: number
  resetAt: number | null
  blockedUntil: number | null
}

export async function createRateLimit(
  db: Kysely<Database>,
  key: string,
  context: RateLimitContext,
  limit: number = RATE_LIMIT_CONFIG.defaults.points,
  window: number = RATE_LIMIT_CONFIG.defaults.window
): Promise<RateLimitInfo> {
  const now = Math.floor(Date.now() / 1000)
  const expiresAt = now + window
  const blockThreshold = limit * RATE_LIMIT_CONFIG.defaults.blockMultiplier
  const blockDuration = window * RATE_LIMIT_CONFIG.defaults.blockMultiplier

  const data: RateLimitInsert = {
    key,
    context,
    points: 1,
    limit,
    window,
    expiresAt,
    blockedUntil: null,
  }

  // Cleanup expired records first for better performance
  await cleanupExpiredRecords(db, now)

  try {
    // Use PostgreSQL-specific UPSERT with proper conflict handling
    const result = await db
      .insertInto('internal.rate_limits')
      .values(data)
      .onConflict((oc) =>
        oc.columns(['key', 'context']).doUpdateSet({
          points: sql`CASE
            WHEN internal.rate_limits.expires_at < ${now} THEN 1
            ELSE internal.rate_limits.points + 1
          END`,
          expiresAt: sql`CASE
            WHEN internal.rate_limits.expires_at < ${now} THEN ${expiresAt}
            ELSE internal.rate_limits.expires_at
          END`,
          blockedUntil: sql`CASE
            WHEN (CASE
              WHEN internal.rate_limits.expires_at < ${now} THEN 1
              ELSE internal.rate_limits.points + 1
            END) >= ${blockThreshold} THEN ${now + blockDuration}
            ELSE internal.rate_limits.blocked_until
          END`,
        })
      )
      .returning(['points', 'limit', 'expiresAt', 'blockedUntil'])
      .executeTakeFirst()

    if (!result) {
      throw new Error('Failed to create or update rate limit record')
    }

    // Check if the current request should be blocked
    const isBlocked = result.blockedUntil ? result.blockedUntil > now : false
    const isLimited = isBlocked || result.points > limit

    if (isLimited) {
      const resetAt = result.blockedUntil || result.expiresAt
      const waitTime = Math.ceil((resetAt - now) / 60)

      throw createError({
        statusCode: 429,
        statusMessage: `Rate limit exceeded. Try again in ${waitTime} minute(s).`,
        data: {
          type: `${context}_rate_limit`,
          resetAt,
          limit,
          current: result.points,
          isBlocked,
        },
      })
    }

    return {
      isLimited: false,
      remainingPoints: Math.max(0, limit - result.points),
      resetAt: result.expiresAt,
      blockedUntil: result.blockedUntil,
    }
  } catch (error) {
    // If it's already a rate limit error, re-throw it
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    logger
      .withTag('RateLimit')
      .error('Failed to create/update rate limit:', { key, context, error })
    throw createError({ statusCode: 500, statusMessage: 'Failed to process rate limit' })
  }
}

async function cleanupExpiredRecords(db: Kysely<Database>, now: number): Promise<void> {
  try {
    await db
      .deleteFrom('internal.rate_limits')
      .where('expiresAt', '<', now)
      .where('blockedUntil', 'is', null)
      .execute()
  } catch (error) {
    // Don't throw on cleanup errors, just log them
    logger.withTag('RateLimit').warn('Cleanup failed:', error)
  }
}

export async function getRateLimitInfo(
  db: Kysely<Database>,
  key: string,
  context: RateLimitContext
): Promise<RateLimitInfo> {
  const now = Math.floor(Date.now() / 1000)

  try {
    const limit = await db
      .selectFrom('internal.rate_limits')
      .where('key', '=', key)
      .where('context', '=', context)
      .where((eb) => eb.or([eb('expiresAt', '>', now), eb('blockedUntil', '>', now)]))
      .select(['points', 'limit', 'blockedUntil', 'expiresAt'])
      .executeTakeFirst()

    if (!limit) {
      return {
        isLimited: false,
        remainingPoints: 0,
        resetAt: null,
        blockedUntil: null,
      }
    }

    const isBlocked = limit.blockedUntil ? limit.blockedUntil > now : false
    const isLimited = isBlocked || limit.points >= limit.limit

    return {
      isLimited,
      remainingPoints: Math.max(0, limit.limit - limit.points),
      resetAt: limit.expiresAt,
      blockedUntil: limit.blockedUntil,
    }
  } catch (error) {
    logger.withTag('RateLimit').error('Failed to get rate limit info:', { key, context, error })
    // Return permissive result on error to avoid blocking legitimate requests
    return {
      isLimited: false,
      remainingPoints: 0,
      resetAt: null,
      blockedUntil: null,
    }
  }
}

export async function clearRateLimit(
  db: Kysely<Database>,
  key: string,
  context: RateLimitContext
): Promise<void> {
  try {
    await db
      .deleteFrom('internal.rate_limits')
      .where('key', '=', key)
      .where('context', '=', context)
      .execute()
  } catch (error) {
    logger.withTag('RateLimit').error('Failed to clear rate limit:', { key, context, error })
    throw createError({ statusCode: 500, statusMessage: 'Failed to clear rate limit' })
  }
}
