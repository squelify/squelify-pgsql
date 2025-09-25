import { useSeoMeta } from '@unhead/react'
import { consola } from 'consola'
import * as Lucide from 'lucide-react'
import { useRef, useState, useTransition } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/card'
import { Form, FormControl, FormField, FormLabel, FormMessage, FormSubmit } from '#/components/form'
import { Input } from '#/components/input'
import Link from '#/components/link'
import { toast } from '#/components/toast'

import { forgotPasswordApi, isValidEmail } from './use-forgot-password'

export default function Page() {
  useSeoMeta({ title: 'Forgot Password' })

  const [isPending, startTransition] = useTransition()
  const emailRef = useRef<HTMLInputElement>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  // Form submission handler
  async function handleForgotPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string

    // Basic validation
    if (!email) {
      setFormError('Please enter your email address')
      return
    }

    if (!isValidEmail(email)) {
      setFormError('Please enter a valid email address')
      emailRef.current?.focus()
      return
    }

    // Use startTransition to mark this as a non-urgent update
    startTransition(async () => {
      try {
        const result = await forgotPasswordApi(email)

        if (result.success) {
          setIsSuccess(true)
          toast.success(result.message)
        } else {
          setFormError(result.message)
          toast.error(result.message)
          emailRef.current?.focus()
        }
      } catch (error) {
        // Handle unexpected errors
        const errorMessage =
          error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.'

        setFormError(errorMessage)
        toast.error(errorMessage)
        consola.error('Forgot password error:', error)
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
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Enter your email address and we&apos;ll send you instructions to reset your password
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          {isSuccess ? (
            <div className="space-y-6 py-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                <Lucide.CheckCircle className="h-6 w-6 text-success" />
              </div>
              <h3 className="font-medium text-lg">Check your email</h3>
              <p className="text-muted-foreground text-sm">
                We&apos;ve sent password reset instructions to your email address. Please check your
                inbox.
              </p>
            </div>
          ) : (
            <Form onSubmit={handleForgotPassword} className="space-y-6">
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

              <FormSubmit className="w-full" disabled={isPending} isLoading={isPending}>
                {isPending ? 'Sending...' : 'Send Reset Instructions'}
              </FormSubmit>
            </Form>
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-center border-t p-4 sm:justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center text-muted-foreground text-sm hover:text-primary"
          >
            <Lucide.ArrowLeft className="mr-1 inline-block size-4" />
            <span>Back to login</span>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
