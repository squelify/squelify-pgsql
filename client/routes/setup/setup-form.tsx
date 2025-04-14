import { useRef, useState } from 'react'
import { Checkbox } from '#/components/checkbox'
import { Form, FormControl, FormField, FormLabel, FormMessage } from '#/components/form'
import { FormSubmit, FormValidityState } from '#/components/form'
import { Input } from '#/components/input'
import { AdminUserData, isValidUUID, validateEmail, validatePassword } from './use-setup'

interface SetupFormProps {
  token: string | null
  onSubmit: (userData: AdminUserData) => Promise<void>
  isLoading: boolean
}

export default function SetupForm({ token, onSubmit, isLoading }: SetupFormProps) {
  const [formError, setFormError] = useState<string | null>(null)

  const inputFirstNameRef = useRef<HTMLInputElement>(null)
  const inputLastNameRef = useRef<HTMLInputElement>(null)
  const inputUsernameRef = useRef<HTMLInputElement>(null)
  const inputEmailRef = useRef<HTMLInputElement>(null)
  const inputPasswordRef = useRef<HTMLInputElement>(null)
  const inputConfirmPasswordRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)

    if (!token || !isValidUUID(token)) {
      setFormError('Invalid setup token')
      return
    }

    const formData = new FormData(event.currentTarget)
    const username = formData.get('username') as string
    const email = formData.get('email') as string
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    const newsletter = formData.get('newsletter') === 'on'

    // Validate email
    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      setFormError(emailValidation.errorMessage || 'Invalid email address')
      return
    }

    // Validate passwords
    const passwordValidation = validatePassword(password, confirmPassword)
    if (!passwordValidation.isValid) {
      setFormError(passwordValidation.errorMessage || 'Password validation failed')
      return
    }

    try {
      await onSubmit({
        username,
        email,
        firstName,
        lastName,
        password,
        newsletter,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      setFormError(errorMessage)
    }
  }

  return (
    <>
      {formError && (
        <div className="mb-4 rounded-md bg-destructive/10 p-3 text-destructive text-sm">
          {formError}
        </div>
      )}

      <Form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <FormField name="firstName">
            <div className="flex items-baseline justify-between">
              <FormLabel>First Name</FormLabel>
            </div>
            <FormControl asChild>
              <Input
                ref={inputFirstNameRef}
                placeholder="John"
                disabled={isLoading}
                required
                autoFocus
              />
            </FormControl>
            <FormValidityState name="firstName">
              {(validity) => (
                <div className="font-medium text-xs">
                  {validity?.valueMissing && (
                    <p className="text-destructive">First name is required</p>
                  )}
                  {validity?.valid && <p className="text-success">First name is valid</p>}
                </div>
              )}
            </FormValidityState>
          </FormField>

          <FormField name="lastName">
            <div className="flex items-baseline justify-between">
              <FormLabel>Last Name</FormLabel>
            </div>
            <FormControl asChild>
              <Input ref={inputLastNameRef} placeholder="Doe" disabled={isLoading} required />
            </FormControl>
            <FormValidityState name="lastName">
              {(validity) => (
                <div className="font-medium text-xs">
                  {validity?.valueMissing && (
                    <p className="text-destructive">Last name is required</p>
                  )}
                  {validity?.valid && <p className="text-success">Last name is valid</p>}
                </div>
              )}
            </FormValidityState>
          </FormField>
        </div>

        <FormField name="username">
          <div className="flex items-baseline justify-between">
            <FormLabel>Username</FormLabel>
          </div>
          <FormControl asChild>
            <Input ref={inputUsernameRef} placeholder="admin" disabled={isLoading} required />
          </FormControl>
          <FormValidityState name="username">
            {(validity) => (
              <div className="font-medium text-xs">
                {validity?.valueMissing && <p className="text-destructive">Username is required</p>}
                {validity?.valid && <p className="text-success">Username is valid</p>}
              </div>
            )}
          </FormValidityState>
        </FormField>

        <FormField name="email">
          <div className="flex items-baseline justify-between">
            <FormLabel>Email</FormLabel>
          </div>
          <FormControl asChild>
            <Input
              type="email"
              ref={inputEmailRef}
              placeholder="admin@example.com"
              disabled={isLoading}
              required
            />
          </FormControl>
          <FormValidityState name="email">
            {(validity) => (
              <div className="font-medium text-xs">
                {validity?.typeMismatch && (
                  <p className="text-destructive">Please enter a valid email address</p>
                )}
                {validity?.valueMissing && <p className="text-destructive">Email is required</p>}
                {validity?.valid && <p className="text-success">Email format is valid</p>}
              </div>
            )}
          </FormValidityState>
        </FormField>

        <FormField name="password">
          <div className="flex items-baseline justify-between">
            <FormLabel>Password</FormLabel>
          </div>
          <FormControl asChild>
            <Input
              type="password"
              ref={inputPasswordRef}
              placeholder="••••••••"
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
              disabled={isLoading}
              minLength={8}
              required
            />
          </FormControl>
          <FormValidityState name="password">
            {(validity) => (
              <div className="font-medium text-xs">
                {validity?.valueMissing && <p className="text-destructive">Password is required</p>}
                {(validity?.tooShort || validity?.patternMismatch) && (
                  <p className="text-destructive">
                    Password must be at least 8 characters, contain uppercase, lowercase, number,
                    and at least one special character
                  </p>
                )}
                {validity?.valid && <p className="text-success">Password meets requirements</p>}
              </div>
            )}
          </FormValidityState>
        </FormField>

        <FormField name="confirmPassword">
          <div className="flex items-baseline justify-between">
            <FormLabel>Confirm Password</FormLabel>
          </div>
          <FormControl asChild>
            <Input
              type="password"
              ref={inputConfirmPasswordRef}
              placeholder="••••••••"
              disabled={isLoading}
              required
            />
          </FormControl>
          <FormMessage
            name="confirmPassword"
            match={(value, formData) => value !== formData.get('password')}
          >
            Passwords do not match
          </FormMessage>
          <FormValidityState name="confirmPassword">
            {(validity) => (
              <div className="font-medium text-xs">
                {validity?.valueMissing && (
                  <p className="text-destructive">Confirm your password</p>
                )}
                {validity?.valid && <p className="text-success">Passwords match</p>}
              </div>
            )}
          </FormValidityState>
        </FormField>

        <div className="flex items-center space-x-2">
          <Checkbox id="newsletter" name="newsletter" disabled={isLoading} />
          <label htmlFor="newsletter" className="font-medium text-sm">
            Subscribe to our newsletter to get the latest updates and news.
          </label>
        </div>

        <FormSubmit className="mt-5 w-full" disabled={isLoading} isLoading={isLoading}>
          {isLoading ? 'Setting Up...' : 'Complete Setup'}
        </FormSubmit>
      </Form>
    </>
  )
}
