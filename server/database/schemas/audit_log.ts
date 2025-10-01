import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'
import { z } from 'zod'

// AuditLog schema with validation rules
export const AuditLogSchema = z.object({
  id: z.custom<Generated<string>>(),
  userId: z.uuid().nullable(), // user_id, nullable
  auditedResourceType: z.string().min(1, { error: 'Resource type is required' }),
  auditedResourceId: z.uuid(),
  auditAction: z.enum(['create', 'update', 'delete', 'login', 'logout']),
  previousValues: z.unknown().nullable(),
  newValues: z.unknown().nullable(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  sessionId: z.uuid().nullable(),
  actionPerformedAt: z.custom<ColumnType<Date, string>>(),
  createdAt: z.custom<ColumnType<Date, string | undefined, never>>().optional(),
})

// Table interface for Kysely
export type IAuditLog = z.infer<typeof AuditLogSchema>

// Kysely types for operations
export type AuditLog = Selectable<IAuditLog>
export type AuditLogInsert = Insertable<IAuditLog>
export type AuditLogUpdate = Updateable<IAuditLog>
