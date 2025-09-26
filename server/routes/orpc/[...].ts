import { ORPCError } from '@orpc/server'
import { CompressionPlugin, RPCHandler } from '@orpc/server/fetch'
import {
  BatchHandlerPlugin,
  CORSPlugin,
  SimpleCsrfProtectionHandlerPlugin,
} from '@orpc/server/plugins'
import { toWebRequest } from 'h3'
import { ORPCContext } from '~/orpc/context'
import { router } from '~/orpc/router'

export default defineEventHandler(async (event) => {
  // Get everything after /orpc/ only if it exists
  const parts = event.path.split('/orpc/')

  if (parts.length !== 2) {
    throw new ORPCError(`Invalid oRPC path`, { status: 404 })
  }

  const orpcHandler = new RPCHandler<ORPCContext>(router, {
    strictGetMethodPluginEnabled: false, // Replace Strict Get Method Plugin
    plugins: [
      new BatchHandlerPlugin(),
      new CompressionPlugin(),
      new SimpleCsrfProtectionHandlerPlugin(),
      new CORSPlugin(),
    ],
  })

  const result = await orpcHandler.handle(toWebRequest(event), {
    prefix: '/orpc',
    context: {
      headers: event.node.req.headers,
      db: event.context.db,
    },
  })

  if (!result.matched) {
    return createErrorResponse(event, `No procedure matched`, 404)
  }

  return result.response
})

defineRouteMeta({
  openAPI: { 'x-internal': true },
})
