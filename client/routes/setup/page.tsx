import { useSeoMeta } from '@unhead/react'
import { consola } from 'consola'
import { useQueryState } from 'nuqs'
import { useEffect, useState, useTransition } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/card'
import Link from '#/components/link'
import { toast } from '#/components/toast'

import SetupForm from './setup-form'
import { AlreadyInstalledStatus, ErrorStatus, LoadingStatus, SuccessStatus } from './setup-status'
import DemoTokens from './token-demo'
import {
  AdminUserData,
  createAdminUserApi,
  validateSetupToken,
  validateSetupTokenApi,
} from './use-setup'

export default function Page() {
  useSeoMeta({ title: 'Initial Setup - Squelify' })

  const [isPending, startTransition] = useTransition()
  const [token, setToken] = useQueryState('token')

  const [isSuccess, setIsSuccess] = useState(false)
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null)
  const [isInstalled, setIsInstalled] = useState<boolean | null>(null)
  const [tokenError, setTokenError] = useState<string | null>(null)

  // Validate token on component mount
  useEffect(() => {
    // Validate token format
    const tokenValidation = validateSetupToken(token)

    if (!tokenValidation.isValid) {
      setIsTokenValid(false)
      setTokenError(tokenValidation.errorMessage || 'Invalid setup token')
      return
    }

    // Validate token with API
    startTransition(async () => {
      try {
        if (token) {
          const result = await validateSetupTokenApi(token)

          if (result.isValid) {
            setIsTokenValid(true)
            setIsInstalled(result.isInstalled)

            if (result.isInstalled) {
              setTokenError(result.message || 'Application is already set up')
            }
          } else {
            setIsTokenValid(false)
            setTokenError(result.message || 'Invalid setup token')
          }
        }
      } catch (error) {
        setIsTokenValid(false)
        setTokenError('An error occurred while validating your setup token')
        consola.error('Token validation error:', error)
      }
    })
  }, [token])

  // Handle form submission
  const handleSetup = async (userData: AdminUserData) => {
    if (!token) {
      throw new Error('Invalid setup token')
    }

    return new Promise<void>((resolve, reject) => {
      startTransition(async () => {
        try {
          const result = await createAdminUserApi(token, userData)

          if (result.success) {
            setIsSuccess(true)
            toast.success(result.message)
            resolve()
          } else {
            toast.error(result.message)
            reject(new Error(result.message))
          }
        } catch (error) {
          // Handle unexpected errors
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred. Please try again.'

          toast.error(errorMessage)
          consola.error('Setup error:', error)
          reject(new Error(errorMessage))
        }
      })
    })
  }

  // Render different states
  const renderContent = () => {
    // Loading state
    if (isTokenValid === null) {
      return <LoadingStatus />
    }

    // Invalid token state
    if (isTokenValid === false) {
      return <ErrorStatus message={tokenError || 'Invalid setup token'} />
    }

    // Already installed state
    if (isInstalled === true) {
      return <AlreadyInstalledStatus message={tokenError || 'Application is already set up'} />
    }

    // Success state
    if (isSuccess) {
      return <SuccessStatus />
    }

    // Setup form
    return <SetupForm token={token} onSubmit={handleSetup} isLoading={isPending} />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-6">
      <div className="w-full max-w-lg">
        <Card className="debug">
          <CardHeader className="pb-2">
            <CardTitle>Initial Setup</CardTitle>
            <CardDescription>Create your admin account to get started</CardDescription>
          </CardHeader>

          <CardContent className="pt-4">{renderContent()}</CardContent>

          {!isSuccess && isTokenValid && !isInstalled && (
            <CardFooter className="flex items-center justify-center border-t p-4">
              <p className="text-muted-foreground text-xs">
                By completing the setup, you agree to our{' '}
                <Link href="#" className="underline hover:no-underline" newTab>
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="#" className="underline hover:no-underline" newTab>
                  Privacy Policy
                </Link>
              </p>
            </CardFooter>
          )}
        </Card>

        {!isTokenValid && !isSuccess && <DemoTokens setToken={setToken} />}
      </div>
    </div>
  )
}
