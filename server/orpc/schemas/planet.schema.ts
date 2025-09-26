import { oc } from '@orpc/contract'
import { z } from 'zod'

export const PlanetSchema = z.object({
  id: z.number().int().min(1),
  name: z.string(),
  description: z.string().optional(),
})

export const paginationSchema = z.object({
  limit: z.number().int().min(1).max(100).optional(),
  cursor: z.number().int().min(0).default(0),
})

export const listPlanetContract = oc.input(paginationSchema).output(z.array(PlanetSchema))

export const findPlanetContract = oc.input(PlanetSchema.pick({ id: true })).output(PlanetSchema)

export const createPlanetContract = oc.input(PlanetSchema.omit({ id: true })).output(PlanetSchema)

export const planetContract = {
  list: listPlanetContract,
  find: findPlanetContract,
  create: createPlanetContract,
}
