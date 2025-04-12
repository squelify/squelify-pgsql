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
