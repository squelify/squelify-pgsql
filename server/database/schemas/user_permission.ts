import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'
import { z } from 'zod'

// UserPermission schema with validation rules
export const UserPermissionSchema = z.object({
  id: z.custom<Generated<string>>(),
  userId: z.uuid(), // user_id, PK
  permissionId: z.uuid(),
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

// Table interface for Kysely
export type IUserPermission = z.infer<typeof UserPermissionSchema>

// Kysely types for operations
export type UserPermission = Selectable<IUserPermission>
export type UserPermissionInsert = Insertable<IUserPermission>
export type UserPermissionUpdate = Updateable<IUserPermission>
