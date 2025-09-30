import { env } from 'std-env'
import pkg from './package.json' with { type: 'json' }

const appConfig = {
  identifier: pkg.name,
  version: pkg.version,
  baseURL: env.SQUELIFY_APP_BASE_URL || 'http://localhost:3000',
  database: {
    client: 'postgres',
    url: env.SQUELIFY_DATABASE_URL,
  },
  meta: {
    title: 'Squelify',
    description: 'A modern headless CMS and backend-as-a-service platform',
  },
}

export type AppConfig = typeof appConfig

export { appConfig }
