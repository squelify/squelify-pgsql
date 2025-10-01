import { existsSync } from 'node:fs'
import { parse, resolve } from 'node:path'
import { globby } from 'globby'
import { createRouter, defineEventHandler, eventHandler } from 'h3'
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

  if (parts.includes('[...]')) {
    return {
      routeName: `${dir ? `${dir}/` : ''}*`,
      method: (parts.find((p) => HTTP_METHODS.includes(p as HttpMethod)) as HttpMethod) || 'get',
    }
  }

  if (parts[0] === 'index') {
    return {
      routeName: dir || '',
      method: (parts.find((p) => HTTP_METHODS.includes(p as HttpMethod)) as HttpMethod) || 'get',
    }
  }

  const methodPart = parts.find((p) => HTTP_METHODS.includes(p as HttpMethod))
  const routeParts = parts.map((part) => {
    if (part === '[...]') return '*'
    if (part.startsWith('[') && part.endsWith(']')) return `:${part.slice(1, -1)}`
    return part
  })

  const cleanParts = routeParts.filter((part) => part !== methodPart)
  const routeName = dir ? `${dir}/${cleanParts.join('/')}` : cleanParts.join('/')
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
        const userFunction = await import(`${functionsDir}/${file}`)
        const handler = userFunction.default || userFunction
        // Inject application context into the handler
        // TODO: protect against malicious user functions especially for the database access
        const h3Event = { ...event, db: dbClient }
        return handler(h3Event)
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
    logger.info('[functions]', 'No user functions folder found')
    return
  }

  // Router will handle matching and method validation
  // Params will be injected to event.context.params
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Function timeout')), FUNCTION_TIMEOUT)
  )
  return Promise.race([router.handler(event), timeoutPromise])
})
