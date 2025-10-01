import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'
import { z } from 'zod'

// User schema with validation rules
export const UserSchema = z.object({
  id: z.custom<Generated<string>>(),
  email: z.string().email({ error: 'Invalid email address' }),
  username: z
    .string()
    .min(3, { error: 'Username must be at least 3 characters' })
    .max(32, { error: 'Username must be a maximum of 32 characters' })
    .regex(/^[a-zA-Z0-9_]+$/, {
      error: 'Usernames may only contain letters, numbers and underscores',
    })
    .nullable(),
  displayName: z.string().min(1, { error: 'Display name is required' }),
  avatarUrl: z.string().url({ error: 'Invalid avatar URL' }).nullable(),
  metadata: z.unknown().nullable(),
  createdAt: z.custom<ColumnType<Date, string | undefined, never>>().optional(),
  updatedAt: z.custom<ColumnType<Date, string | undefined, never>>().nullable(),
  // deletedAt: z.custom<ColumnType<Date | null, string | undefined, string | undefined>>().nullable(),
  emailVerifiedAt: z.custom<ColumnType<Date, string | null>>().nullable(),
  lastLoginAt: z.custom<ColumnType<Date, string | null>>().nullable(),
  bannedAt: z.custom<ColumnType<Date, string | null>>().nullable(),
  banExpires: z.custom<ColumnType<Date, string | null>>().nullable(),
  banReason: z.string().nullable(),
})

// Table interface for Kysely
export type IUser = z.infer<typeof UserSchema>

// Kysely types for operations
export type User = Selectable<IUser>
export type UserInsert = Insertable<IUser>
export type UserUpdate = Updateable<IUser>
