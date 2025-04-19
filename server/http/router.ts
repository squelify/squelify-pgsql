import { protectedProcedure, trpcRouter } from '~/http/trpc'
import { sysInfoHandler } from './handlers/sysinfo.handler'

const appRouter = trpcRouter({
  sysinfo: protectedProcedure.query(sysInfoHandler),
})

export type AppRouter = typeof appRouter

export { appRouter }
