import { createReadStream, existsSync, readdirSync } from 'node:fs'
import { stat } from 'node:fs/promises'
import { extname, join, resolve } from 'node:path'
import process from 'node:process'
import { createError, type H3Event, sendStream } from 'h3'
import { handleBypassCache } from '~/utils/cache'
import { DURATION } from '~/utils/datetime'

const ALLOWED_DOCS = ['html', 'css', 'json', 'js', 'pdf', 'txt']
const ALLOWED_IMAGES = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico']
const ALLOWED_ASSETS = ['woff2', 'woff', 'ttf', 'eot', 'otf']
const ALLOWED_MEDIA = ['mp4', 'mp3', 'wav', 'ogg', 'webm']

const ALLOWED_EXTENSIONS = [...ALLOWED_DOCS, ...ALLOWED_IMAGES, ...ALLOWED_ASSETS, ...ALLOWED_MEDIA]
const DEFAULT_INDEX_FILE = 'index.html'

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

    // For root path, check if index exists
    if (matchedUrl === '/') {
      const indexPath = join(staticDir, DEFAULT_INDEX_FILE)
      if (!(await isFileAccessible(indexPath))) {
        setResponseHeader(event, 'Content-Type', 'application/json')
        return { message: 'Nothing to see here' }
      }
    }

    let filePath = join(staticDir, matchedUrl)

    // Check if path exists
    if (!(await isFileAccessible(filePath))) {
      if (matchedUrl.endsWith('/')) {
        filePath = join(filePath, DEFAULT_INDEX_FILE)
        if (!(await isFileAccessible(filePath))) {
          throw createError({
            statusCode: 404,
            statusMessage: `Path ${matchedUrl} not accesssible`,
          })
        }
      } else {
        throw createError({ statusCode: 404, statusMessage: `Path ${matchedUrl} not found` })
      }
    }

    // Check if it's a directory
    const fileStat = await stat(filePath)
    if (fileStat.isDirectory()) {
      filePath = join(filePath, DEFAULT_INDEX_FILE)
      if (!(await isFileAccessible(filePath))) {
        throw createError({ statusCode: 404, statusMessage: 'Not Found' })
      }
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
