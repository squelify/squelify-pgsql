import * as React from 'react'
import { SplitPane } from '#/components/split-pane'
import { PanelBottom } from './panel-bottom'
import { PanelTop } from './panel-top'

// Default panel size constants
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

interface RightPanelProps {
  toggleLeftPanel: () => void
  isLeftPanelVisible: boolean
}

export function RightPanel({ toggleLeftPanel, isLeftPanelVisible }: RightPanelProps) {
  // State to store the last panel size before hiding
  const [lastBottomPanelHeight, setLastBottomPanelHeight] = React.useState(
    DEFAULT_BOTTOM_PANEL_HEIGHT
  )

  return (
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
              <PanelTop
                toggleLeftPanel={toggleLeftPanel}
                toggleBottomPanel={toggleBottomPanel}
                isLeftPanelVisible={isLeftPanelVisible}
                isBottomPanelVisible={isBottomPanelVisible}
              />

              {isBottomPanelVisible && (
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
  )
}
