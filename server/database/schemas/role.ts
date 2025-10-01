import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'
import { z } from 'zod'

// Role schema with validation rules
export const RoleSchema = z.object({
  id: z.custom<Generated<string>>(),
  name: z.string().min(1, { error: 'Role name is required' }),
  slug: z.string().min(1, { error: 'Role slug is required' }),
  description: z.string().nullable(),
  roleType: z.enum(['system', 'organization', 'custom']),
  isActive: z.boolean().default(true),
  isDefault: z.boolean().default(false),
  lastUsedAt: z.custom<ColumnType<Date, string | null>>().nullable(),
  createdAt: z.custom<ColumnType<Date, string | undefined, never>>().optional(),
  updatedAt: z.custom<ColumnType<Date, string | undefined, never>>().nullable(),
})

// Table interface for Kysely
export type IRole = z.infer<typeof RoleSchema>

// Kysely types for operations
export type Role = Selectable<IRole>
export type RoleInsert = Insertable<IRole>
export type RoleUpdate = Updateable<IRole>
