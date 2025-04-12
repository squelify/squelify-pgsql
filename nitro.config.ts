import { resolve } from 'node:path'
import { createConsola } from 'consola'
import { makeDirectory } from 'make-dir'
import { isDevelopment, isProduction } from 'std-env'
import appConfig from './app.config'

const _console = createConsola({ defaults: { tag: 'nitro' } })

export default defineNitroConfig({
  compatibilityDate: '2025-04-11',
  preset: 'node-server',
  serveStatic: 'node',
  appConfig: appConfig,
  minify: isProduction,
  sourceMap: isDevelopment,
  srcDir: resolve('server'),

  publicAssets: [{ dir: resolve('public') }],
  serverAssets: [{ baseName: 'vite', dir: resolve('build/client/.vite') }],
  compressPublicAssets: { gzip: isProduction, brotli: isProduction },

  output: {
    dir: resolve('build'),
    serverDir: resolve('build/server'),
    publicDir: resolve('build/client'),
  },

  handlers: [{ handler: '~/http/middleware/core.ts', middleware: true }],
  errorHandler: '~/http/error',

  hooks: {
    'rollup:before': async (nitro) => {
      _console.info('Creating application data directory')
      await makeDirectory(resolve('storage'), { mode: 0o755 })

      if (nitro.options.dev) {
        _console.info('Spawning Vite development server')
        const { createServer } = await import('vite')
        const vite = await createServer()
        await vite.listen().then(async (viteContext) => {
          // Send Vite server address to runtime config
          const [serverAddress] = viteContext.resolvedUrls?.local ?? []
          nitro.options.runtimeConfig.viteServerUrl = serverAddress
          _console.success('Vite dev server ready:', serverAddress)
        })
      }
    },
    'build:before': async (nitro) => {
      if (!nitro.options.dev) {
        _console.start('Building frontend application')
        const { build } = await import('vite')
        await build().then(() => {
          _console.success('Frontend application built')
        })
      }
    },
  },

  devServer: { watch: ['server', 'client'] },
  esbuild: { options: { jsx: 'automatic', target: 'ES2022' } },
  typescript: { strict: true, generateTsConfig: false },
})
