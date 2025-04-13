import * as Lucide from 'lucide-react'
import { useNavigate } from 'react-router'
import { Button } from '#/components/button'

interface InternalErrorProps {
  error?: Error
  reset?: () => void
}

export function InternalError({ error, reset }: InternalErrorProps) {
  const navigate = useNavigate()

  const handleTryAgain = () => {
    if (reset) {
      reset()
    } else {
      navigate(0)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-background/80 p-6">
      <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
        <div className="absolute h-full w-full animate-ping rounded-full bg-red-500/20" />
        <div
          className="absolute h-full w-full animate-pulse rounded-full bg-red-500/30"
          style={{ animationDelay: '0.2s' }}
        />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 backdrop-blur-sm">
          <Lucide.ServerCrash className="h-8 w-8 text-red-500" />
        </div>
      </div>

      <h1 className="mb-2 text-center font-bold text-3xl tracking-tight">
        Oops! Something went wrong
      </h1>
      <p className="mb-8 max-w-md text-center text-muted-foreground">
        Our server is taking a quick break. We've been notified and are working to fix the issue.
      </p>

      {error && import.meta.env.DEV && (
        <div className="mb-8 w-full max-w-lg overflow-hidden rounded-lg border bg-card/50 backdrop-blur-sm">
          <div className="border-b bg-muted/50 px-4 py-2">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="ml-2 font-medium text-muted-foreground text-xs">Error Details</span>
            </div>
          </div>
          <div className="p-4">
            <p className="mb-2 font-medium font-mono text-red-500 text-sm">
              {error.name}: {error.message}
            </p>
            {error.stack && (
              <pre className="scrollbar-thin max-h-40 overflow-auto rounded bg-muted/50 p-2 text-muted-foreground text-xs">
                {error.stack}
              </pre>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button
          variant="outline"
          className="group relative overflow-hidden px-6 transition-all hover:bg-transparent hover:text-primary hover:shadow-md"
          onClick={() => navigate('/')}
        >
          <span className="absolute inset-0 z-0 bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />
          <Lucide.Home className="mr-2 size-4" />
          <span className="relative z-10">Back to Home</span>
        </Button>

        <Button
          className="group relative overflow-hidden px-6 transition-all hover:shadow-md"
          onClick={handleTryAgain}
        >
          <span className="absolute inset-0 z-0 bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />
          <Lucide.RefreshCw className="mr-2 size-4 transition-transform group-hover:rotate-180" />
          <span className="relative z-10">Try Again</span>
        </Button>
      </div>
    </div>
  )
}
