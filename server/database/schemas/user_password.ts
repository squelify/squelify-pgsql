import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'
import { z } from 'zod'

// UserPassword schema with validation rules
export const UserPasswordSchema = z.object({
  userId: z.uuid(), // user_id, PK
  passwordHash: z.instanceof(Uint8Array),
  createdAt: z.custom<ColumnType<Date, string | undefined, never>>().optional(),
  updatedAt: z.custom<ColumnType<Date, string | undefined, never>>().nullable(),
})

// Table interface for Kysely
export type IUserPassword = z.infer<typeof UserPasswordSchema>

// Kysely types for operations
export type UserPassword = Selectable<IUserPassword>
export type UserPasswordInsert = Insertable<IUserPassword>
export type UserPasswordUpdate = Updateable<IUserPassword>
