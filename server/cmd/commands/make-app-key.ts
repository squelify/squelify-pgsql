import { defineCommand } from 'citty'
import consola from 'consola'
import { randomUUID } from 'uncrypto'
import { newAPIKey, Options } from 'uuidkey'

export default defineCommand({
  meta: {
    name: 'make:app-key',
    description: 'Create application secret keys',
  },
  args: {
    help: {
      type: 'boolean',
      description: 'Print information about the command',
      default: false,
    },
  },
  run() {
    const _console_ = consola.create({ formatOptions: { date: false } })
    try {
      const appSecretKey = newAPIKey('KEY', randomUUID(), Options.With256BitEntropy)
      const publishableKey = newAPIKey('PUB', randomUUID(), Options.With128BitEntropy)
      const jwtKeyStr = newAPIKey('JWK', randomUUID(), Options.With160BitEntropy)

      _console_.log(`SQUELIFY_APP_SECRET_KEY=${appSecretKey.toString().toLowerCase()}`)
      _console_.log(`SQUELIFY_PUBLISHABLE_KEY=${publishableKey.toString().toLowerCase()}`)
      _console_.log(`SQUELIFY_JWT_SECRET_KEY=${jwtKeyStr.toString().toLowerCase()}`)
    } catch (error) {
      _console_.error(error instanceof Error ? error.message : 'Unknown error occurred')
      process.exit(1)
    }
  },
})
