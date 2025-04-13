import { TRPCError } from '@trpc/server'
import type { ResolveHTTPRequestOptionsContextFn } from '@trpc/server/http'
import { resolveResponse } from '@trpc/server/http'
import { readBody, toWebRequest } from 'h3'
import { createContext } from '~/http/context'
import { type AppRouter, appRouter } from '~/http/router'

export default defineEventHandler(async (event) => {
  // Get everything after /trpc/ only if it exists
  const parts = event.path.split('/trpc/')

  if (parts.length !== 2) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Invalid tRPC path',
    })
  }

  // monkey-patch body to the IncomingMessage
  if (event.method === 'POST') {
    ;(event.node.req as any).body = await readBody(event)
  }

  const createContextFn: ResolveHTTPRequestOptionsContextFn<AppRouter> = async () => {
    return createContext(event)
  }

  // API-response caching see https://trpc.io/docs/server/caching
  const httpResponse = await resolveResponse({
    router: appRouter,
    req: toWebRequest(event),
    error: null,
    createContext: createContextFn,
    path: parts[1].split('?')[0],
    responseMeta({ ctx, info, errors, type }) {
      // assuming you have all your public routes with the keyword `public` in them
      const allPublic = info?.calls.every((call) => call.path.includes('public'))

      // checking that no procedures errored
      const allOk = errors.length === 0

      // checking we're doing a query request
      const isQuery = type === 'query'

      if (ctx?.h3Event.node.res && allPublic && allOk && isQuery) {
        return {
          headers: new Headers([
            // cache request for 1 day + revalidate once every second
            ['cache-control', `s-maxage=1, stale-while-revalidate=${DURATION.DAY}`],
          ]),
        }
      }

      return {}
    },
    onError(o) {
      console.error(o.error)
    },
  })

  return httpResponse
})

defineRouteMeta({
  openAPI: {
    summary: 'tRPC Endpoint',
    tags: ['Internal'],
    parameters: [],
    responses: {
      200: { $ref: 'resp-ok' },
      400: { $ref: 'resp-bad-request' },
      500: { $ref: 'resp-internal-server-error' },
    },
    $global: {
      components: {},
    },
  },
})
