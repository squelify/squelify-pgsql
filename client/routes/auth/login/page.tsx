import { useSeoMeta } from '@unhead/react'
import { consola } from 'consola'
import { useRef, useState, useTransition } from 'react'
import { useNavigate } from 'react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/card'
import { Checkbox } from '#/components/checkbox'
import { Form, FormControl, FormField, FormLabel, FormMessage, FormSubmit } from '#/components/form'
import { Input } from '#/components/input'
import Link from '#/components/link'
import { toast } from '#/components/toast'

import { getRedirectPath, loginApi, storeUserData } from './use-login'

export default function Page() {
  useSeoMeta({ title: 'Sign In' })

  const navigate = useNavigate()
  const [isPending, startTransition] = useTransition()
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const [formError, setFormError] = useState<string | null>(null)

  // Form submission handler
  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const rememberMe = formData.get('rememberMe') === 'on'

    // Basic validation
    if (!email || !password) {
      setFormError('Please fill in all required fields')
      return
    }

    // Use startTransition to mark this as a non-urgent update
    startTransition(async () => {
      try {
        const result = await loginApi(email, password)

        // Handle success case
        if (result.success && result.user) {
          const userData = storeUserData(result.user, rememberMe)
          toast.success(`Welcome back, ${userData?.name || 'User'}!`)
          navigate(getRedirectPath(result.user.role))
          return
        }

        // Handle failure case
        setFormError(result.message || 'Login failed. Please try again.')
        toast.error(result.message || 'Login failed')
        passwordRef.current?.select()
      } catch (error) {
        // Handle unexpected errors
        const errorMessage =
          error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.'

        setFormError(errorMessage)
        toast.error(errorMessage)
        consola.error('Login error:', error)
      }
    })
  }

  return (
    <div className="w-full max-w-sm">
      {formError && (
        <div className="mb-4 rounded-md bg-destructive/10 p-3 text-destructive text-sm">
          {formError}
        </div>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Sign in to Squelify</CardTitle>
          <CardDescription>Enter your credentials to continue</CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          <Form onSubmit={handleLogin} className="space-y-6">
            <FormField name="email">
              <FormLabel>Email Address</FormLabel>
              <FormControl asChild>
                <Input
                  type="email"
                  ref={emailRef}
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                  autoFocus
                />
              </FormControl>
              <FormMessage match="valueMissing">Please enter your email</FormMessage>
              <FormMessage match="typeMismatch">Please provide a valid email</FormMessage>
            </FormField>

            <FormField name="password">
              <div className="flex items-center justify-between">
                <FormLabel htmlFor="password">Password</FormLabel>
                <Link
                  href="/forgot-password"
                  className="text-muted-foreground text-xs hover:text-primary"
                >
                  Forgot password?
                </Link>
              </div>
              <FormControl asChild>
                <Input
                  type="password"
                  ref={passwordRef}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  minLength={6}
                  required
                />
              </FormControl>
              <FormMessage match="valueMissing">Please enter your password</FormMessage>
            </FormField>

            <div className="flex items-center space-x-2">
              <Checkbox id="rememberMe" name="rememberMe" disabled={isPending} />
              <label htmlFor="rememberMe" className="font-normal text-sm">
                Remember me for 30 days
              </label>
            </div>

            <FormSubmit className="w-full" disabled={isPending} isLoading={isPending}>
              {isPending ? 'Signing in...' : 'Sign In'}
            </FormSubmit>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
