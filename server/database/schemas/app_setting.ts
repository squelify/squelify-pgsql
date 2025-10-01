import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'
import { z } from 'zod'

// AppSetting schema with validation rules
export const AppSettingSchema = z.object({
  id: z.custom<Generated<string>>(),
  settingKey: z.string().min(1, { error: 'Setting key is required' }),
  settingValue: z.unknown(), // JSONB, required
  settingCategory: z.string().min(1, { error: 'Setting category is required' }),
  settingDescription: z.string().nullable(),
  isEncryptedSetting: z.boolean().default(false),
  isActiveSetting: z.boolean().default(true),
  createdAt: z.custom<ColumnType<Date, string | undefined, never>>().optional(),
  updatedAt: z.custom<ColumnType<Date, string | undefined, never>>().nullable(),
})

// Table interface for Kysely
export type IAppSetting = z.infer<typeof AppSettingSchema>

// Kysely types for operations
export type AppSetting = Selectable<IAppSetting>
export type AppSettingInsert = Insertable<IAppSetting>
export type AppSettingUpdate = Updateable<IAppSetting>
