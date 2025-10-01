import { existsSync } from 'node:fs'
import { parse, resolve } from 'node:path'
import { globby } from 'globby'
import { createError, createRouter, defineEventHandler, eventHandler } from 'h3'
import dbClient from '~/database/db.client'

type HttpMethod = (typeof HTTP_METHODS)[number]

const FUNCTION_TIMEOUT = 30 * 1000 // 30 seconds
const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete'] as const
const functionsDir = resolve(process.cwd(), 'storage/functions')
const router = createRouter({ preemptive: true })

let routesReady = false

function parseFileName(fileName: string): { routeName: string; method: HttpMethod } {
  const { name, dir } = parse(fileName)
  const parts = name.split('.')

  // Named wildcard: [...param].mjs
  const namedWildcard = parts.find((p) => /^\[\.\.\.[a-zA-Z0-9_]+\]$/.test(p))
  if (namedWildcard) {
    const paramName = namedWildcard.slice(4, -1) // Remove '[...' and ']'
    return {
      routeName: `${dir ? `${dir}/` : ''}**:${paramName}`,
      method: (parts.find((p) => HTTP_METHODS.includes(p as HttpMethod)) as HttpMethod) || 'get',
    }
  }

  // Simple wildcard: [...].mjs
  if (parts.includes('[...]')) {
    return {
      routeName: `${dir ? `${dir}/` : ''}**`,
      method: (parts.find((p) => HTTP_METHODS.includes(p as HttpMethod)) as HttpMethod) || 'get',
    }
  }

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
    .filter((part) => !part.startsWith('[...') && part !== methodPart && part !== '')
    .map((part) => {
      if (part.startsWith('[') && part.endsWith(']')) return `:${part.slice(1, -1)}`
      return part
    })

  const routeName = dir ? `${dir}/${routeParts.join('/')}` : routeParts.join('/')
  const method = (methodPart as HttpMethod) || 'get'

  return { routeName, method }
}

async function registerRoutes() {
  if (!existsSync(functionsDir)) return
  const files = await globby('**/*.mjs', { onlyFiles: true, cwd: functionsDir })

  for (const file of files) {
    const { routeName, method } = parseFileName(file)
    const routePath = `/api/functions/${routeName}`.replace(/\/+/g, '/').replace(/\/$/, '')

    router.add(
      routePath,
      eventHandler(async (event) => {
        try {
          const userFunction = await import(`${functionsDir}/${file}`)
          const handler = userFunction.default || userFunction

          if (typeof handler !== 'function') {
            throw createError({
              statusCode: 500,
              statusMessage: `Function ${file} does not export a valid handler`,
            })
          }

          const h3Event = { ...event, db: dbClient }
          return await handler(h3Event)
        } catch (error: unknown) {
          logger.error(`Error in function ${file}:`, error)

          // If it's already an H3 error, re-throw it
          if (error && typeof error === 'object' && 'statusCode' in error) {
            throw error
          }

          // Handle Error instances
          if (error instanceof Error) {
            throw createError({
              statusCode: 500,
              statusMessage: `Function ${file} execution failed`,
              data: process.env.NODE_ENV === 'development' ? error.message : undefined,
            })
          }

          // Handle other types of errors
          throw createError({
            statusCode: 500,
            statusMessage: `Function ${file} execution failed`,
            data: process.env.NODE_ENV === 'development' ? String(error) : undefined,
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
  if (!routesReady) await routesPromise

  if (!existsSync(functionsDir)) {
    logger.info('No user functions folder found')
    throw createError({
      statusCode: 404,
      statusMessage: 'Functions directory not found',
    })
  }

  try {
    // Create timeout promise that rejects
    const timeoutPromise = new Promise<never>((_, reject) => {
      const timeout = setTimeout(() => {
        logger.error(`Function timeout after ${FUNCTION_TIMEOUT}ms for ${event.node.req.url}`)
        reject(
          createError({
            statusCode: 408,
            statusMessage: 'Function execution timeout',
          })
        )
      }, FUNCTION_TIMEOUT)

      // Clear timeout if we're done (this won't work in race, but good practice)
      return timeout
    })

    // Execute the function with timeout
    const result = await Promise.race([router.handler(event), timeoutPromise])

    return result
  } catch (error: unknown) {
    logger.error('Handler error:', error)

    // If it's already an H3 error, re-throw it
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    // Handle Error instances
    if (error instanceof Error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal function error',
        data: process.env.NODE_ENV === 'development' ? error.message : undefined,
      })
    }

    // Handle other types of errors
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal function error',
      data: process.env.NODE_ENV === 'development' ? String(error) : undefined,
    })
  }
})
