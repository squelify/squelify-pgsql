import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  createTRPCClient,
  httpBatchLink,
  httpSubscriptionLink,
  loggerLink,
  splitLink,
} from '@trpc/client'
import * as React from 'react'
import superjson from 'superjson'
import useFetch from '#/context/hooks/use-fetch'
import { TRPCProvider } from '#/utils/trpc'
import type { AppRouter } from '~/http/router'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient()
  }

  // Browser: make a new query client if we don't already have one
  // This is very important, so we don't re-make a new client if React
  // suspends during the initial render. This may not be needed if we
  // have a suspense boundary BELOW the creation of the query client
  if (!browserQueryClient) browserQueryClient = makeQueryClient()
  return browserQueryClient
}

// Enable ReactQuery Devtools in production, only in debug mode.
const ReactQueryDevtoolsProduction = React.lazy(() =>
  import('@tanstack/react-query-devtools/production').then((d) => ({
    default: d.ReactQueryDevtools,
  }))
)

export default function DataProvider({ children }: React.PropsWithChildren) {
  const queryClient = getQueryClient()
  const { data: hc } = useFetch<any>('/api/healthz')

  const [trpcClient] = React.useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        loggerLink({
          enabled: (opts) =>
            (import.meta.env.DEV && typeof window !== 'undefined') ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        splitLink({
          // uses the httpSubscriptionLink for subscriptions
          condition: (op) => op.type === 'subscription',
          true: httpSubscriptionLink({
            url: `/trpc`,
            transformer: superjson,
          }),
          false: httpBatchLink({
            url: '/trpc',
            // async headers() {
            //   const authState = authStore.get()
            //   if (!authState?.token?.accessToken) return {}
            //   return { Authorization: `Bearer ${authState?.token?.accessToken}` }
            // },
            transformer: superjson,
            maxURLLength: 2083,
          }),
        }),
      ],
    })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
      <ReactQueryDevtools position="bottom" client={queryClient} />
      {!import.meta.env.DEV && hc?.environment.logLevel === 'debug' ? (
        <React.Suspense fallback={null}>
          <ReactQueryDevtoolsProduction position="bottom" client={queryClient} />
        </React.Suspense>
      ) : null}
    </QueryClientProvider>
  )
}
