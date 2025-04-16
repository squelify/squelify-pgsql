import type { H3Event } from 'h3'
import { handleBypassCache } from '~/utils/cache'
import { DURATION } from '~/utils/datetime'

export const handleStaticWeb = defineCachedFunction(
  async (event: H3Event) => {
    setResponseHeader(event, 'Content-Type', 'text/plain')
    return send(event, 'Nothing to see here!')
  },
  {
    shouldBypassCache: (e) => handleBypassCache(e),
    name: 'static-pages',
    maxAge: DURATION.MONTH,
    swr: true,
  }
)

defineRouteMeta({
  openAPI: { 'x-internal': true },
})
