import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'
import { z } from 'zod'

// RefreshToken schema with validation rules
export const RefreshTokenSchema = z.object({
  id: z.custom<Generated<string>>(),
  userId: z.uuid(),
  sessionId: z.uuid().nullable(),
  tokenHash: z.instanceof(Uint8Array),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  lastUsedAt: z.custom<ColumnType<Date, string | null>>().nullable(),
  expiresAt: z.custom<ColumnType<Date, string>>(),
  createdAt: z.custom<ColumnType<Date, string | undefined, never>>().optional(),
  updatedAt: z.custom<ColumnType<Date, string | undefined, never>>().nullable(),
  revokedAt: z.custom<ColumnType<Date, string | null>>().nullable(),
  revokedBy: z.uuid().nullable(),
})

// Table interface for Kysely
export type IRefreshToken = z.infer<typeof RefreshTokenSchema>

// Kysely types for operations
export type RefreshToken = Selectable<IRefreshToken>
export type RefreshTokenInsert = Insertable<IRefreshToken>
export type RefreshTokenUpdate = Updateable<IRefreshToken>
