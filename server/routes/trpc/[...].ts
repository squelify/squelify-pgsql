import { createContext } from '~/trpc/context'
import { handleTRPC } from '~/trpc/handler'
import { appRouter } from '~/trpc/router'

export default defineEventHandler((event) => {
  return handleTRPC(event, {
    router: appRouter,
    createContext,
  })
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
