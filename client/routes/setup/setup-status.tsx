import * as Lucide from 'lucide-react'
import Link from '#/components/link'

interface LoadingStatusProps {
  message?: string
}

export function LoadingStatus({ message = 'Validating setup token...' }: LoadingStatusProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Lucide.Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground text-sm">{message}</p>
    </div>
  )
}

interface ErrorStatusProps {
  title?: string
  message: string
}

export function ErrorStatus({ title = 'Invalid Setup Link', message }: ErrorStatusProps) {
  return (
    <div className="space-y-4 py-4 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
        <Lucide.XCircle className="h-6 w-6 text-destructive" />
      </div>
      <h3 className="font-medium text-lg">{title}</h3>
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  )
}

interface AlreadyInstalledStatusProps {
  message: string
}

export function AlreadyInstalledStatus({ message }: AlreadyInstalledStatusProps) {
  return (
    <div className="space-y-4 py-4 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
        <Lucide.AlertCircle className="h-6 w-6 text-warning" />
      </div>
      <h3 className="font-medium text-lg">Already Set Up</h3>
      <p className="text-muted-foreground text-sm">{message}</p>
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

export function SuccessStatus() {
  return (
    <div className="space-y-4 py-4 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
        <Lucide.CheckCircle className="h-6 w-6 text-success" />
      </div>
      <h3 className="font-medium text-lg">Setup Completed</h3>
      <p className="text-muted-foreground text-sm">
        Your admin account has been created successfully. <br />
        You can now log in with your credentials.
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
