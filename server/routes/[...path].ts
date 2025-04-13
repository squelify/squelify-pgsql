import { renderSPAClient } from '~/http/handlers/spa.handler'
import { renderStaticPage } from '~/http/handlers/static.handler'

export default defineEventHandler((event) => {
  const matchedUrl = getRequestURL(event).pathname

  if (matchedUrl.startsWith('/api/')) {
    if (event.path.length !== 2) {
      return createErrorResponse(event, `Resource not found`, 404)
    }
    const message = `An error occurred while processing request to ${matchedUrl}`
    return sendError(
      event,
      createError({
        statusCode: event.node.res.statusCode,
        statusMessage: 'Squelify API Error',
        data: { path: matchedUrl, message },
      })
    )
  }

  // Handle SPA routes with prefix `/admin`
  if (matchedUrl.startsWith('/admin')) {
    return renderSPAClient(event)
  }

  // Otherwise, return default response or serve static pages
  return renderStaticPage(event)
})
