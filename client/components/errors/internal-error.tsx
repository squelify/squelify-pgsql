import * as Lucide from 'lucide-react'
import { useNavigate } from 'react-router'

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4 md:p-6 dark:bg-zinc-900">
      <div className="mx-auto w-full max-w-2xl">
        {/* Header with status code */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex" />
          <div className="flex items-center rounded-md bg-zinc-100 px-3 py-1 font-mono text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            <span className="mr-2">Status</span>
            <span className="font-semibold text-red-500">500</span>
          </div>
        </div>

        {/* Main content */}
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
          <div className="p-6">
            {/* Icon and Title */}
            <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="mx-auto flex-shrink-0 sm:mx-0">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                  <Lucide.ServerCrash className="h-8 w-8 text-red-500" />
                </div>
              </div>

              <div className="flex-grow text-center sm:text-left">
                <h1 className="font-medium text-xl tracking-tight">Something went wrong</h1>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                  We've been notified and are working to fix the issue.
                </p>
              </div>
            </div>

            {/* Error Details (only in development) */}
            {error && import.meta.env.DEV && (
              <div className="mb-6 w-full overflow-hidden rounded-md border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900/50">
                <div className="flex items-center justify-between border-zinc-200 border-b px-4 py-2 dark:border-zinc-700">
                  <span className="font-medium text-xs text-zinc-700 dark:text-zinc-300">
                    Error Details
                  </span>
                  <button
                    type="button"
                    className="flex cursor-pointer items-center font-medium text-xs text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                    onClick={() => {
                      const errorMessage = `${error.name}: ${error.message}\n\n${error.stack || ''}`
                      navigator.clipboard.writeText(errorMessage)
                    }}
                  >
                    <Lucide.Clipboard className="mr-1 h-3 w-3" />
                    <span>Copy</span>
                  </button>
                </div>
                <div className="p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded bg-red-100 px-1.5 py-0.5 font-medium text-red-600 text-xs dark:bg-red-900/30 dark:text-red-400">
                      {error.name}
                    </span>
                    <span className="font-mono text-red-500 text-sm dark:text-red-400">
                      {error.message}
                    </span>
                  </div>
                  {error.stack && (
                    <pre className="scrollbar-thin max-h-[400px] overflow-auto rounded border border-zinc-200 bg-white p-4 font-mono text-sm text-zinc-700 leading-relaxed dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      {error.stack}
                    </pre>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="inline-flex flex-1 items-center justify-center rounded-md border border-zinc-200 bg-white px-4 py-2 text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                onClick={() => navigate('/')}
              >
                <Lucide.ArrowLeft className="mr-2 size-4" />
                <span>Go Back</span>
              </button>
              <button
                type="button"
                className="inline-flex flex-1 items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                onClick={handleTryAgain}
              >
                <Lucide.RefreshCw className="mr-2 size-4" />
                <span>Try Again</span>
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
