import { DURATION } from '~/utils/datetime'
import { generateRandomStr } from '~/utils/string'

const CSRF_TOKEN_LENGTH = 40
const CSRF_TOKEN_DURATION = DURATION.MINUTE * 1

/**
 * Generate CSRF token with timestamp
 * Returns token in format: {random_string}.{expiry_timestamp}
 */
function generateCSRFToken(): string {
  const token = generateRandomStr({ size: CSRF_TOKEN_LENGTH })
  const timestamp = nowUnix() + CSRF_TOKEN_DURATION
  return `${token}.${timestamp}`
}

/**
 * Validates CSRF token format and expiry
 * Returns true if token is valid and not expired
 */
function validateCSRFToken(token: string): boolean {
  if (!token || !token.includes('.')) return false

  const [value, expiry] = token.split('.')
  const expiryTime = Number(expiry)

  if (!value || value.length !== CSRF_TOKEN_LENGTH) return false
  if (Number.isNaN(expiryTime)) return false

  return expiryTime > nowUnix()
}

export default defineNitroPlugin(async (nitroApp) => {
  nitroApp.hooks.hook('request', (event) => {
    // Check existing CSRF token
    let csrfToken = getCookie(event, 'csrf_token')

    if (!csrfToken || !validateCSRFToken(csrfToken)) {
      // Generate new token if not exists or expired
      csrfToken = generateCSRFToken()

      setCookie(event, 'csrf_token', csrfToken, {
        path: '/',
        secure: event.headers.get('x-forwarded-proto') === 'https',
        maxAge: CSRF_TOKEN_DURATION,
        sameSite: 'lax',
        httpOnly: true,
      })
    }

    // Attach CSRF token to event context
    event.context.csrfToken = csrfToken
  })
})

declare module 'h3' {
  interface H3EventContext {
    csrfToken: string
  }
}
