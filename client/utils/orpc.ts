import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { BatchLinkPlugin, SimpleCsrfProtectionLinkPlugin } from '@orpc/client/plugins'
import { type ContractRouterClient } from '@orpc/contract'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { router } from '~/orpc/router'

// Utility to get a cookie value by name from document.cookie.
// Works in browser only; returns null if not found or not in browser.
const getCookie = (name: string): string | null => {
  const raw = typeof document !== 'undefined' ? document.cookie : ''
  if (!raw) return null
  const parts = raw.split(';').map((p) => p.trim())
  for (const p of parts) {
    if (p.startsWith(`${name}=`)) {
      return decodeURIComponent(p.substring(name.length + 1))
    }
  }
  return null
}

const createLink = () => {
  const token = getCookie('auth_token') ?? null

  return new RPCLink({
    url: import.meta.env.SQUELIFY_BASE_URL
      ? `${import.meta.env.SQUELIFY_BASE_URL}/orpc`
      : 'http://localhost:3080/orpc',
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    plugins: [
      new SimpleCsrfProtectionLinkPlugin({
        headerName: 'x-csrf-token',
      }),
      new BatchLinkPlugin({
        mode: typeof window === 'undefined' ? 'buffered' : 'streaming',
        groups: [
          {
            condition: (_opts) => true,
            context: {}, // Context used for the rest of the request lifecycle
          },
        ],
      }),
    ],
  })
}

const orpcClient: ContractRouterClient<typeof router> = createORPCClient(createLink())

export const orpc = createTanstackQueryUtils(orpcClient)
