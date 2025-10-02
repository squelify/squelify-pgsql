import { implement, ORPCError } from '@orpc/server'
import { ORPCContext } from '~/orpc/context'
import { setupContract } from '~/orpc/schemas/setup.schema'

const setup = implement(setupContract).$context<ORPCContext>()

export const executeSetupHandler = setup.execute.handler(async ({ input }) => {
  console.info('DEBUG', input)
  return {
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    username: input.username,
    password: input.password,
    subscribeToNewsletter: input.subscribeToNewsletter ?? false,
  }
})

export const validateSetupTokenHandler = setup.validateToken.handler(async ({ input }) => {
  const setupToken = '123e4567-e89b-12d3-a456-426614174099'
  const isInstalled = false // TODO: replace with actual check, e.g., await getAdminUserExists()

  if (!input.token || input.token !== setupToken) {
    return {
      valid: false,
      isInstalled,
      message: !input.token ? 'Setup token is required' : 'Invalid setup token',
    }
  }

  if (isInstalled) {
    return {
      valid: true,
      isInstalled: true,
      message: 'Application is already set up',
    }
  }

  return {
    valid: true,
    isInstalled: false,
    message: 'Setup token is valid',
  }
})
