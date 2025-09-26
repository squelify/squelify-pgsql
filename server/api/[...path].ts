import { OpenAPIHandler } from '@orpc/openapi/fetch'
import { CompressionPlugin } from '@orpc/server/fetch'
import { CORSPlugin } from '@orpc/server/plugins'
import { toWebRequest } from 'h3'
import { ORPCContext } from '~/orpc/context'
import { router } from '~/orpc/router'

export default defineEventHandler(async (event) => {
  const orpcHandler = new OpenAPIHandler<ORPCContext>(router, {
    plugins: [new CompressionPlugin(), new CORSPlugin()],
  })

  const result = await orpcHandler.handle(toWebRequest(event), {
    prefix: '/api',
    context: {
      headers: event.node.req.headers,
      db: event.context.db,
    },
  })

  if (!result.matched) {
    return createErrorResponse(event, `Resource not found`, 404)
  }

  return result.response
})

defineRouteMeta({
  openAPI: { 'x-internal': true },
})
