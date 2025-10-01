export default async function (event) {
  // In H3 wildcard routes, the captured path is available as params._
  const wildcardPath = event.context.params?._ || 'unknown'

  return {
    message: 'This is a wildcard route',
    path: wildcardPath,
    fullUrl: event.node.req.url,
    params: event.context.params,
    method: event.method,
    // Access to H3 utilities if needed
    query: event.h3.getQuery(),
  }
}
