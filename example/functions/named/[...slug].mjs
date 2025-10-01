export default async function (event) {
  const wildcardPath = event.context.params?.slug || 'unknown'
  return {
    message: 'This is a wildcard route with named parameter',
    path: wildcardPath,
    fullUrl: event.node.req.url,
    params: event.context.params,
    method: event.method,
    // Access to H3 utilities if needed
    query: event.h3.getQuery(),
  }
}
