import type { H3Event } from 'h3'
import { env } from 'std-env'

/**
 * Validates the API key from either the request header ('X-API-Key') or query parameter ('apiKey').
 * Throws 401 error if missing or invalid.
 */
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

/**
 * Validates the App Secret Key from the request header ('X-App-Secret-Key').
 * Throws 401 error if missing or invalid.
 */
export async function guardAppSecretKey(event: H3Event): Promise<string> {
  const appSecretKeyHeader = event.headers.get('X-App-Secret-Key')
  if (!appSecretKeyHeader) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Missing App Secret Key on request header',
    })
  }

  if (appSecretKeyHeader !== env.SQUELIFY_APP_SECRET_KEY) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid App Secret Key, you must provide a valid key',
    })
  }

  return appSecretKeyHeader
}

/**
 * Validates the token from the query parameter ('token').
 * Throws 401 error if missing or invalid.
 */
export async function guardToken(event: H3Event): Promise<string> {
  const token = getQuery(event).token as string | undefined

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Missing token on query parameter',
    })
  }

  // TODO: Replace with real token validation logic
  if (token !== 'token_1234567890abcdef') {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token, you must provide a valid token',
    })
  }

  return token
}

/**
 * Validates JWT token from the Authorization header ('Bearer <token>').
 * Throws 401 error if missing, invalid format, or invalid token.
 */
export async function useJwtAuth(event: H3Event): Promise<any> {
  const authHeader = event.headers.get('Authorization')
  if (!authHeader) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Missing Authorization header',
    })
  }

  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid Authorization header format. Expected "Bearer <token>"',
    })
  }

  const token = parts[1]

  // Dummy validation
  if (token !== 'dummy_jwt_token') {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid or expired JWT token',
    })
  }

  // Dummy payload
  const dummyPayload = {
    id: 'user_123',
    email: 'admin@example.com',
    role: 'admin',
  }
  event.context.user = dummyPayload
  return dummyPayload
}
