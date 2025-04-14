import * as Lucide from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4 md:p-6 dark:bg-zinc-900">
      <div className="mx-auto w-full max-w-2xl">
        {/* Header with status code */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex" />
          <div className="flex items-center rounded-md bg-zinc-100 px-3 py-1 font-mono text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            <span className="mr-2">Status</span>
            <span className="font-semibold text-amber-500">404</span>
          </div>
        </div>

        {/* Main content */}
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
          <div className="p-6">
            {/* Icon and Title */}
            <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="mx-auto flex-shrink-0 sm:mx-0">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
                  <Lucide.FileQuestion className="h-8 w-8 text-amber-500" />
                </div>
              </div>

              <div className="flex-grow text-center sm:text-left">
                <h1 className="font-medium text-xl tracking-tight">Page Not Found</h1>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                  The page you're looking for doesn't exist or has been moved.
                </p>
              </div>
            </div>

            {/* Error Details */}
            <div className="mb-6 w-full overflow-hidden rounded-md border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900/50">
              <div className="p-4">
                <div className="mb-2 flex items-center gap-2 font-mono text-sm">
                  <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-xs text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
                    GET
                  </span>
                  <span className="font-semibold text-amber-500 dark:text-amber-400">
                    {location.pathname}
                  </span>
                </div>
                <p className="font-mono text-sm text-zinc-700 dark:text-zinc-300">
                  The requested URL was not found on this server.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              {hasPreviousPage && (
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="inline-flex flex-1 cursor-pointer items-center justify-center rounded-md border border-zinc-200 bg-white px-4 py-2 text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  <Lucide.ArrowLeft className="mr-2 size-4" />
                  <span>Go Back</span>
                </button>
              )}
              <button
                type="button"
                className="inline-flex flex-1 cursor-pointer items-center justify-center rounded-md bg-amber-500 px-4 py-2 text-white transition-colors hover:bg-amber-600 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                onClick={() => navigate('/')}
              >
                <Lucide.Home className="mr-2 size-4" />
                <span>Go Back</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 text-center text-xs text-zinc-500 dark:text-zinc-400">
          &copy; {new Date().getFullYear()} Squelify
        </div>
      </div>
    </div>
  )
}
