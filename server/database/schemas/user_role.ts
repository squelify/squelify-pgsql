import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'
import { z } from 'zod'

// UserRole schema with validation rules
export const UserRoleSchema = z.object({
  id: z.custom<Generated<string>>(),
  userId: z.uuid(), // user_id, PK
  roleId: z.uuid(), // role_id, PK
  grantedBy: z.uuid().nullable(),
  scopeType: z.enum(['global', 'team', 'resource']),
  scopeId: z.uuid().nullable(),
  isActive: z.boolean().default(true),
  assignedAt: z.custom<ColumnType<Date, string>>(),
  revokedAt: z.custom<ColumnType<Date, string | null>>().nullable(),
  revokedBy: z.uuid().nullable(),
  createdAt: z.custom<ColumnType<Date, string | undefined, never>>().optional(),
  updatedAt: z.custom<ColumnType<Date, string | undefined, never>>().nullable(),
})

export type IUserRole = z.infer<typeof UserRoleSchema>
export type UserRole = Selectable<IUserRole>
export type UserRoleInsert = Insertable<IUserRole>
export type UserRoleUpdate = Updateable<IUserRole>
