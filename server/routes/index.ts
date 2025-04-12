import { process } from 'std-env'
import { handleBypassCache } from '~/utils/cache'
import { DURATION } from '~/utils/datetime'

type Manifest = Record<string, { css: string[]; file: string; isEntry: boolean }>

interface RenderSPATemplate {
  csrfToken: string
  title: string
  children: string
  cssLinks?: string[]
}

const renderSPATemplate = (props: RenderSPATemplate) => `<!DOCTYPE html>
<html lang="en" data-theme="light">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="csrf-token" content="${props.csrfToken}" />
    <!-- <link rel="icon" type="image/x-icon" href="/favicon.ico" /> -->
    <!-- <link rel="icon" type="image/svg+xml" href="/favicon.svg" /> -->
    <!-- <link rel="icon" type="image/png" href="/favicon.png" /> -->
    <!-- <link rel="manifest" href="/site.webmanifest" /> -->
    ${props.cssLinks?.map((link) => `<link rel="stylesheet" href="${link}" />`)}
    <title>${props.title}</title>
  </head>
  <body>${props.children}</body>
</html>
`

export default defineCachedEventHandler(
  async (event) => {
    setResponseHeader(event, 'Content-Type', 'text/html')

    // Get values from context
    const { appConfig, csrfToken } = event.context

    if (process.dev) {
      const config = useRuntimeConfig()
      const viteServerUrl = config.viteServerUrl

      if (!viteServerUrl) {
        // Check Vite server is initialized
        throw new Error('Vite server URLs not resolved')
      }

      const body = `
<div id="app"></div>
<script type="module">
  window.$RefreshReg$ = () => {}
  window.$RefreshSig$ = () => (type) => type
  window.__vite_plugin_react_preamble_installed__ = true
</script>
<script type="module" src="${viteServerUrl}@vite/client"></script>
<script type="module" src="${viteServerUrl}client/entry.client.tsx"></script>
`

      const html = renderSPATemplate({
        csrfToken: csrfToken,
        title: appConfig.meta.title,
        children: body,
        cssLinks: [],
      })

      return send(event, html)
    }

    const manifest = await useStorage('assets:vite').getItem<Manifest>(`manifest.json`)

    if (!manifest) {
      setResponseStatus(event, 500)
      return 'Missing manifest'
    }

    const entryChunk = Object.values(manifest).find(
      (chunk) => chunk.isEntry && chunk.file.includes('entry.client')
    )

    if (!entryChunk) {
      setResponseStatus(event, 500)
      return `Missing entry.client entry chunk`
    }

    // Add leading slash to all css files
    const cssLinks = entryChunk.css.map((css) => (css.startsWith('/') ? css : `/${css}`))
    const body = `<div id="app"></div>\n<script type="module" src="/${entryChunk.file}"></script>`

    const html = renderSPATemplate({
      csrfToken: csrfToken,
      title: appConfig.meta.title,
      children: body,
      cssLinks: cssLinks,
    })

    return send(event, html)
  },
  {
    shouldBypassCache: (e) => handleBypassCache(e),
    maxAge: DURATION.MONTH,
  }
)
