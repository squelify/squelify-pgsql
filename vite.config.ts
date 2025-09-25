import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { createConsola } from 'consola'
import sonda from 'sonda/vite'
import { isProduction, isTest } from 'std-env'
import { defineConfig, type Logger as ViteLogger } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const _console = createConsola({ defaults: { tag: 'vite' } })

const logger: ViteLogger = {
  info: (msg: string) => _console.info(msg),
  warn: (msg: string) => _console.warn(msg),
  warnOnce: (msg: string) => _console.warn(msg),
  error: (msg: string) => _console.error(msg),
  clearScreen: () => {},
  hasErrorLogged: () => true,
  hasWarned: false,
}

type AssetOutputEntry = {
  output: string
  regex: RegExp
}

const assets: AssetOutputEntry[] = [
  {
    output: 'images/[name]-[hash][extname]',
    regex: /\.(png|jpe?g|gif|svg|webp|avif)$/,
  },
  {
    output: 'css/[name]-[hash][extname]',
    regex: /\.css$/,
  },
  {
    output: 'assets/[name]-[hash][extname]',
    regex: /\.(js|ts|jsx|tsx)$/,
  },
  {
    output: '[name][extname]',
    regex: /\.(xml|json|txt)$/,
  },
]

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    {
      // Removes pure annotations warning on build from `@glideapps/glide-data-grid`
      // @ref: https://github.com/dotnet/aspnetcore/issues/55286#issuecomment-2557288741
      name: 'remove-pure-annotations',
      enforce: 'pre',
      transform(code, id) {
        if (id.includes('node_modules/@glideapps/glide-data-grid')) {
          return code.replace(/\/\*#__PURE__\*\//g, '')
        }
        return null
      },
    },
    sonda({ filename: 'build/sonda-report.html', open: false }),
  ],
  server: {
    strictPort: false,
    cors: { origin: '*' },
    hmr: { overlay: false },
  },
  clearScreen: true,
  envPrefix: ['PUBLIC_'],
  build: {
    manifest: true,
    emptyOutDir: true,
    sourcemap: !isProduction,
    chunkSizeWarningLimit: 1024 * 4,
    rolldownOptions: {
      input: resolve('client/entry.client.tsx'),
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const fileName = assetInfo.names?.[0] || ''

          // Determine the output path based on AssetOutputEntry entries
          for (const asset of assets) {
            if (fileName && asset.regex.test(fileName)) {
              return asset.output
            }
          }

          // Otherwise, use the default output path
          return 'assets/[name]-[hash][extname]'
        },
        chunkFileNames: (chunkInfo) => {
          // Get path from the first module in Chunk
          const firstId = chunkInfo.moduleIds[0] || ''

          // If the file has extensions like .tsx or .jsx, extract the folder name for prefix
          if (firstId.includes('/page.tsx') || firstId.includes('/page.jsx')) {
            const parts = firstId.split('/')
            const pageIndex = parts.findIndex((part) => part === 'page.tsx' || part === 'page.jsx')
            if (pageIndex > 0) {
              const parentFolder = parts[pageIndex - 1] || ''
              if (parentFolder && parentFolder !== 'client') {
                return `assets/page-${parentFolder}-[hash].js`
              }
            }
          }

          return 'assets/[name]-[hash].js'
        },
        manualChunks(id) {
          if (id.includes('react-dom')) {
            return 'react-dom'
          }
          if (id.includes('lucide-react')) {
            return 'lucide-react'
          }
          if (id.includes('@codemirror/view')) {
            return 'codemirror-view'
          }
          if (id.endsWith('.css') || id.includes('.module.css')) {
            return 'styles'
          }
        },
      },
    },
    terserOptions: { format: { comments: false } },
    outDir: resolve('build/client'),
    reportCompressedSize: false,
    minify: isProduction,
  },
  publicDir: resolve('public'),
  optimizeDeps: {
    /**
     * Excludes the specified packages from the Vite dependency optimization.
     * This can be useful to exclude packages that are not needed in the production build,
     * or to exclude packages that are causing issues during the build process.
     */
    exclude: ['react/jsx-runtime', '@electric-sql/pglite'],
  },
  customLogger: !isTest ? logger : undefined,
})
