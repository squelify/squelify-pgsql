import { useRef, useState } from 'react'
import { z } from 'zod'
import { Checkbox } from '#/components/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormSubmit,
  FormValidityState,
} from '#/components/form'
import { Input } from '#/components/input'
import { SetupSchema } from '~/orpc/schemas/setup.schema'

interface SetupFormProps {
  token: string | null
  onSubmit: (userData: Omit<z.infer<typeof SetupSchema>, 'token'>) => Promise<void>
  isLoading: boolean
}

export default function SetupForm({ onSubmit, isLoading }: SetupFormProps) {
  const [formError, setFormError] = useState<string | null>(null)
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    subscribeToNewsletter: false,
  })

  const inputRefs = {
    firstName: useRef<HTMLInputElement>(null),
    lastName: useRef<HTMLInputElement>(null),
    username: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    password: useRef<HTMLInputElement>(null),
    passwordConfirm: useRef<HTMLInputElement>(null),
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormValues((prev) => ({
      ...prev,
      subscribeToNewsletter: checked,
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)

    const {
      firstName,
      lastName,
      username,
      email,
      password,
      passwordConfirm,
      subscribeToNewsletter,
    } = formValues

    // Simple frontend validation (schema will validate on backend)
    if (!firstName || !lastName || !email || !username || !password || !passwordConfirm) {
      setFormError('All fields are required')
      return
    }
    if (password !== passwordConfirm) {
      setFormError('Password confirmation does not match')
      return
    }

    try {
      await onSubmit({
        firstName,
        lastName,
        email,
        username,
        password,
        passwordConfirm,
        subscribeToNewsletter,
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

      <Form onSubmit={handleSubmit} autoComplete="off">
        <div className="flex gap-4">
          <FormField name="firstName" className="flex-1">
            <FormLabel>First Name</FormLabel>
            <FormControl asChild>
              <Input
                ref={inputRefs.firstName}
                name="firstName"
                value={formValues.firstName}
                onChange={handleChange}
                placeholder="First Name"
                disabled={isLoading}
                required
                minLength={1}
                maxLength={64}
                autoComplete="given-name"
              />
            </FormControl>
            <FormValidityState name="firstName">
              {(validity) => (
                <div className="font-medium text-xs">
                  {validity?.valueMissing && (
                    <p className="text-destructive">First name is required</p>
                  )}
                  {validity?.tooLong && (
                    <p className="text-destructive">
                      First name must be a maximum of 64 characters
                    </p>
                  )}
                  {validity?.valid && <p className="text-success">First name is valid</p>}
                </div>
              )}
            </FormValidityState>
          </FormField>

          <FormField name="lastName" className="flex-1">
            <FormLabel>Last Name</FormLabel>
            <FormControl asChild>
              <Input
                ref={inputRefs.lastName}
                name="lastName"
                value={formValues.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                disabled={isLoading}
                required
                minLength={1}
                maxLength={64}
                autoComplete="family-name"
              />
            </FormControl>
            <FormValidityState name="lastName">
              {(validity) => (
                <div className="font-medium text-xs">
                  {validity?.valueMissing && (
                    <p className="text-destructive">Last name is required</p>
                  )}
                  {validity?.tooLong && (
                    <p className="text-destructive">Last name must be a maximum of 64 characters</p>
                  )}
                  {validity?.valid && <p className="text-success">Last name is valid</p>}
                </div>
              )}
            </FormValidityState>
          </FormField>
        </div>

        <FormField name="username">
          <FormLabel>Username</FormLabel>
          <FormControl asChild>
            <Input
              ref={inputRefs.username}
              name="username"
              value={formValues.username}
              onChange={handleChange}
              placeholder="admin"
              disabled={isLoading}
              required
              minLength={3}
              maxLength={32}
              pattern="^[a-zA-Z0-9_]+$"
              autoComplete="username"
            />
          </FormControl>
          <FormValidityState name="username">
            {(validity) => (
              <div className="font-medium text-xs">
                {validity?.valueMissing && <p className="text-destructive">Username is required</p>}
                {validity?.tooShort && (
                  <p className="text-destructive">Username must be at least 3 characters</p>
                )}
                {validity?.tooLong && (
                  <p className="text-destructive">Username must be a maximum of 32 characters</p>
                )}
                {validity?.patternMismatch && (
                  <p className="text-destructive">
                    Usernames may only contain letters, numbers and underscores
                  </p>
                )}
                {validity?.valid && <p className="text-success">Username is valid</p>}
              </div>
            )}
          </FormValidityState>
        </FormField>

        <FormField name="email">
          <FormLabel>Email</FormLabel>
          <FormControl asChild>
            <Input
              type="email"
              ref={inputRefs.email}
              name="email"
              value={formValues.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              disabled={isLoading}
              required
              autoComplete="email"
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
          <FormLabel>Password</FormLabel>
          <FormControl asChild>
            <Input
              type="password"
              ref={inputRefs.password}
              name="password"
              value={formValues.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={isLoading}
              minLength={8}
              maxLength={128}
              required
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$"
              autoComplete="new-password"
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

        <FormField name="passwordConfirm">
          <FormLabel>Confirm Password</FormLabel>
          <FormControl asChild>
            <Input
              type="password"
              ref={inputRefs.passwordConfirm}
              name="passwordConfirm"
              value={formValues.passwordConfirm}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={isLoading}
              minLength={8}
              maxLength={128}
              required
              autoComplete="new-password"
            />
          </FormControl>
          <FormMessage
            name="passwordConfirm"
            match={(value, allValues) => value !== allValues.get('password')}
          >
            Password confirmation does not match
          </FormMessage>
          <FormValidityState name="passwordConfirm">
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
          <Checkbox
            id="subscribeToNewsletter"
            name="subscribeToNewsletter"
            checked={formValues.subscribeToNewsletter}
            onCheckedChange={handleCheckboxChange}
            disabled={isLoading}
          />
          <label htmlFor="subscribeToNewsletter" className="font-medium text-sm">
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
