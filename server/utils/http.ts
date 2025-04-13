import type { H3Event } from 'h3'
import { digest } from 'ohash/crypto'
import { UAParser } from 'ua-parser-js'

export function getClientInfo(event: H3Event) {
  const clientIpAddress = getRequestIP(event, { xForwardedFor: true })
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

  return { clientIpAddress, clientIdentifier, userAgent, userAgentHash }
}
