import { createPlanet, findPlanet, listPlanet } from './handlers/planet.handler'
import { sysInfoHandler } from './handlers/sysinfo.handler'

export const router = {
  sysinfo: sysInfoHandler,
  planet: {
    list: listPlanet,
    find: findPlanet,
    create: createPlanet,
  },
}
