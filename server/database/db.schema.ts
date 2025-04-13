/**
 * For Kysely's type-safety and autocompletion to work, it needs to know
 * your database structure. This requires a TypeScript Database interface,
 * that contains table names as keys and table schema interfaces as values.
 *
 * @see: https://www.kysely.dev/docs/recipes/schemas
 */

import type { IUser } from './schemas/user'

export interface Database {
  users: IUser
}
