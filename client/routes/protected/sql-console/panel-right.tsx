import * as Lucide from 'lucide-react'
import * as React from 'react'
import { Button } from '#/components/button'
import { SplitPane } from '#/components/split-pane'
import { PanelBottom } from './panel-bottom'
import { PanelTop } from './panel-top'

// Default panel size constants
const DEFAULT_BOTTOM_PANEL_HEIGHT = 450
const STORAGE_PREFIX = 'splitpane-position-'

// Helper function to update localStorage directly
const updateStoredPanelSize = (id: string, size: number): void => {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${id}`, size.toString())
  } catch (e) {
    console.warn('Failed to update panel size in localStorage:', e)
  }
}

interface RightPanelProps {
  toggleLeftPanel: () => void
  isLeftPanelVisible: boolean
}

export function RightPanel({ toggleLeftPanel, isLeftPanelVisible }: RightPanelProps) {
  // State to store the last panel size before hiding
  const [lastBottomPanelHeight, setLastBottomPanelHeight] = React.useState(
    DEFAULT_BOTTOM_PANEL_HEIGHT
  )

  // State to track bottom panel visibility for status bar
  const [isBottomPanelVisible, setIsBottomPanelVisible] = React.useState(true)

  // Refs to store SplitPane functions
  const toggleBottomPanelRef = React.useRef<() => void>(() => {})

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="flex h-[calc(100%-40px)] flex-col">
        {/* Reserving 40px for status bar */}
        <SplitPane
          orientation="vertical"
          id="sql-console-bottom-panel"
          initial={DEFAULT_BOTTOM_PANEL_HEIGHT}
          min={0}
          reverse={true}
          persistVisibility={true}
          visibilityKey="sql-console-bottom-panel-visible"
          initialVisible={true}
        >
          {({
            position: bottomPanelHeight,
            isDragging: isBottomPanelDragging,
            separatorProps: bottomPanelSeparatorProps,
            isVisible: isBottomVisible,
            toggleVisibility: toggleBottomVisibility,
            setPosition: setBottomPanelHeight,
          }) => {
            // Determine if the bottom panel is actually visible based on height
            const currentBottomPanelVisible = bottomPanelHeight > 0

            // Update state when visibility changes
            React.useEffect(() => {
              setIsBottomPanelVisible(currentBottomPanelVisible)
            }, [currentBottomPanelVisible])

            // Toggle function for bottom panel that maintains persistent state
            const toggleBottomPanel = React.useCallback(() => {
              if (currentBottomPanelVisible) {
                // If panel is visible, save current height and hide
                if (bottomPanelHeight > 0) {
                  setLastBottomPanelHeight(bottomPanelHeight)
                }

                // First update the visibility state if needed
                if (isBottomVisible) {
                  toggleBottomVisibility()
                }

                // Then update the position
                setBottomPanelHeight(0)
                updateStoredPanelSize('sql-console-bottom-panel', 0)
                setIsBottomPanelVisible(false)
              } else {
                // Calculate the height to restore - use last height or default
                const heightToRestore = lastBottomPanelHeight || DEFAULT_BOTTOM_PANEL_HEIGHT

                // First update the visibility state if needed
                if (!isBottomVisible) {
                  toggleBottomVisibility()
                }

                // Use setTimeout to ensure visibility state is updated first
                // This helps avoid the need for double-clicking
                setTimeout(() => {
                  // Then update the position
                  setBottomPanelHeight(heightToRestore)
                  updateStoredPanelSize('sql-console-bottom-panel', heightToRestore)
                  setIsBottomPanelVisible(true)
                }, 0)
              }
            }, [
              currentBottomPanelVisible,
              bottomPanelHeight,
              setBottomPanelHeight,
              isBottomVisible,
              toggleBottomVisibility,
            ])

            // Store the toggle function in ref for external access
            toggleBottomPanelRef.current = toggleBottomPanel

            // Effect to save last panel height when resized
            React.useEffect(() => {
              if (bottomPanelHeight > 0 && !isBottomPanelDragging) {
                setLastBottomPanelHeight(bottomPanelHeight)
              }
            }, [bottomPanelHeight, isBottomPanelDragging])

            return (
              <>
                <PanelTop
                  toggleLeftPanel={toggleLeftPanel}
                  isLeftPanelVisible={isLeftPanelVisible}
                  isBottomPanelVisible={currentBottomPanelVisible}
                />
                {currentBottomPanelVisible && (
                  <PanelBottom
                    height={bottomPanelHeight}
                    isDragging={isBottomPanelDragging}
                    separatorProps={bottomPanelSeparatorProps}
                  />
                )}
              </>
            )
          }}
        </SplitPane>
      </div>
      {/* Status Bar */}
      <div className="sticky bottom-0 flex h-10 items-center gap-2 border-border border-t bg-sidebar px-2 py-1.5">
        <Button
          size="icon"
          variant="ghost"
          className="size-6"
          onClick={() => toggleBottomPanelRef.current()}
          title={isBottomPanelVisible ? 'Hide Bottom Panel' : 'Show Bottom Panel'}
        >
          {isBottomPanelVisible ? (
            <>
              <Lucide.PanelBottomClose className="size-4" />
              <span className="sr-only">Hide Bottom Panel</span>
            </>
          ) : (
            <>
              <Lucide.PanelBottomOpen className="size-4" />
              <span className="sr-only">Show Bottom Panel</span>
            </>
          )}
        </Button>

        <div className="mr-1 ml-0.5 hidden h-5 w-px bg-border sm:block" />

        {/* DataGrid Pagination */}
        <div className="flex flex-wrap gap-4">
          <div className="-space-x-px isolate flex">
            <Button size="xs" variant="outline" className="rounded-r-none">
              <Lucide.ChevronsLeft className="size-3.5" />
              <span className="sr-only">First</span>
            </Button>
            <Button size="xs" variant="outline" className="rounded-r-none">
              <Lucide.ChevronLeft className="size-3.5" />
              <span className="sr-only">Prev</span>
            </Button>
            <span className="flex h-7 w-auto items-center justify-center border bg-background px-4 text-center text-sm">
              10
            </span>
            <Button size="xs" variant="outline" className="rounded-r-none">
              <span className="sr-only">Next</span>
              <Lucide.ChevronRight className="size-3.5" />
            </Button>
            <Button size="xs" variant="outline" className="rounded-r-none">
              <span className="sr-only">Last</span>
              <Lucide.ChevronsRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
