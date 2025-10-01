import type { H3Event } from 'h3'
import { env } from 'std-env'

// Protect the endpoint with API key (header or query parameter)
export async function guardApiKey(event: H3Event): Promise<string> {
  const apiKeyHeader = event.headers.get('X-API-Key')
  let apiKey: string | undefined

  if (apiKeyHeader) {
    apiKey = apiKeyHeader
  } else {
    apiKey = getQuery(event).apiKey as string | undefined
  }

  if (!apiKey) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Missing API key on request header or query parameter',
    })
  }

  if (apiKey !== env.SQUELIFY_PUBLISHABLE_KEY) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid API key, you must provide a valid key',
    })
  }

  return apiKey
}
