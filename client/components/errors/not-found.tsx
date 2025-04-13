import * as Lucide from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Button } from '#/components/button'

export function NotFound() {
  const navigate = useNavigate()
  const location = useLocation()
  const [hasPreviousPage, setHasPreviousPage] = useState(false)

  // Check if there's a previous page in history
  useEffect(() => {
    // window.history.length > 1 means there's at least one previous page
    // but we also need to check if we're not coming from an external site
    setHasPreviousPage(
      window.history.length > 1 && document.referrer.includes(window.location.host)
    )
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-background/80 p-6">
      <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
        <div className="absolute h-full w-full animate-ping rounded-full bg-amber-500/20" />
        <div
          className="absolute h-full w-full animate-pulse rounded-full bg-amber-500/30"
          style={{ animationDelay: '0.2s' }}
        />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 backdrop-blur-sm">
          <Lucide.FileQuestion className="h-8 w-8 text-amber-500" />
        </div>
      </div>

      <h1 className="mb-2 text-center font-bold text-3xl tracking-tight">Page Not Found</h1>
      <p className="mb-8 max-w-md text-center text-muted-foreground">
        The page you're looking for doesn't exist or has been moved to another location.
      </p>

      <div className="mb-8 w-full max-w-lg overflow-hidden rounded-lg border bg-card/50 backdrop-blur-sm">
        <div className="border-b bg-muted/50 px-4 py-2">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="ml-2 font-medium text-muted-foreground text-xs">404 Not Found</span>
          </div>
        </div>
        <div className="p-4">
          <p className="font-mono text-sm">
            <span className="text-muted-foreground">GET</span>{' '}
            <span className="text-amber-500">{location.pathname}</span>
          </p>
          <p className="mt-2 font-mono text-muted-foreground text-sm">
            The requested URL was not found on this server.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        {hasPreviousPage && (
          <Button
            variant="outline"
            className="group relative overflow-hidden px-6 transition-all hover:bg-transparent hover:text-primary hover:shadow-md"
            onClick={() => navigate(-1)}
          >
            <span className="absolute inset-0 z-0 bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />
            <Lucide.ArrowLeft className="mr-2 size-4" />
            <span className="relative z-10">Go Back</span>
          </Button>
        )}

        <Button
          className="group relative overflow-hidden px-6 transition-all hover:shadow-md"
          onClick={() => navigate('/')}
        >
          <span className="absolute inset-0 z-0 bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />
          <Lucide.Home className="mr-2 size-4" />
          <span className="relative z-10">Back to Home</span>
        </Button>
      </div>
    </div>
  )
}
