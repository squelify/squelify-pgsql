import { createReadStream, existsSync, readdirSync } from 'node:fs'
import { stat } from 'node:fs/promises'
import { extname, join, resolve } from 'node:path'
import process, { env } from 'node:process'
import { createError, type H3Event, sendStream } from 'h3'
import { handleBypassCache } from '~/utils/cache'
import { DURATION } from '~/utils/datetime'

const ALLOWED_DOCS = ['html', 'css', 'json', 'js', 'pdf', 'txt']
const ALLOWED_IMAGES = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico']
const ALLOWED_ASSETS = ['woff2', 'woff', 'ttf', 'eot', 'otf']
const ALLOWED_MEDIA = ['mp4', 'mp3', 'wav', 'ogg', 'webm']

const ALLOWED_EXTENSIONS = [...ALLOWED_DOCS, ...ALLOWED_IMAGES, ...ALLOWED_ASSETS, ...ALLOWED_MEDIA]

// Default index files (comma-separated in env)
const SQUELIFY_DEFAULT_INDEX_FILES = env.SQUELIFY_DEFAULT_INDEX_FILES?.split(',')
  .map((f) => f.trim())
  .filter(Boolean) || ['index.html']

// Check if file exists and is accessible
async function isFileAccessible(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

export const handleStaticWeb = defineCachedFunction(
  async (event: H3Event) => {
    const matchedUrl = getRequestURL(event).pathname
    const staticDir = resolve(process.cwd(), 'storage/wwwroot')

    // Check if directory exists and not empty
    if (!existsSync(staticDir) || readdirSync(staticDir).length === 0) {
      setResponseHeader(event, 'Content-Type', 'application/json')
      return { message: 'Nothing to see here' }
    }

    // For root path, check if index.html or default.html exists
    if (matchedUrl === '/') {
      let foundIndex = null
      for (const file of SQUELIFY_DEFAULT_INDEX_FILES) {
        const indexPath = join(staticDir, file)
        if (await isFileAccessible(indexPath)) {
          foundIndex = indexPath
          break
        }
      }
      if (!foundIndex) {
        setResponseHeader(event, 'Content-Type', 'application/json')
        return { message: 'Nothing to see here' }
      }
      // Serve the found index file
      const fileExt = extname(foundIndex).slice(1)
      if (!ALLOWED_EXTENSIONS.includes(fileExt)) {
        logger.error('File type not allowed:', fileExt)
        throw createError({ statusCode: 403, statusMessage: 'File type not allowed' })
      }
      const fileStream = createReadStream(foundIndex)
      setHeader(event, 'Cache-Control', 'public, max-age=3600')
      return sendStream(event, fileStream)
    }

    let filePath = join(staticDir, matchedUrl)

    // Check if path exists
    if (!(await isFileAccessible(filePath))) {
      if (matchedUrl.endsWith('/')) {
        // Try default index files in the directory
        let foundIndex = null
        for (const file of SQUELIFY_DEFAULT_INDEX_FILES) {
          const indexPath = join(filePath, file)
          if (await isFileAccessible(indexPath)) {
            foundIndex = indexPath
            break
          }
        }
        if (!foundIndex) {
          throw createError({
            statusCode: 404,
            statusMessage: `Path ${matchedUrl} not accesssible`,
          })
        }
        filePath = foundIndex
      } else {
        throw createError({ statusCode: 404, statusMessage: `Path ${matchedUrl} not found` })
      }
    }

    // Check if it's a directory
    const fileStat = await stat(filePath)
    if (fileStat.isDirectory()) {
      // Try default index files in the directory
      let foundIndex = null
      for (const file of SQUELIFY_DEFAULT_INDEX_FILES) {
        const indexPath = join(filePath, file)
        if (await isFileAccessible(indexPath)) {
          foundIndex = indexPath
          break
        }
      }
      if (!foundIndex) {
        throw createError({ statusCode: 404, statusMessage: 'Not Found' })
      }
      filePath = foundIndex
    }

    // Validate file extension
    const fileExt = extname(filePath).slice(1)
    if (!ALLOWED_EXTENSIONS.includes(fileExt)) {
      logger.error('File type not allowed:', fileExt)
      throw createError({ statusCode: 403, statusMessage: 'File type not allowed' })
    }

    const fileStream = createReadStream(filePath)
    setHeader(event, 'Cache-Control', 'public, max-age=3600')

    return sendStream(event, fileStream)
  },
  {
    shouldBypassCache: (e) => handleBypassCache(e),
    name: 'static-web-pages',
    maxAge: DURATION.MONTH,
    swr: true,
  }
)

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
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <!-- <link rel="manifest" href="/site.webmanifest" /> -->
    ${props.cssLinks?.map((link) => `<link rel="stylesheet" href="${link}" />`)}
    <title>${props.title}</title>
  </head>
  <body>${props.children}</body>
</html>
`

export const renderSPAClient = defineCachedFunction(
  async (event: H3Event) => {
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
    name: 'spa-client-html',
    maxAge: DURATION.MONTH,
    swr: true,
  }
)
