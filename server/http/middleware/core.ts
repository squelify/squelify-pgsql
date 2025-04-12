import type { AppConfig } from '~~/app.config'

export default defineEventHandler(async (event) => {
  const appConfig = useAppConfig(event) as AppConfig
  event.context.appConfig = appConfig
})

declare module 'h3' {
  interface H3EventContext {
    appConfig: AppConfig
  }
}
