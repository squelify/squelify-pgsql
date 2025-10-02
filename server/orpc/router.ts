import { createPlanet, findPlanet, listPlanet } from './handlers/planet.handler'
import { executeSetupHandler, validateSetupTokenHandler } from './handlers/setup.handler'
import { sysInfoHandler } from './handlers/sysinfo.handler'

export const router = {
  sysinfo: sysInfoHandler,
  setup: {
    execute: executeSetupHandler,
    validateToken: validateSetupTokenHandler,
  },
  planet: {
    list: listPlanet,
    find: findPlanet,
    create: createPlanet,
  },
}
