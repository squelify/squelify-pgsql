import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { useSeoMeta } from '@unhead/react'
import { consola } from 'consola'
import { useQueryState } from 'nuqs'
import { useState } from 'react'
import { z } from 'zod'
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
import { orpc } from '#/utils/orpc'
import { SetupSchema } from '~/orpc/schemas/setup.schema'
import pkg from '~~/package.json' with { type: 'json' }
import SetupForm from './setup-form'
import { AlreadyInstalledStatus, ErrorStatus, LoadingStatus, SuccessStatus } from './setup-status'

export default function Page() {
  useSeoMeta({ title: 'Initial Setup - Squelify' })

  const [token] = useQueryState('token')
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    data: tokenData,
    isLoading: isTokenLoading,
    error: tokenError,
  } = useSuspenseQuery(
    orpc.setup.validateToken.queryOptions({
      input: { token: token || '' },
      enabled: !!token,
    })
  )

  const { mutateAsync, isPending } = useMutation(orpc.setup.execute.mutationOptions())

  // Handle form submit
  const handleSetup = async (userData: Omit<z.infer<typeof SetupSchema>, 'token'>) => {
    await mutateAsync({ ...userData, token: token || '' })
      .then(() => {
        setIsSuccess(true)
        toast.success('Admin account created successfully!')
      })
      .catch((error: any) => {
        toast.error(error?.message || 'Setup failed')
        consola.error('Setup error:', error)
      })
  }

  // Render different states
  const renderContent = () => {
    if (!token) {
      return <ErrorStatus message="Setup token is required in the URL." />
    }
    if (isTokenLoading || isPending) {
      return <LoadingStatus />
    }
    if (tokenError) {
      return <ErrorStatus message="Failed to validate setup token. Please try again." />
    }
    if (tokenData?.valid === false) {
      return <ErrorStatus message={tokenData?.message || 'Invalid setup token.'} />
    }
    if (tokenData?.isInstalled) {
      return (
        <AlreadyInstalledStatus message={tokenData?.message || 'Application is already set up.'} />
      )
    }
    if (isSuccess) {
      return <SuccessStatus />
    }
    return <SetupForm token={token} onSubmit={handleSetup} isLoading={isPending} />
  }

  // Show footer only if not successful, token is valid, and not installed
  const showFooter = !isSuccess && tokenData?.valid !== false && !tokenData?.isInstalled

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-6">
      <div className="w-full max-w-lg">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Initial Setup</CardTitle>
            <CardDescription>Create your admin account to get started</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">{renderContent()}</CardContent>
          {showFooter && (
            <CardFooter className="flex items-center justify-center border-t p-4">
              <p className="text-muted-foreground text-xs">
                By subscribing, you agree to our{' '}
                <Link
                  href={`${pkg.homepage}/terms-of-use`}
                  className="underline hover:no-underline"
                  newTab
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href={`${pkg.homepage}/privacy-policy`}
                  className="underline hover:no-underline"
                  newTab
                >
                  Privacy Policy
                </Link>
              </p>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}
