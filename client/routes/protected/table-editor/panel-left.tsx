import * as Lucide from 'lucide-react'
import * as React from 'react'
import { clx } from 'twistail-utils'
import { SplitPane } from '#/components/split-pane'

interface LeftPanelProps {
  position: number
  isDragging: boolean
  separatorProps: React.HTMLAttributes<HTMLDivElement>
  isVisible: boolean
  toggleVisibility: () => void
  setPosition: (position: number) => void
}

export function LeftPanel({
  position: leftPanelWidth,
  isDragging: isLeftPanelDragging,
  separatorProps: leftPanelSeparatorProps,
  isVisible: isPanelVisible,
  toggleVisibility: toggleLeftVisibility,
  setPosition: setLeftPanelWidth,
}: LeftPanelProps) {
  // Determine if the panel is actually visible based on width
  const isLeftPanelVisible = leftPanelWidth > 0

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
    </>
  )
}
