import { oc } from '@orpc/contract'
import { z } from 'zod'

export const SetupSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { error: 'First name is required' })
      .max(64, { error: 'First name must be a maximum of 64 characters' }),
    lastName: z
      .string()
      .min(1, { error: 'Last name is required' })
      .max(64, { error: 'Last name must be a maximum of 64 characters' }),
    email: z.email({ error: 'Invalid email address' }),
    username: z
      .string()
      .min(3, { error: 'Username must be at least 3 characters' })
      .max(32, { error: 'Username must be a maximum of 32 characters' })
      .regex(/^[a-zA-Z0-9_]+$/, {
        error: 'Usernames may only contain letters, numbers and underscores',
      })
      .nullable(),
    password: z
      .string()
      .min(8, { error: 'Password must be at least 8 characters' })
      .max(128, { error: 'Password must be a maximum of 128 characters' })
      .regex(/[A-Z]/, { error: 'Password must contain at least one uppercase letter' })
      .regex(/[a-z]/, { error: 'Password must contain at least one lowercase letter' })
      .regex(/[0-9]/, { error: 'Password must contain at least one number' })
      .regex(/[^A-Za-z0-9]/, { error: 'Password must contain at least one special character' }),
    passwordConfirm: z
      .string()
      .min(8)
      .max(128)
      .regex(/[A-Z]/)
      .regex(/[a-z]/)
      .regex(/[0-9]/)
      .regex(/[^A-Za-z0-9]/),
    subscribeToNewsletter: z.boolean().optional().default(false),
    token: z.string().min(1, { error: 'Setup token is required' }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Password confirmation does not match',
  })

export const processSetupContract = oc
  .input(SetupSchema)
  .output(SetupSchema.omit({ passwordConfirm: true, token: true }))

export const validateTokenContract = oc
  .input(z.object({ token: z.string().min(1, { error: 'Setup token is required' }) }))
  .output(
    z.object({
      valid: z.boolean(),
      isInstalled: z.boolean(),
      message: z.string().optional(),
    })
  )

export const setupContract = {
  execute: processSetupContract,
  validateToken: validateTokenContract,
}
