import { randomBytes } from '@noble/hashes/utils'

/**
 * Generates a cryptographically secure random key with specified length
 * Uses uncrypto which provides isomorphic crypto API
 */
interface RandomStringOptions {
  size?: number
  pattern?: string
  prefix?: string
  digitsOnly?: boolean
  includeLower?: boolean
  includeUpper?: boolean
  includeSpecial?: boolean
}

export function generateRandomStr(config: RandomStringOptions = {}): string {
  const digits = '0123456789'
  const lowerChars = 'abcdefghijklmnopqrstuvwxyz'
  const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'

  let allowedChars = lowerChars + upperChars + digits

  if (config.pattern) allowedChars = config.pattern
  if (config.digitsOnly) allowedChars = digits
  if (config.includeLower === false) allowedChars = allowedChars.replace(lowerChars, '')
  if (config.includeUpper === false) allowedChars = allowedChars.replace(upperChars, '')
  if (config.includeSpecial) allowedChars += specialChars

  const size = config.size || 10
  const bytes = randomBytes(size)

  let result = ''
  for (let i = 0; i < size; i++) {
    const byte = bytes[i] ?? 0
    result += allowedChars[byte % allowedChars.length] ?? allowedChars[0]
  }

  return config.prefix ? `${config.prefix}${result}` : result
}

export function generateUsername(email: string, suffix?: string): string {
  const emailParts = email.split('@')
  const firstPart = emailParts[0] ?? ''
  const baseUsername = firstPart.toLowerCase().replace(/[^a-z0-9]/g, '')
  return suffix ? `${baseUsername}_${suffix}` : baseUsername
}

/**
 * Cleans a string by performing the following operations:
 * - Trims leading and trailing whitespace
 * - Removes single quotes, double quotes, and backticks
 * - Removes angle brackets (< and >)
 * - Replaces multiple consecutive spaces with a single space
 *
 * @param str - The input string to be cleaned
 * @returns The cleaned string
 */
export function cleanString(str: string): string {
  return str
    .trim()
    .replace(/[\r\n\t]/g, '') // Removes newlines and tabs
    .replace(/ {2,}/g, ' ') // Replace multiple spaces with a single space
    .replace(/['""`<>]/g, '') // Remove quotes and < > characters
}

/**
 * Compares provided token with stored token
 * Returns true if tokens match exactly
 */
export function compareCSRFTokens(providedToken: string, storedToken: string): boolean {
  if (!providedToken || !storedToken) return false

  // Get token value without timestamp
  const [providedValue] = providedToken.split('.')
  const [storedValue] = storedToken.split('.')

  return providedValue === storedValue
}
