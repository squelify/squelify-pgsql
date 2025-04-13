import { publicProcedure, trpcRouter } from '~/http/trpc'
import { healthCheckHandler } from './handlers/health.handler'

const appRouter = trpcRouter({
  health: publicProcedure.query(healthCheckHandler),
})

export type AppRouter = typeof appRouter

export { appRouter }
