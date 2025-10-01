import type { H3Event } from 'h3'
import { digest } from 'ohash/crypto'
import { UAParser } from 'ua-parser-js'

export function getClientInfo(event: H3Event) {
  const clientIP = getRequestIP(event, { xForwardedFor: true })
  const clientInfo = event.headers.get('X-Client-Info')
  const userAgent = event.headers.get('User-Agent') || ''
  const userAgentHash = digest(userAgent)

  let clientIdentifier = userAgent

  if (clientInfo) {
    clientIdentifier = `[${clientInfo}]`
  } else if (userAgent) {
    const uaParser = new UAParser(userAgent)
    // Check if browser info exists
    if (uaParser.getBrowser().name) {
      const clientOS = `${uaParser.getOS().name} ${uaParser.getOS().version}`
      const browserInfo = `${uaParser.getBrowser().name} ${uaParser.getBrowser().version}`
      clientIdentifier = `[${clientOS} ${browserInfo}]`
    }
  }

  return { clientIP, clientIdentifier, userAgent, userAgentHash }
}

interface ApiResponse<T = unknown> {
  status: number
  success: boolean
  message: string | null
  data?: T
  error?: {
    issues?: Array<{ field: string; message: string }>
    stack?: string
  }
}

export function createErrorResponse(
  event: H3Event,
  message: string,
  status: number,
  error?: {
    issues?: Array<{ field: string; message: string }>
    stack?: string
  }
): ApiResponse {
  setResponseStatus(event, status)
  return { status, success: false, message, error }
}
