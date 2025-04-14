import { useSeoMeta } from '@unhead/react'
import * as Lucide from 'lucide-react'
import * as React from 'react'
import { clx } from 'twistail-utils'
import { Button } from '#/components/button'
import { SplitPane } from '#/components/split-pane'

// Default panel size constants
const DEFAULT_LEFT_PANEL_WIDTH = 250
const DEFAULT_BOTTOM_PANEL_HEIGHT = 350
const STORAGE_PREFIX = 'splitpane-position-'

// Helper function to update localStorage directly
const updateStoredPanelSize = (id: string, size: number): void => {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${id}`, size.toString())
  } catch (e) {
    console.warn('Failed to update panel size in localStorage:', e)
  }
}

export default function Page() {
  useSeoMeta({ title: 'Table Editor' })

  // State to store the last panel size before hiding
  const [lastLeftPanelWidth, setLastLeftPanelWidth] = React.useState(DEFAULT_LEFT_PANEL_WIDTH)
  const [lastBottomPanelHeight, setLastBottomPanelHeight] = React.useState(
    DEFAULT_BOTTOM_PANEL_HEIGHT
  )

  return (
    <div className="flex h-full w-full overflow-hidden">
      <SplitPane
        orientation="horizontal"
        initial={DEFAULT_LEFT_PANEL_WIDTH}
        min={0}
        max={350}
        id="table-editor-left-panel"
        persistVisibility={true}
        visibilityKey="table-editor-panel-visible"
        initialVisible={true}
      >
        {({
          position: leftPanelWidth,
          isDragging: isLeftPanelDragging,
          separatorProps: leftPanelSeparatorProps,
          isVisible: isPanelVisible,
          toggleVisibility: toggleLeftVisibility,
          setPosition: setLeftPanelWidth,
        }) => {
          // Determine if the panel is actually visible based on width
          const isLeftPanelVisible = leftPanelWidth > 0

          // Toggle function for left panel that maintains persistent state
          const toggleLeftPanel = React.useCallback(() => {
            if (isLeftPanelVisible) {
              // If panel is visible, save current width and hide
              if (leftPanelWidth > 0) {
                setLastLeftPanelWidth(leftPanelWidth)
              }

              // First update the visibility state if needed
              if (isPanelVisible) {
                toggleLeftVisibility()
              }

              // Then update the position
              setLeftPanelWidth(0)
              updateStoredPanelSize('table-editor-left-panel', 0)
            } else {
              // Calculate the width to restore - use last width or default
              const widthToRestore = lastLeftPanelWidth || DEFAULT_LEFT_PANEL_WIDTH

              // First update the visibility state if needed
              if (!isPanelVisible) {
                toggleLeftVisibility()
              }

              // Use setTimeout to ensure visibility state is updated first
              // This helps avoid the need for double-clicking
              setTimeout(() => {
                // Then update the position
                setLeftPanelWidth(widthToRestore)
                updateStoredPanelSize('table-editor-left-panel', widthToRestore)
              }, 0)
            }
          }, [
            isLeftPanelVisible,
            leftPanelWidth,
            setLeftPanelWidth,
            isPanelVisible,
            toggleLeftVisibility,
          ])

          // Effect to save last panel width when resized
          React.useEffect(() => {
            if (leftPanelWidth > 0 && !isLeftPanelDragging) {
              setLastLeftPanelWidth(leftPanelWidth)
            }
          }, [leftPanelWidth, isLeftPanelDragging])

          return (
            <>
              {/* Left Panel - Always rendered but with width 0 when hidden */}
              <div
                className={clx(
                  'shrink-0 bg-sidebar transition-all duration-200 ease-in-out',
                  isLeftPanelDragging && 'transition-none',
                  !isLeftPanelVisible && 'opacity-0'
                )}
                style={{ width: `${leftPanelWidth}px` }}
              >
                <div className="h-full overflow-y-auto p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-semibold text-lg">Navigation Panel</h2>
                    <Lucide.PanelLeft size={18} className="text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <div className="rounded bg-white p-2 shadow dark:bg-slate-700">Item 1</div>
                    <div className="rounded bg-white p-2 shadow dark:bg-slate-700">Item 2</div>
                    <div className="rounded bg-white p-2 shadow dark:bg-slate-700">Item 3</div>
                  </div>
                </div>
              </div>

              {/* Left Panel Separator */}
              {isLeftPanelVisible && (
                <SplitPane.Separator
                  {...leftPanelSeparatorProps}
                  isDragging={isLeftPanelDragging}
                  orientation="horizontal"
                />
              )}

              {/* Right Side (Main Content + Bottom Panel) */}
              <div className="flex h-full flex-1 flex-col">
                <SplitPane
                  orientation="vertical"
                  initial={DEFAULT_BOTTOM_PANEL_HEIGHT}
                  min={0}
                  reverse={true}
                  id="table-editor-bottom-panel"
                  persistVisibility={true}
                  visibilityKey="table-editor-bottom-panel-visible"
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
                    const isBottomPanelVisible = bottomPanelHeight > 0

                    // Toggle function for bottom panel that maintains persistent state
                    const toggleBottomPanel = React.useCallback(() => {
                      if (isBottomPanelVisible) {
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
                        updateStoredPanelSize('table-editor-bottom-panel', 0)
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
                          updateStoredPanelSize('table-editor-bottom-panel', heightToRestore)
                        }, 0)
                      }
                    }, [
                      isBottomPanelVisible,
                      bottomPanelHeight,
                      setBottomPanelHeight,
                      isBottomVisible,
                      toggleBottomVisibility,
                    ])

                    // Effect to save last panel height when resized
                    React.useEffect(() => {
                      if (bottomPanelHeight > 0 && !isBottomPanelDragging) {
                        setLastBottomPanelHeight(bottomPanelHeight)
                      }
                    }, [bottomPanelHeight, isBottomPanelDragging])

                    return (
                      <>
                        {/* Top Panel - Takes full height when bottom panel is hidden */}
                        <div
                          className={clx(
                            'overflow-auto bg-background',
                            isBottomPanelVisible ? 'flex-1' : 'h-full'
                          )}
                        >
                          <div className="h-full p-6">
                            <div className="mb-6 flex items-center justify-between">
                              <h1 className="font-bold text-2xl">Table Editor - Top Panel</h1>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm" onClick={toggleLeftPanel}>
                                  {isLeftPanelVisible ? (
                                    <>
                                      <Lucide.PanelLeftClose className="mr-2 h-4 w-4" />
                                      Hide Left Panel
                                    </>
                                  ) : (
                                    <>
                                      <Lucide.PanelLeftOpen className="mr-2 h-4 w-4" />
                                      Show Left Panel
                                    </>
                                  )}
                                </Button>
                                <Button variant="outline" size="sm" onClick={toggleBottomPanel}>
                                  {isBottomPanelVisible ? (
                                    <>
                                      <Lucide.PanelBottom className="mr-2 h-4 w-4" />
                                      Hide Bottom Panel
                                    </>
                                  ) : (
                                    <>
                                      <Lucide.PanelBottomOpen className="mr-2 h-4 w-4" />
                                      Show Bottom Panel
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                            <div className="h-auto rounded-lg bg-slate-50 p-4 shadow dark:bg-slate-800">
                              <p className="text-slate-600 dark:text-slate-300">
                                Top content area.{' '}
                                {isLeftPanelVisible
                                  ? 'Left panel is visible.'
                                  : 'Left panel is hidden.'}{' '}
                                {isBottomPanelVisible
                                  ? 'Bottom panel is visible.'
                                  : 'Bottom panel is hidden.'}
                              </p>
                              <div className="mt-4">
                                <p>This panel will take full height when bottom panel is hidden.</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Panel Separator - Only shown when bottom panel is visible */}
                        {isBottomPanelVisible && (
                          <SplitPane.Separator
                            {...bottomPanelSeparatorProps}
                            isDragging={isBottomPanelDragging}
                            orientation="vertical"
                          />
                        )}

                        {/* Bottom Panel - Only rendered when visible, no animations */}
                        {isBottomPanelVisible && (
                          <div
                            className={clx(
                              'shrink-0 bg-background',
                              isBottomPanelDragging && 'transition-none'
                            )}
                            style={{ height: `${bottomPanelHeight}px` }}
                          >
                            <div className="h-full overflow-y-auto p-6">
                              <div className="mb-4 flex items-center justify-between">
                                <h2 className="font-semibold text-xl">Bottom Panel</h2>
                                <Lucide.PanelBottom size={18} className="text-muted-foreground" />
                              </div>
                              <div className="h-[calc(100%-3rem)] rounded-lg bg-slate-100 p-4 shadow dark:bg-slate-700">
                                <p className="text-slate-600 dark:text-slate-300">
                                  Bottom content area. You can resize this panel by dragging the
                                  separator above. This panel can be fully collapsed or expanded.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )
                  }}
                </SplitPane>
              </div>
            </>
          )
        }}
      </SplitPane>
    </div>
  )
}
