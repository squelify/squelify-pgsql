import { useSeoMeta } from '@unhead/react'
import * as Lucide from 'lucide-react'
import * as React from 'react'
import { clx } from 'twistail-utils'
import { Button } from '#/components/button'
import { SplitPane, useSplitPane } from '#/components/split-pane'

// Constant for localStorage key
const PANEL_VISIBILITY_KEY = 'table-editor-panel-visible'
const BOTTOM_PANEL_VISIBILITY_KEY = 'table-editor-bottom-panel-visible'

// Helper for getting panel visibility from localStorage
const getStoredPanelVisibility = (): boolean => {
  try {
    const stored = localStorage.getItem(PANEL_VISIBILITY_KEY)
    return stored === null ? true : stored === 'true'
  } catch (_) {
    return true
  }
}

const setStoredPanelVisibility = (isVisible: boolean): void => {
  try {
    localStorage.setItem(PANEL_VISIBILITY_KEY, isVisible.toString())
  } catch (e) {
    console.warn('Failed to store panel visibility', e)
  }
}

// Helper for getting bottom panel visibility from localStorage
const getStoredBottomPanelVisibility = (): boolean => {
  try {
    const stored = localStorage.getItem(BOTTOM_PANEL_VISIBILITY_KEY)
    return stored === null ? true : stored === 'true'
  } catch (_) {
    return true
  }
}

const setStoredBottomPanelVisibility = (isVisible: boolean): void => {
  try {
    localStorage.setItem(BOTTOM_PANEL_VISIBILITY_KEY, isVisible.toString())
  } catch (e) {
    console.warn('Failed to store bottom panel visibility', e)
  }
}

export default function Page() {
  useSeoMeta({ title: 'Table Editor' })

  // Initialize with stored values
  const [isPanelVisible, setIsPanelVisible] = React.useState(() => getStoredPanelVisibility())
  const [isBottomPanelVisible, setIsBottomPanelVisible] = React.useState(() =>
    getStoredBottomPanelVisibility()
  )
  const [lastLeftPanelWidth, setLastLeftPanelWidth] = React.useState(250)
  const [lastBottomPanelHeight, setLastBottomPanelHeight] = React.useState(200)

  // Left panel resizable state
  const {
    isDragging: isLeftPanelDragging,
    position: leftPanelWidth,
    separatorProps: leftPanelSeparatorProps,
    setPosition: setLeftPanelWidth,
  } = useSplitPane({
    orientation: 'horizontal',
    initial: 250,
    min: 240,
    max: 350,
    id: 'table-editor-left-panel',
    onResizeEnd: ({ position }) => {
      if (position > 0) {
        setLastLeftPanelWidth(position)
      }
    },
  })

  // Bottom panel resizable state
  const {
    isDragging: isBottomPanelDragging,
    position: bottomPanelHeight,
    separatorProps: bottomPanelSeparatorProps,
    setPosition: setBottomPanelHeight,
  } = useSplitPane({
    orientation: 'vertical',
    initial: 200,
    min: 100,
    reverse: true,
    id: 'table-editor-bottom-panel',
    onResizeEnd: ({ position }) => {
      if (position > 0) {
        setLastBottomPanelHeight(position)
      }
    },
  })

  // Toggle left panel visibility and persist the state
  const toggleLeftPanel = React.useCallback(() => {
    setIsPanelVisible((prev) => {
      const newValue = !prev
      setStoredPanelVisibility(newValue)
      return newValue
    })
  }, [])

  // Toggle bottom panel visibility and persist the state
  const toggleBottomPanel = React.useCallback(() => {
    setIsBottomPanelVisible((prev) => {
      const newValue = !prev
      setStoredBottomPanelVisibility(newValue)
      return newValue
    })
  }, [])

  // Effect to handle left panel visibility
  React.useEffect(() => {
    if (!isPanelVisible) {
      setLeftPanelWidth(0)
    } else {
      setLeftPanelWidth(lastLeftPanelWidth)
    }
  }, [isPanelVisible, setLeftPanelWidth, lastLeftPanelWidth])

  // Effect to handle bottom panel visibility
  React.useEffect(() => {
    if (!isBottomPanelVisible) {
      setBottomPanelHeight(0)
    } else {
      setBottomPanelHeight(lastBottomPanelHeight)
    }
  }, [isBottomPanelVisible, setBottomPanelHeight, lastBottomPanelHeight])

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Left Panel - Always rendered but with width 0 when hidden */}
      <div
        className={clx(
          'shrink-0 bg-sidebar transition-all duration-200',
          isLeftPanelDragging && 'transition-none',
          !isPanelVisible && 'opacity-0'
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
      {isPanelVisible && (
        <SplitPane.Separator
          {...leftPanelSeparatorProps}
          isDragging={isLeftPanelDragging}
          orientation="horizontal"
        />
      )}

      {/* Right Side (Main Content + Bottom Panel) */}
      <div className="flex h-full flex-1 flex-col">
        {/* Top Panel - Takes full height when bottom panel is hidden */}
        <div
          className={clx('overflow-auto bg-background', isBottomPanelVisible ? 'flex-1' : 'h-full')}
        >
          <div className="h-full p-6">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="font-bold text-2xl">Table Editor - Top Panel</h1>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={toggleLeftPanel}>
                  {isPanelVisible ? (
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
                {isPanelVisible ? 'Left panel is visible.' : 'Left panel is hidden.'}{' '}
                {isBottomPanelVisible ? 'Bottom panel is visible.' : 'Bottom panel is hidden.'}
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

        {/* Bottom Panel - Only rendered when visible */}
        {isBottomPanelVisible && (
          <div
            className={clx(
              'shrink-0 bg-background transition-all duration-200',
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
                  Bottom content area. You can resize this panel by dragging the separator above.
                  This panel can be fully collapsed or expanded.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
