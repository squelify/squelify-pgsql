import { useSeoMeta } from '@unhead/react'
import { ReactFlowProvider } from '@xyflow/react'
import * as Lucide from 'lucide-react'
import { useState } from 'react'
import { Button } from '#/components/button'
import { Skeleton } from '#/components/skeleton/skeleton'
import Diagram from './diagram'
// import { EmptyState } from './empty-state'

export default function Page() {
  useSeoMeta({ title: 'Schema Diagram' })

  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading state (remove after API integration)
  setTimeout(() => setIsLoading(false), 800)

  return (
    <div className="flex size-full flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="flex items-center justify-between border-b px-4 py-2 md:hidden">
        <h1 className="font-semibold text-lg">Schema Diagram</h1>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-label="Toggle settings menu"
        >
          <Lucide.Menu className="size-5" />
        </Button>
      </div>

      {/* Container */}
      <div className="flex-1 overflow-auto">
        <div className="h-full">
          {isLoading ? (
            <div className="p-4 md:p-6">
              <Skeleton className="mb-2 h-8 w-48" />
              <Skeleton className="mb-6 h-4 w-72" />
              <div className="grid gap-4">
                <Skeleton className="h-32 w-full rounded-md" />
                <Skeleton className="h-32 w-full rounded-md" />
              </div>
            </div>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center">
              {/* <EmptyState /> */}
              <ReactFlowProvider>
                <Diagram />
              </ReactFlowProvider>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
