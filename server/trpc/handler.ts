import { type AnyTRPCRouter, TRPCError, type inferRouterContext } from '@trpc/server'
import type { HTTPBaseHandlerOptions, TRPCRequestInfo } from '@trpc/server/http'
import type { ResolveHTTPRequestOptionsContextFn } from '@trpc/server/http'
import { resolveResponse } from '@trpc/server/http'
import type { H3Event, NodeIncomingMessage } from 'h3'
import { readBody, toWebRequest } from 'h3'

type MaybePromise<T> = T | Promise<T>

export type CreateContextFn<TRouter extends AnyTRPCRouter> = (
  event: H3Event,
  innerOptions: { info: TRPCRequestInfo }
) => MaybePromise<inferRouterContext<TRouter>>

type H3HandlerOptions<TRouter extends AnyTRPCRouter> = HTTPBaseHandlerOptions<
  TRouter,
  NodeIncomingMessage
> & { createContext?: CreateContextFn<TRouter> }

export async function handleTRPC<TRouter extends AnyTRPCRouter>(
  event: H3Event,
  opts: H3HandlerOptions<TRouter>
) {
  const createContext: ResolveHTTPRequestOptionsContextFn<TRouter> = async (innerOpts) => {
    return await opts.createContext?.(event, innerOpts)
  }

  // Get everything after /trpc/
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

  // API-response caching see https://trpc.io/docs/server/caching
  const httpResponse = await resolveResponse({
    ...opts,
    req: toWebRequest(event),
    error: null,
    createContext,
    path: parts[1].split('?')[0],
    responseMeta({ ctx, info, errors, type }) {
      // assuming you have all your public routes with the keyword `public` in them
      const allPublic = info?.calls.every((call) => call.path.includes('public'))

      // checking that no procedures errored
      const allOk = errors.length === 0

      // checking we're doing a query request
      const isQuery = type === 'query'

      if (ctx?.res && allPublic && allOk && isQuery) {
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
      opts.onError?.({ ...o, req: event.node.req })
    },
  })

  return httpResponse
}
