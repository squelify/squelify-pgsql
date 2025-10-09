import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import { parse, relative, resolve } from 'node:path'
import type { H3Event } from 'h3'
import * as h3 from 'h3'
import { sql } from 'kysely'
import { isDevelopment } from 'std-env'
import dbClient from '~/database/db.client'
import { createRateLimit, getRateLimitInfo } from '~/database/repository/rate_limit.repo'
import { RATE_LIMIT_CONFIG } from '~/database/schemas/rate_limit'
import { guardApiKey } from '~/http/guards'
import { getClientInfo } from '~/utils/http'

type HttpMethod = (typeof HTTP_METHODS)[number]

const FUNCTION_TIMEOUT = 30 * 1000 // 30 seconds
const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete'] as const
const functionsDir = resolve(process.cwd(), 'storage/functions')
const router = h3.createRouter({ preemptive: true })

let routesReady = false

function parseFileName(fileName: string): { routeName: string; method: HttpMethod } {
  const { name, dir } = parse(fileName)

  // Named wildcard: [...param]
  const namedWildcardMatch = name.match(/^\[\.\.\.([a-zA-Z0-9_]+)\]$/)
  if (namedWildcardMatch) {
    const paramName = namedWildcardMatch[1]
    return {
      routeName: `${dir ? `${dir}/**:${paramName}` : `**:${paramName}`}`,
      method: 'get',
    }
  }

  // Simple wildcard: [...]
  if (name === '[...]') {
    return {
      routeName: `${dir ? `${dir}/**` : '**'}`,
      method: 'get',
    }
  }

  // Now split by dots for regular parsing
  const parts = name.split('.')

  // Index route
  if (parts[0] === 'index') {
    return {
      routeName: dir || '',
      method: (parts.find((p) => HTTP_METHODS.includes(p as HttpMethod)) as HttpMethod) || 'get',
    }
  }

  // Static and named param route
  const methodPart = parts.find((p) => HTTP_METHODS.includes(p as HttpMethod))
  const routeParts = parts
    .filter((part) => part !== methodPart && part !== '')
    .map((part) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return `:${part.slice(1, -1)}`
      }
      return part
    })

  const routeName = dir ? `${dir}/${routeParts.join('/')}` : routeParts.join('/')
  const method = (methodPart as HttpMethod) || 'get'

  return { routeName, method }
}

// Enhanced safe execution context
function createSafeH3Context(event: any) {
  return {
    getQuery: () => h3.getQuery(event),
    getHeaders: () => h3.getHeaders(event),
    readBody: async () => {
      if (!['post', 'put', 'patch'].includes(event.method.toLowerCase())) {
        throw h3.createError({
          statusCode: 405,
          statusMessage: `Method ${event.method} does not support request body`,
        })
      }
      return h3.readBody(event)
    },
    setCookie: (name: string, value: string, options?: any) => {
      return h3.setCookie(event, name, value, options)
    },
    getCookie: (name: string) => h3.getCookie(event, name),
    createError: h3.createError,
    setHeader: (name: string, value: string) => h3.setHeader(event, name, value),
    getHeader: (name: string) => h3.getHeader(event, name),
  }
}

async function checkRateLimit(event: H3Event): Promise<void> {
  if (!RATE_LIMIT_CONFIG.enabled) {
    return // Rate limiting is disabled
  }

  const { clientIP } = getClientInfo(event)
  const userId = event.context.auth?.payload?.sub
  const db = dbClient

  // Ensure clientIP is defined
  if (!clientIP) {
    logger.warn('No client IP found, skipping rate limit check')
    return
  }

  try {
    // Check IP-based rate limit
    const ipLimitInfo = await getRateLimitInfo(db, clientIP, 'ip')
    if (ipLimitInfo.isLimited && ipLimitInfo.resetAt) {
      const waitMinutes = Math.ceil((ipLimitInfo.resetAt - Math.floor(Date.now() / 1000)) / 60)
      throw h3.createError({
        statusCode: 429,
        statusMessage: `Too many requests from this IP. Please try again in ${waitMinutes} minute(s).`,
        data: {
          type: 'ip_rate_limit',
          resetAt: ipLimitInfo.resetAt,
          limit: RATE_LIMIT_CONFIG.ip.points,
          window: RATE_LIMIT_CONFIG.ip.window,
        },
      })
    }

    // Check user-based rate limit (if authenticated)
    if (userId) {
      const userLimitInfo = await getRateLimitInfo(db, userId, 'user')
      if (userLimitInfo.isLimited && userLimitInfo.resetAt) {
        const waitMinutes = Math.ceil((userLimitInfo.resetAt - Math.floor(Date.now() / 1000)) / 60)
        throw h3.createError({
          statusCode: 429,
          statusMessage: `Too many requests from this user. Please try again in ${waitMinutes} minute(s).`,
          data: {
            type: 'user_rate_limit',
            resetAt: userLimitInfo.resetAt,
            limit: RATE_LIMIT_CONFIG.user.points,
            window: RATE_LIMIT_CONFIG.user.window,
          },
        })
      }

      // Apply user rate limit
      await createRateLimit(
        db,
        userId,
        'user',
        RATE_LIMIT_CONFIG.user.points,
        RATE_LIMIT_CONFIG.user.window
      )
    }

    // Check global rate limit
    const globalLimitInfo = await getRateLimitInfo(db, 'global', 'global')
    if (globalLimitInfo.isLimited && globalLimitInfo.resetAt) {
      const waitMinutes = Math.ceil((globalLimitInfo.resetAt - Math.floor(Date.now() / 1000)) / 60)
      throw h3.createError({
        statusCode: 429,
        statusMessage: `System is experiencing high load. Please try again in ${waitMinutes} minute(s).`,
        data: {
          type: 'global_rate_limit',
          resetAt: globalLimitInfo.resetAt,
          limit: RATE_LIMIT_CONFIG.global.points,
          window: RATE_LIMIT_CONFIG.global.window,
        },
      })
    }

    // Apply rate limits
    await createRateLimit(
      db,
      clientIP,
      'ip',
      RATE_LIMIT_CONFIG.ip.points,
      RATE_LIMIT_CONFIG.ip.window
    )

    await createRateLimit(
      db,
      'global',
      'global',
      RATE_LIMIT_CONFIG.global.points,
      RATE_LIMIT_CONFIG.global.window
    )
  } catch (error) {
    // If it's already a rate limit error, re-throw it
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    // Log other errors but don't block the request
    logger.error('Rate limit check failed:', error)
  }
}

async function registerRoutes() {
  if (!existsSync(functionsDir)) return

  const files: string[] = []
  for await (const file of fs.glob(`${functionsDir}/**/*.mjs`)) {
    files.push(relative(functionsDir, file))
  }

  for (const file of files) {
    // Security: Validate file path to prevent traversal (but allow wildcard syntax)
    const hasPathTraversal = file.split('/').some((segment) => segment === '..' || segment === '.')
    if (hasPathTraversal || file.startsWith('/')) {
      logger.warn(`Skipping suspicious file path: ${file}`)
      continue
    }

    const { routeName, method } = parseFileName(file)
    const routePath =
      `/api/functions/${routeName}`.replace(/\/+/g, '/').replace(/\/$/, '') || '/api/functions'

    router.add(
      routePath,
      h3.eventHandler(async (event: H3Event) => {
        try {
          // Check rate limits first
          await checkRateLimit(event)

          const filePath = resolve(functionsDir, file)

          // Security: Ensure file is within functions directory
          if (!filePath.startsWith(functionsDir)) {
            throw h3.createError({
              statusCode: 403,
              statusMessage: 'Access denied',
            })
          }

          // Dynamic import with cache busting for development
          const userFunction = await import(`${filePath}?t=${Date.now()}`)
          const handler = userFunction.default || userFunction

          if (typeof handler !== 'function') {
            throw h3.createError({
              statusCode: 500,
              statusMessage: `Function ${file} does not export a valid handler`,
            })
          }

          // Create enhanced event with safe H3 context
          const enhancedEvent = {
            ...event,
            h3: createSafeH3Context(event),
            db: dbClient, // Provide direct access to dbClient
            sql: sql, // Provide direct access to sql from Kysely
            context: {
              ...event.context,
              params: event.context.params || {},
            },
          }

          return await handler(enhancedEvent)
        } catch (error: unknown) {
          logger.error(`Error in function ${file}:`, error)

          if (error && typeof error === 'object' && 'statusCode' in error) {
            throw error
          }

          if (error instanceof Error) {
            throw h3.createError({
              statusCode: 500,
              statusMessage: `Function ${file} execution failed`,
              data: isDevelopment ? error.message : undefined,
            })
          }

          throw h3.createError({
            statusCode: 500,
            statusMessage: `Function ${file} execution failed`,
            data: isDevelopment ? String(error) : undefined,
          })
        }
      }),
      method
    )
  }

  routesReady = true
}

const routesPromise = registerRoutes()

export default defineEventHandler(async (event) => {
  await guardApiKey(event) // Protect the endpoint with API key

  if (!routesReady) await routesPromise

  if (!existsSync(functionsDir)) {
    logger.info('No user functions folder found')
    throw h3.createError({
      statusCode: 404,
      statusMessage: 'Functions directory not found',
    })
  }

  try {
    // Timeout handling for function execution
    let timeout: NodeJS.Timeout | undefined
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeout = setTimeout(() => {
        logger.error(`Function timeout after ${FUNCTION_TIMEOUT}ms for ${event.node.req.url}`)
        reject(
          h3.createError({
            statusCode: 408,
            statusMessage: 'Function execution timeout',
          })
        )
      }, FUNCTION_TIMEOUT)
    })

    try {
      const result = await Promise.race([router.handler(event), timeoutPromise])
      if (timeout) clearTimeout(timeout)
      return result
    } catch (error) {
      if (timeout) clearTimeout(timeout)
      throw error
    }
  } catch (error: unknown) {
    logger.error('Handler error:', error)

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    if (error instanceof Error) {
      throw h3.createError({
        statusCode: 500,
        statusMessage: 'Internal function error',
        data: isDevelopment ? error.message : undefined,
      })
    }

    throw h3.createError({
      statusCode: 500,
      statusMessage: 'Internal function error',
      data: isDevelopment ? String(error) : undefined,
    })
  }
})
