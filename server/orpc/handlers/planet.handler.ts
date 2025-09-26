import { implement, ORPCError } from '@orpc/server'
import { ORPCContext } from '~/orpc/context'
import { planetContract } from '~/orpc/schemas/planet.schema'

const planet = implement(planetContract).$context<ORPCContext>()

export const listPlanet = planet.list.handler(async () => {
  return [{ id: 1, name: 'name' }]
})

export const findPlanet = planet.find.handler(async () => {
  return { id: 1, name: 'name' }
})

export const createPlanet = planet
  .use(({ next, context }) => {
    const user = parseJWT(context.headers.authorization?.split(' ')[1])
    if (user) {
      return next({ context: { user } })
    }
    throw new ORPCError('UNAUTHORIZED')
  })
  .create.handler(async () => {
    return { id: 1, name: 'name' }
  })

// Dummy parse function, replace with real JWT parsing logic
const parseJWT = (token?: string) => {
  if (!token) return null
  return { id: 1, name: 'User' }
}
