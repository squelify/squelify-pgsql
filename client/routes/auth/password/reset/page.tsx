import { consola } from 'consola'
import * as Lucide from 'lucide-react'
import { useEffect, useRef, useState, useTransition } from 'react'
import { Card, CardContent, CardDescription } from '#/components/card'
import { CardFooter, CardHeader, CardTitle } from '#/components/card'
import { Form, FormControl, FormField, FormSubmit } from '#/components/form'
import { FormLabel, FormMessage } from '#/components/form'
import { Input } from '#/components/input'
import Link from '#/components/link'
import { toast } from '#/components/toast'

import { resetPasswordApi, validatePassword, validateResetTokenApi } from './use-reset-password'
import { extractTokenFromUrl, isValidUUID, validateToken } from './use-validator'

export default function Page() {
  const [isPending, startTransition] = useTransition()
  const passwordRef = useRef<HTMLInputElement>(null)
  const confirmPasswordRef = useRef<HTMLInputElement>(null)

  const [token, setToken] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null)
  const [tokenError, setTokenError] = useState<string | null>(null)

  // Validate token on component mount
  useEffect(() => {
    const resetToken = extractTokenFromUrl()
    setToken(resetToken)

    // Validate token format
    const tokenValidation = validateToken(resetToken)

    if (!tokenValidation.isValid) {
      setIsTokenValid(false)
      setTokenError(tokenValidation.errorMessage || 'Invalid reset token')
      return
    }

    // Validate token with API
    startTransition(async () => {
      try {
        if (resetToken) {
          const result = await validateResetTokenApi(resetToken)

          if (result.isValid && result.email) {
            setIsTokenValid(true)
            setEmail(result.email)
          } else {
            setIsTokenValid(false)
            setTokenError(result.message || 'Invalid reset token')
          }
        }
      } catch (error) {
        setIsTokenValid(false)
        setTokenError('An error occurred while validating your reset token')
        consola.error('Token validation error:', error)
      }
    })
  }, [])

  // Form submission handler
  async function handleResetPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    if (!token || !isValidUUID(token)) {
      setFormError('Invalid reset token')
      return
    }

    const formData = new FormData(event.currentTarget)
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    // Validate passwords
    const passwordValidation = validatePassword(password, confirmPassword)

    if (!passwordValidation.isValid) {
      setFormError(passwordValidation.errorMessage || 'Password validation failed')
      return
    }

    // Use startTransition to mark this as a non-urgent update
    startTransition(async () => {
      try {
        const result = await resetPasswordApi(token, password)

        if (result.success) {
          setIsSuccess(true)
          toast.success(result.message)
        } else {
          setFormError(result.message)
          toast.error(result.message)
        }
      } catch (error) {
        // Handle unexpected errors
        const errorMessage =
          error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.'

        setFormError(errorMessage)
        toast.error(errorMessage)
        consola.error('Reset password error:', error)
      }
    })
  }

  // Render different states
  const renderContent = () => {
    // Loading state
    if (isTokenValid === null) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <Lucide.Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground text-sm">Validating your reset token...</p>
        </div>
      )
    }

    // Invalid token state
    if (isTokenValid === false) {
      return (
        <div className="space-y-4 py-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <Lucide.XCircle className="h-6 w-6 text-destructive" />
          </div>
          <h3 className="font-medium text-lg">Invalid Reset Link</h3>
          <p className="text-muted-foreground text-sm">{tokenError}</p>
          <div className="pt-2">
            <Link
              href="/forgot-password"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm hover:bg-primary/90"
            >
              Request New Reset Link
            </Link>
          </div>
        </div>
      )
    }

    // Success state
    if (isSuccess) {
      return (
        <div className="space-y-4 py-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
            <Lucide.CheckCircle className="h-6 w-6 text-success" />
          </div>
          <h3 className="font-medium text-lg">Password Reset Successful</h3>
          <p className="text-muted-foreground text-sm">
            Your password has been successfully reset. You can now log in with your new password.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm hover:bg-primary/90"
            >
              Go to Login
            </Link>
          </div>
        </div>
      )
    }

    // Reset password form
    return (
      <Form onSubmit={handleResetPassword} className="space-y-6">
        {email && (
          <div className="rounded-md bg-muted p-3 text-sm">
            <p>
              <span className="font-medium">Reset password for:</span> {email}
            </p>
          </div>
        )}

        <FormField name="password">
          <FormLabel>New Password</FormLabel>
          <FormControl asChild>
            <Input
              type="password"
              ref={passwordRef}
              placeholder="••••••••"
              required
              minLength={8}
              autoFocus
            />
          </FormControl>
          <FormMessage match="valueMissing">Please enter a new password</FormMessage>
          <FormMessage match="tooShort">Password must be at least 8 characters</FormMessage>
        </FormField>

        <FormField name="confirmPassword">
          <FormLabel>Confirm New Password</FormLabel>
          <FormControl asChild>
            <Input type="password" ref={confirmPasswordRef} placeholder="••••••••" required />
          </FormControl>
          <FormMessage match="valueMissing">Please confirm your new password</FormMessage>
        </FormField>

        <div className="text-muted-foreground text-xs">
          <p>Password must contain:</p>
          <ul className="mt-1 list-disc space-y-1 pl-4">
            <li>At least 8 characters</li>
            <li>At least one uppercase letter</li>
            <li>At least one lowercase letter</li>
            <li>At least one number</li>
            <li>At least one special character</li>
          </ul>
        </div>

        <FormSubmit className="w-full" disabled={isPending} isLoading={isPending}>
          {isPending ? 'Resetting Password...' : 'Reset Password'}
        </FormSubmit>
      </Form>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-background/80 p-6">
      <div className="w-full max-w-sm">
        {formError && (
          <div className="mb-4 rounded-md bg-destructive/10 p-3 text-destructive text-sm">
            {formError}
          </div>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>Create a new password for your account</CardDescription>
          </CardHeader>

          <CardContent className="pt-4">{renderContent()}</CardContent>

          {!isSuccess && isTokenValid && (
            <CardFooter className="flex items-center justify-center border-t p-4 sm:justify-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center text-muted-foreground text-sm hover:text-primary"
              >
                <Lucide.ArrowLeft className="mr-1 inline-block size-4" />
                <span>Back to login</span>
              </Link>
            </CardFooter>
          )}
        </Card>

        {!isTokenValid && !isSuccess && (
          <div className="mt-4 text-center text-muted-foreground text-xs">
            <p>Demo valid tokens:</p>
            <code className="mt-1 block rounded bg-muted p-1">
              ?token=123e4567-e89b-12d3-a456-426614174000
            </code>
            <code className="mt-1 block rounded bg-muted p-1">
              ?token=123e4567-e89b-12d3-a456-426614174001
            </code>
            <p className="mt-2">Demo expired token:</p>
            <code className="mt-1 block rounded bg-muted p-1">
              ?token=123e4567-e89b-12d3-a456-426614174002
            </code>
          </div>
        )}
      </div>
    </div>
  )
}
