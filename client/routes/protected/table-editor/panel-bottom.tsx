import * as Lucide from 'lucide-react'
import * as React from 'react'
import { clx } from 'twistail-utils'
import { SplitPane } from '#/components/split-pane'

interface PanelBottomProps {
  height: number
  isDragging: boolean
  separatorProps: React.HTMLAttributes<HTMLDivElement>
}

export function PanelBottom({ height, isDragging, separatorProps }: PanelBottomProps) {
  return (
    <>
      {/* Bottom Panel Separator */}
      <SplitPane.Separator {...separatorProps} isDragging={isDragging} orientation="vertical" />

      {/* Bottom Panel Content */}
      <div
        className={clx('shrink-0 bg-background', isDragging && 'transition-none')}
        style={{ height: `${height}px` }}
      >
        <div className="h-full overflow-y-auto p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-xl">Bottom Panel</h2>
            <Lucide.PanelBottom size={18} className="text-muted-foreground" />
          </div>
          <div className="h-[calc(100%-3rem)] rounded-lg bg-slate-100 p-4 shadow dark:bg-slate-700">
            <p className="text-slate-600 dark:text-slate-300">
              Bottom content area. You can resize this panel by dragging the separator above. This
              panel can be fully collapsed or expanded.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
