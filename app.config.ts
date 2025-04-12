import { env } from 'std-env'
import pkg from './package.json' with { type: 'json' }

const appConfig = {
  identifier: pkg.name,
  version: pkg.version,
  baseURL: env.APP_BASE_URL || 'http://localhost:3000',
  database: {
    client: 'sqlite',
    url: env.DATABASE_URL || 'sqlite:storage/local.db',
  },
  meta: {
    title: 'Nitro Application',
    description: 'Build fast and modern web applications with Nitro',
  },
}

export type AppConfig = typeof appConfig

export default appConfig
