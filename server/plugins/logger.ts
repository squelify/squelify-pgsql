import { getClientInfo } from '~/utils/http'
import logger from '~/utils/logger'

export default defineNitroPlugin(({ hooks }) => {
  hooks.hook('request', (event) => {
    // Set precise timestamp when request starts
    event.context.requestStartTime = performance.now()
    const { clientIP, clientIdentifier, userAgentHash } = getClientInfo(event)
    const ua = `${clientIdentifier}[${userAgentHash}]`
    logger.withTag('REQ').withTag(event.method).info(`[${clientIP}]`, ua, event.path)
  })

  hooks.hook('afterResponse', (event) => {
    const { clientIP, clientIdentifier, userAgentHash } = getClientInfo(event)
    const ua = `${clientIdentifier}[${userAgentHash}]`
    const endTime = performance.now()
    const startTime = event.context.requestStartTime
    const statusCode = event.node.res.statusCode
    const responseTimeMs = (endTime - startTime).toFixed(2)
    const respStatus = `[${statusCode}][${responseTimeMs}ms]`

    logger.withTag('RES').withTag(event.method).info(`[${clientIP}]`, ua, event.path, respStatus)
  })

  hooks.hook('error', async (error, { event }) => {
    logger.error(event?.path, error)
  })
})
