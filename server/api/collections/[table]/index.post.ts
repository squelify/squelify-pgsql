import { defineProtectedEventHandler } from '~/http/handlers'

export default defineProtectedEventHandler(async (event) => {
  const routePath = event.context.params?.table || 'unknown'

  return {
    message: 'Not implemented yet',
    path: routePath,
    fullUrl: event.node.req.url,
    params: event.context.params,
    method: event.method,
  }
})
