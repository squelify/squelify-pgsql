import { publicProcedure, trpcRouter } from '~/http/trpc'
import { sysInfoHandler } from './handlers/sysinfo.handler'

const appRouter = trpcRouter({
  sysinfo: publicProcedure.query(sysInfoHandler),
})

export type AppRouter = typeof appRouter

export { appRouter }
