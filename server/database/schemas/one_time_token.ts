import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'
import { z } from 'zod'

// OneTimeToken schema with validation rules
export const OneTimeTokenSchema = z.object({
  id: z.custom<Generated<string>>(),
  userId: z.uuid().nullable(),
  tokenType: z.string().min(1, { error: 'Token type is required' }),
  tokenHash: z.string().min(1, { error: 'Token hash is required' }),
  relatesTo: z.string().min(1, { error: 'Relates to is required' }),
  metadata: z.unknown().nullable(),
  createdAt: z.custom<ColumnType<Date, string | undefined, never>>().optional(),
  updatedAt: z.custom<ColumnType<Date, string | undefined, never>>().nullable(),
  expiresAt: z.custom<ColumnType<Date, string>>(),
  lastSentAt: z.custom<ColumnType<Date, string | null>>().nullable(),
})

// Table interface for Kysely
export type IOneTimeToken = z.infer<typeof OneTimeTokenSchema>

// Kysely types for operations
export type OneTimeToken = Selectable<IOneTimeToken>
export type OneTimeTokenInsert = Insertable<IOneTimeToken>
export type OneTimeTokenUpdate = Updateable<IOneTimeToken>
