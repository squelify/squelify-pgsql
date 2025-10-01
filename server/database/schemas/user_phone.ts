import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'
import { z } from 'zod'

// UserPhone schema with validation rules
export const UserPhoneSchema = z.object({
  id: z.custom<Generated<string>>(),
  userId: z.uuid(), // user_id, PK
  phoneNumber: z.string().regex(/^\+?[0-9]{8,20}$/, { message: 'Invalid phone number format' }),
  isPrimary: z.boolean().default(false),
  useForSignIn: z.boolean().default(false),
  useForMfa: z.boolean().default(false),
  createdAt: z.custom<ColumnType<Date, string | undefined, never>>().optional(),
  updatedAt: z.custom<ColumnType<Date, string | undefined, never>>().nullable(),
  verifiedAt: z.custom<ColumnType<Date, string | null>>().nullable(),
})

// Table interface for Kysely
export type IUserPhone = z.infer<typeof UserPhoneSchema>

// Kysely types for operations
export type UserPhone = Selectable<IUserPhone>
export type UserPhoneInsert = Insertable<IUserPhone>
export type UserPhoneUpdate = Updateable<IUserPhone>
