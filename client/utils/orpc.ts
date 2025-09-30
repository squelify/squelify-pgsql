import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { BatchLinkPlugin, SimpleCsrfProtectionLinkPlugin } from '@orpc/client/plugins'
import { type ContractRouterClient } from '@orpc/contract'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { router } from '~/orpc/router'

const createLink = () => {
  const token = 'your-auth-token' // Ganti dengan mekanisme token yang benar
  return new RPCLink({
    url: import.meta.env.SQUELIFY_APP_BASE_URL
      ? `${import.meta.env.SQUELIFY_APP_BASE_URL}/orpc`
      : 'http://localhost:3000/orpc',
    headers: { Authorization: `Bearer ${token}` },
    plugins: [
      new SimpleCsrfProtectionLinkPlugin(),
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
