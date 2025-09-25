import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'
import { z } from 'zod'

// User schema with validation rules
export const UserSchema = z.object({
  id: z.custom<Generated<string>>(),
  firstName: z.string().min(2, { error: 'First name must be at least 2 characters' }),
  lastName: z.string().nullable(),
  email: z.email({ error: 'Invalid email address' }),
  username: z
    .string()
    .min(4, { error: 'Username must be at least 4 characters' })
    .max(50, { error: 'Username must be a maximum of 50 characters' })
    .regex(/^[a-z0-9_]+$/, {
      error: 'Usernames may only contain lowercase letters, numbers and underscores',
    })
    .nullable(),
  avatarUrl: z.url({ error: 'Invalid avatar URL' }).nullable(),
  phoneNumber: z.string().nullable(),
  phoneNumberVerifiedAt: z.custom<ColumnType<Date, string | null>>().nullable(),
  emailVerifiedAt: z.custom<ColumnType<Date, string | null>>().nullable(),
  createdAt: z.custom<ColumnType<Date, string | undefined, never>>().optional(),
  updatedAt: z.custom<ColumnType<Date, string | undefined, never>>().nullable(),
  // deletedAt: z.custom<ColumnType<Date | null, string | undefined, string | undefined>>().nullable(),
})

// Table interface for Kysely
export type IUser = z.infer<typeof UserSchema>

// Kysely types for operations
export type User = Selectable<IUser>
export type UserInsert = Insertable<IUser>
export type UserUpdate = Updateable<IUser>
