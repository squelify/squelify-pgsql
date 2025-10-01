import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'
import { z } from 'zod'

// Permission schema with validation rules
export const PermissionSchema = z.object({
  id: z.custom<Generated<string>>(),
  name: z.string().min(1, { error: 'Permission name is required' }),
  slug: z.string().min(1, { error: 'Permission slug is required' }),
  description: z.string().nullable(),
  resourceType: z.string().min(1, { error: 'Resource type is required' }),
  action: z.string().min(1, { error: 'Action is required' }),
  isActive: z.boolean().default(true),
  lastUsedAt: z.custom<ColumnType<Date, string | null>>().nullable(),
  createdAt: z.custom<ColumnType<Date, string | undefined, never>>().optional(),
  updatedAt: z.custom<ColumnType<Date, string | undefined, never>>().nullable(),
})

// Table interface for Kysely
export type IPermission = z.infer<typeof PermissionSchema>

// Kysely types for operations
export type Permission = Selectable<IPermission>
export type PermissionInsert = Insertable<IPermission>
export type PermissionUpdate = Updateable<IPermission>
