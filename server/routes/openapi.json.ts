import { OpenAPIGenerator } from '@orpc/openapi'
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4'
import { router } from '~/orpc/router'

export default defineEventHandler(async (event) => {
  const generator = new OpenAPIGenerator({
    schemaConverters: [new ZodToJsonSchemaConverter()],
  })

  const spec = await generator.generate(router, {
    info: {
      title: 'Squelify API',
      version: '1.0.0',
    },
  })

  setResponseHeader(event, 'Content-Type', 'application/json')
  return send(event, JSON.stringify(spec, null, 2))
})

defineRouteMeta({
  openAPI: { 'x-internal': true },
})
