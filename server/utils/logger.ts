import { styleText } from 'node:util'
import { consola as _console_ } from 'consola'
import { LogLevels, createConsola } from 'consola/core'
import type { LogLevel, LogType } from 'consola/core'
import Redactyl from 'redactyl.js'
import { env } from 'std-env'

// Helper function to check if the script is running from the CLI
const isRunningFromCLI = (): boolean => process.argv.length > 2

/**
 * Generates a formatted timestamp string.
 * @param date - Optional Date object. Defaults to current date/time.
 * @param localtime - Whether to use local time. Defaults to true.
 * @returns Formatted timestamp string.
 */
function formatTimestamp(date?: Date, localtime = env.TZ !== 'UTC'): string {
  if (env.DISABLE_LOG_TIMESTAMP) return ''

  const now = date ?? new Date()
  const useUTC = !localtime

  const year = useUTC ? now.getUTCFullYear() : now.getFullYear()
  const month = String(useUTC ? now.getUTCMonth() + 1 : now.getMonth() + 1).padStart(2, '0')
  const day = String(useUTC ? now.getUTCDate() : now.getDate()).padStart(2, '0')
  const hours = String(useUTC ? now.getUTCHours() : now.getHours()).padStart(2, '0')
  const minutes = String(useUTC ? now.getUTCMinutes() : now.getMinutes()).padStart(2, '0')
  const seconds = String(useUTC ? now.getUTCSeconds() : now.getSeconds()).padStart(2, '0')

  return styleText('gray', `[${year}-${month}-${day} ${hours}:${minutes}:${seconds}]`)
}

// Instantiate Redactyl with sensitive fields to redact
const redactyl = new Redactyl({
  properties: ['apiKey', 'password', 'passwordHash', 'phone', 'email', 'token', 'cvv'],
  text: '[REDACTED]',
})

// Colorize the log type based on the log type.
// Starting from Node.js `20.10.0` and `21.7.0` we can format a text using a styleText utility function.
const formatLogType = (type: LogType): string => {
  switch (type) {
    case 'fatal':
      return styleText('redBright', `[${type.toUpperCase()}]`)
    case 'error':
      return styleText('red', `[${type.toUpperCase()}]`)
    case 'warn':
      return styleText('yellow', `[${type.toUpperCase()}]`)
    case 'log':
      return styleText('white', `[${type.toUpperCase()}]`)
    case 'info':
      return styleText('blue', `[${type.toUpperCase()}]`)
    case 'success':
      return styleText('green', `[${type.toUpperCase()}]`)
    case 'fail':
      return styleText('magenta', `[${type.toUpperCase()}]`)
    case 'ready':
      return styleText('cyan', `[${type.toUpperCase()}]`)
    case 'start':
      return styleText('blueBright', `[${type.toUpperCase()}]`)
    case 'box':
      return styleText('whiteBright', `[${type.toUpperCase()}]`)
    case 'debug':
      return styleText(['bgGrey', 'white'], `[${type.toUpperCase()}]`)
    case 'trace':
      return styleText('gray', `[${type.toUpperCase()}]`)
    case 'verbose':
      return styleText('cyanBright', `[${type.toUpperCase()}]`)
    case 'silent':
      return styleText('gray', `[${type.toUpperCase()}]`)
    default:
      return styleText('white', `[${type}]`)
  }
}

const getLogLevelNumber = (logType: LogType): LogLevel => LogLevels[logType] as LogLevel
const LOG_LEVEL = getLogLevelNumber((env.APP_LOG_LEVEL as LogType) || 'info')

export default createConsola({
  formatOptions: { compact: true, colors: true, columns: 0, errorLevel: 4 },
  defaults: { tag: 'app' },
  level: LOG_LEVEL,
  reporters: [
    {
      log: ({ type, tag, args, date, level }) => {
        // Redact sensitive data if log level is less than 4 (debug)
        const msg = level < 4 ? redactyl.redact<any>(args) : args
        const logTag = styleText('gray', `[${tag}]`)
        const logTime = formatTimestamp(date)
        const logType = formatLogType(type)

        return isRunningFromCLI()
          ? _console_.log(logTag, ...args)
          : _console_.log(logTime, logType, logTag, ...msg)
      },
    },
  ],
})
