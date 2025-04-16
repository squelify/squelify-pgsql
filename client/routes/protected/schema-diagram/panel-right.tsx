import * as Lucide from 'lucide-react'
import { Button } from '#/components/button'

interface RightPanelProps {
  toggleLeftPanel: () => void
  isLeftPanelVisible: boolean
}

export function RightPanel({ toggleLeftPanel, isLeftPanelVisible }: RightPanelProps) {
  return (
    <div className="size-full overflow-auto bg-background">
      <div className="h-full p-0">
        <div className="flex items-center justify-between border-border border-b p-1">
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
        <div className="h-max w-full p-1">Content</div>
      </div>
    </div>
  )
}
