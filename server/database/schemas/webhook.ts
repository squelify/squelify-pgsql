import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'
import { z } from 'zod'

// Webhook schema with validation rules
export const WebhookSchema = z.object({
  id: z.custom<Generated<string>>(),
  profileName: z.string().min(1, { error: 'Profile name is required' }),
  userId: z.uuid(), // user_id, PK
  webhookUrl: z.string().url({ error: 'Invalid webhook URL' }),
  httpMethod: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
  payloadTemplate: z.unknown().nullable(),
  requestHeaders: z.unknown().nullable(),
  authenticationType: z.enum(['none', 'basic', 'bearer', 'api_key', 'oauth2']),
  authenticationConfig: z.unknown().nullable(),
  retryAttempts: z.number().int().default(3),
  retryBackoffSeconds: z.number().int().default(30),
  requestTimeoutSeconds: z.number().int().default(60),
  isSslVerificationEnabled: z.boolean().default(true),
  isActive: z.boolean().default(true),
  lastUsedAt: z.custom<ColumnType<Date, string | null>>().nullable(),
  successCount: z.bigint().or(z.number()).default(0),
  failureCount: z.bigint().or(z.number()).default(0),
  createdAt: z.custom<ColumnType<Date, string | undefined, never>>().optional(),
  updatedAt: z.custom<ColumnType<Date, string | undefined, never>>().nullable(),
})

// Table interface for Kysely
export type IWebhook = z.infer<typeof WebhookSchema>

// Kysely types for operations
export type Webhook = Selectable<IWebhook>
export type WebhookInsert = Insertable<IWebhook>
export type WebhookUpdate = Updateable<IWebhook>
