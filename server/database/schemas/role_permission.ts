import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'
import { z } from 'zod'

// RolePermission schema with validation rules
export const RolePermissionSchema = z.object({
  id: z.custom<Generated<string>>(),
  roleId: z.uuid(),
  permissionId: z.uuid(),
  createdAt: z.custom<ColumnType<Date, string | undefined, never>>().optional(),
  updatedAt: z.custom<ColumnType<Date, string | undefined, never>>().nullable(),
})

// Table interface for Kysely
export type IRolePermission = z.infer<typeof RolePermissionSchema>

// Kysely types for operations
export type RolePermission = Selectable<IRolePermission>
export type RolePermissionInsert = Insertable<IRolePermission>
export type RolePermissionUpdate = Updateable<IRolePermission>
