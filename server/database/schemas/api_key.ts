import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'
import { z } from 'zod'

// APIKey schema with validation rules
export const APIKeySchema = z.object({
  id: z.custom<Generated<string>>(),
  userId: z.uuid(),
  keyName: z.string().min(1, { error: 'Key name is required' }),
  keyHash: z.string().min(1, { error: 'Key hash is required' }),
  keyPrefix: z.string().min(1, { error: 'Key prefix is required' }),
  permissions: z.unknown(), // JSONB, required
  scopeRestrictions: z.unknown().nullable(), // JSONB, optional
  usageCount: z.bigint().or(z.number()).default(0),
  lastUsedAt: z.custom<ColumnType<Date, string | null>>().nullable(),
  expiresAt: z.custom<ColumnType<Date, string | null>>().nullable(),
  isActive: z.boolean().default(true),
  createdAt: z.custom<ColumnType<Date, string | undefined, never>>().optional(),
  updatedAt: z.custom<ColumnType<Date, string | undefined, never>>().nullable(),
})

// Table interface for Kysely
export type IAPIKey = z.infer<typeof APIKeySchema>

// Kysely types for operations
export type APIKey = Selectable<IAPIKey>
export type APIKeyInsert = Insertable<IAPIKey>
export type APIKeyUpdate = Updateable<IAPIKey>
