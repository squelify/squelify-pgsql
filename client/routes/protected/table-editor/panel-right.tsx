import * as Lucide from 'lucide-react'
import { Button } from '#/components/button'
import EmptyState from '#/components/empty-state'

interface RightPanelProps {
  toggleLeftPanel: () => void
  isLeftPanelVisible: boolean
}

export function RightPanel({ toggleLeftPanel, isLeftPanelVisible }: RightPanelProps) {
  return (
    <div className="size-full overflow-auto bg-background">
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 items-center justify-between border-border border-b px-1.5 py-1">
          <div className="flex w-full items-center">
            <Button
              size="icon"
              variant="outline"
              className="mr-1.5 mb-0.5 size-8"
              onClick={toggleLeftPanel}
            >
              {isLeftPanelVisible ? (
                <>
                  <Lucide.PanelLeftClose className="size-4" />
                  <span className="sr-only">Hide Left Panel</span>
                </>
              ) : (
                <>
                  <Lucide.PanelLeftOpen className="size-4" />
                  <span className="sr-only">Show Left Panel</span>
                </>
              )}
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-1">
          <EmptyState
            icon={Lucide.Table2}
            className="mx-auto flex min-h-full w-full items-center justify-center py-44 sm:py-56 md:py-0"
          />
        </div>
      </div>
    </div>
  )
}
