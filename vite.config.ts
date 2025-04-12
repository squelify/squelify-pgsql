import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { createConsola } from 'consola'
import { isProduction, isTest } from 'std-env'
import { type Logger as ViteLogger, defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const _console = createConsola({ defaults: { tag: 'nitro' } })

const logger: ViteLogger = {
  info: (msg: string) => _console.info(msg),
  warn: (msg: string) => _console.warn(msg),
  warnOnce: (msg: string) => _console.warn(msg),
  error: (msg: string) => _console.error(msg),
  clearScreen: () => {},
  hasErrorLogged: () => true,
  hasWarned: false,
}

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
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
    chunkSizeWarningLimit: 1024 * 4,
    rollupOptions: { input: resolve('client/entry.client.tsx') },
    terserOptions: { format: { comments: false } },
    outDir: resolve('build/client'),
    reportCompressedSize: false,
    minify: isProduction,
  },
  publicDir: resolve('public'),
  esbuild: { legalComments: 'inline' },
  optimizeDeps: {
    /**
     * Excludes the specified packages from the Vite dependency optimization.
     * This can be useful to exclude packages that are not needed in the production build,
     * or to exclude packages that are causing issues during the build process.
     */
    exclude: ['react/jsx-runtime'],
  },
  customLogger: !isTest ? logger : undefined,
})
