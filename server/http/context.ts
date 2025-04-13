import type { H3Event } from 'h3'

/**
 * Context holds data that all of your tRPC procedures will
 * have access to, and is a great place to put things like
 * database connections or authentication information.
 *
 * @link https://trpc.io/docs/context
 */
export function createContext(event: H3Event) {
  return { h3Event: event }
}

export type Context = Awaited<ReturnType<typeof createContext>>

/**
 * Procedure metadata allows you to add an optional procedure
 * specific meta property which will be available in all
 * middleware function parameters.
 *
 * @link https://trpc.io/docs/server/metadata
 */
export interface Meta {
  authRequired: boolean
}
