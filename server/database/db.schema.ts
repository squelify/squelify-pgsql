/**
 * For Kysely's type-safety and autocompletion to work, it needs to know
 * your database structure. This requires a TypeScript Database interface,
 * that contains table names as keys and table schema interfaces as values.
 *
 * @see: https://www.kysely.dev/docs/recipes/schemas
 */

import type { IAPIKey } from './schemas/api_key'
import type { IAppSetting } from './schemas/app_setting'
import type { IAuditLog } from './schemas/audit_log'
import type { IOneTimeToken } from './schemas/one_time_token'
import type { IPermission } from './schemas/permission'
import type { IRefreshToken } from './schemas/refresh_token'
import type { IRole } from './schemas/role'
import type { IRolePermission } from './schemas/role_permission'
import type { ISession } from './schemas/session'
import type { IUser } from './schemas/user'
import type { IUserPassword } from './schemas/user_password'
import type { IUserPermission } from './schemas/user_permission'
import type { IUserPhone } from './schemas/user_phone'
import type { IUserRole } from './schemas/user_role'
import type { IWebhook } from './schemas/webhook'

interface Internal {
  'internal.api_keys': IAPIKey
  'internal.app_settings': IAppSetting
  'internal.audit_logs': IAuditLog
  'internal.one_time_tokens': IOneTimeToken
  'internal.permissions': IPermission
  'internal.refresh_tokens': IRefreshToken
  'internal.role_permissions': IRolePermission
  'internal.roles': IRole
  'internal.sessions': ISession
  'internal.user_passwords': IUserPassword
  'internal.user_permissions': IUserPermission
  'internal.user_phones': IUserPhone
  'internal.user_roles': IUserRole
  'internal.users': IUser
  'internal.webhooks': IWebhook
}

export interface Database extends Internal {}
