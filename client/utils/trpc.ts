import { createTRPCContext } from '@trpc/tanstack-react-query'
import type { AppRouter } from '~/http/router'

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>()
