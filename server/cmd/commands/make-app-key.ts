import { defineCommand } from 'citty'
import consola from 'consola'
import { randomUUID } from 'uncrypto'
import { newAPIKey, Options } from 'uuidkey'

export default defineCommand({
  meta: {
    name: 'make:app-key',
    description: 'Create application secret key',
  },
  args: {
    plain: {
      type: 'boolean',
      description: 'Print only the key',
      default: false,
    },
    help: {
      type: 'boolean',
      description: 'Print information about the command',
      default: false,
    },
  },
  run({ args }) {
    try {
      const generatedKey = newAPIKey('SKEY', randomUUID(), Options.With160BitEntropy)
      const keyStr = generatedKey.toString().toLowerCase()

      if (args.plain) {
        consola.log(keyStr)
        return
      }

      consola.log(`JWT_SECRET_KEY=${keyStr}`)
    } catch (error) {
      consola.error(error instanceof Error ? error.message : 'Unknown error occurred')
      process.exit(1)
    }
  },
})
