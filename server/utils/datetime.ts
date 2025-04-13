import { format } from 'date-fns'

/**
 * Constants representing common time durations in seconds.
 * These can be used to easily calculate and work with time-based values.
 */
export const DURATION = {
  MINUTE: 60,
  HOUR: 60 * 60,
  DAY: 24 * 60 * 60,
  WEEK: 7 * 24 * 60 * 60,
  MONTH: 30 * 24 * 60 * 60,
} as const

/**
 * Returns the current time in Unix timestamp format.
 * @returns {number} The current time in seconds since the Unix epoch.
 */
export function nowUnix(): number {
  return Math.floor(Date.now() / 1000)
}

/**
 * Returns the current time in ISO8601 format that fully compatible with PostgreSQL timestamptz.
 * @returns {string} The current time in the format "YYYY-MM-DD HH:mm:ss.SSSSSS+00:00".
 */
export function nowUtc(): string {
  const now = new Date()

  // Get milliseconds and pad to 3 digits, then append '000' to create 6-digit microseconds
  const milliseconds = now.getMilliseconds()
  const microseconds = `${String(milliseconds).padStart(3, '0')}000`

  // Format the main part of the datetime
  const formattedTime = format(now, 'yyyy-MM-dd HH:mm:ss')

  // Get timezone offset with proper format +HH:MM
  const tzOffset = format(now, 'xxx')

  return `${formattedTime}.${microseconds}${tzOffset}`
}
