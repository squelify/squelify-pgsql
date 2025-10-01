import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'
import { z } from 'zod'

// Session schema with validation rules
export const SessionSchema = z.object({
  id: z.custom<Generated<string>>(),
  userId: z.uuid(),
  tokenHash: z.string().min(1, { error: 'Token hash is required' }),
  userAgent: z.string().nullable(),
  deviceName: z.string().nullable(),
  deviceFingerprint: z.string().nullable(),
  ipAddress: z.string().nullable(),
  expiresAt: z.custom<ColumnType<Date, string>>(),
  createdAt: z.custom<ColumnType<Date, string | undefined, never>>().optional(),
  updatedAt: z.custom<ColumnType<Date, string | undefined, never>>().nullable(),
  lastAccessAt: z.custom<ColumnType<Date, string | null>>().nullable(),
  refreshedAt: z.custom<ColumnType<Date, string | null>>().nullable(),
  revokedAt: z.custom<ColumnType<Date, string | null>>().nullable(),
  revokedBy: z.uuid().nullable(),
})

// Table interface for Kysely
export type ISession = z.infer<typeof SessionSchema>

// Kysely types for operations
export type Session = Selectable<ISession>
export type SessionInsert = Insertable<ISession>
export type SessionUpdate = Updateable<ISession>
