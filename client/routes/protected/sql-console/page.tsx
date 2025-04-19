import { useStore } from '@nanostores/react'
import { useSeoMeta } from '@unhead/react'
import * as React from 'react'
import { SplitPane } from '#/components/split-pane'
import { defaultUIStoreValues, saveUiState, uiStore } from '#/context/stores/ui.store'
import { LeftPanel } from './panel-left'
import { RightPanel } from './panel-right'

export default function Page() {
  useSeoMeta({ title: 'SQL Console' })

  const uiState = useStore(uiStore)

  // State to store the last panel size before hiding
  const DEFAULT_LEFT_PANEL_WIDTH = defaultUIStoreValues['sql-console'].left.position
  const [lastLeftPanelWidth, setLastLeftPanelWidth] = React.useState(DEFAULT_LEFT_PANEL_WIDTH)

  return (
    <div className="absolute inset-0 flex w-full overflow-hidden">
      <SplitPane
        orientation="horizontal"
        initial={DEFAULT_LEFT_PANEL_WIDTH}
        min={0}
        max={350}
        id="sql-console-left-panel"
        persistVisibility={true}
        visibilityKey="sql-console-panel-visible"
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
              saveUiState('sql-console', {
                left: { position: 0, visible: false },
              })
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
                saveUiState('sql-console', {
                  left: { position: widthToRestore, visible: true },
                })
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
              <LeftPanel
                position={leftPanelWidth}
                isDragging={isLeftPanelDragging}
                separatorProps={leftPanelSeparatorProps}
                isVisible={isPanelVisible}
                toggleVisibility={toggleLeftVisibility}
                setPosition={setLeftPanelWidth}
              />
              <RightPanel
                toggleLeftPanel={toggleLeftPanel}
                isLeftPanelVisible={isLeftPanelVisible}
              />
            </>
          )
        }}
      </SplitPane>
    </div>
  )
}
