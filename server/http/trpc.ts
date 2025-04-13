import { styleText } from 'node:util'
import { TRPCError, initTRPC } from '@trpc/server'
import { env } from 'std-env'
import superjson from 'superjson'
import { ZodError } from 'zod'
import type { Context, Meta } from '~/http/context'
import { getRequestHeader } from '#imports'

const t = initTRPC
  .context<Context>()
  .meta<Meta>()
  .create({
    transformer: superjson,
    sse: {
      client: {
        /* https://trpc.io/docs/client/links/httpSubscriptionLink#timeout */
        reconnectAfterInactivityMs: 3_000 /* 3 seconds */,
        ping: {
          enabled: true /* Enable periodic ping messages to keep connection alive */,
          intervalMs: 2_000 /* Send ping message every 2s */,
        },
      },
    },
    errorFormatter({ shape, error }) {
      logger.withTag('trpc').error(styleText('red', error.message), JSON.stringify(error.cause))
      const { code, message, data: shapeData } = shape
      const { code: httpCode, httpStatus, stack } = shapeData
      const reason = String(env.APP_LOG_LEVEL).toLowerCase() === 'debug' ? stack : null
      const isZodError = error.cause instanceof ZodError
      const zodError = error.code === 'BAD_REQUEST' && isZodError ? error.cause.flatten() : null
      const data = { status: httpStatus, code: httpCode, message, reason, zodError }
      return { code, message, data }
    },
  })

// Middleware to verify if user is authenticated
const isAuthed = t.middleware(({ ctx, meta, next }) => {
  const bearer = getRequestHeader(ctx.h3Event, 'Authorization')
  const accessToken = bearer?.replace('Bearer ', '')

  if (meta?.authRequired && !accessToken) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You are not authenticated or your session has expired!',
    })
  }

  return next({ ctx: { accessToken } })
})

export const publicProcedure = t.procedure
export const trpcRouter = t.router

/**
 * Writing all API-code in your code in the same file is not a great idea.
 * It's easy to merge routers with other routers.
 * @see https://trpc.io/docs/v11/merging-routers
 */
export const mergeRouters = t.mergeRouters

/**
 * Create a protected procedure that requires authentication.
 * @see https://trpc.io/docs/v11/procedures
 */
export const protectedProcedure = publicProcedure.use(isAuthed)
