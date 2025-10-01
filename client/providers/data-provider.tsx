import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { consola } from 'consola'
import * as React from 'react'
import useFetch from '#/context/hooks/use-fetch'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
      mutations: {
        onError: (error) => {
          consola.error('QueryClient', error)
        },
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
  const { data: hc } = useFetch<any>('/api/sysinfo')

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools position="bottom" client={queryClient} />
      {!import.meta.env.DEV && hc?.environment.logLevel === 'debug' ? (
        <React.Suspense fallback={null}>
          <ReactQueryDevtoolsProduction position="bottom" client={queryClient} />
        </React.Suspense>
      ) : null}
    </QueryClientProvider>
  )
}
