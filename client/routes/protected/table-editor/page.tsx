import { useSeoMeta } from '@unhead/react'
import * as React from 'react'
import { SplitPane } from '#/components/split-pane'

export default function Page() {
  useSeoMeta({ title: 'Table Editor' })

  const containerRef = React.useRef<HTMLDivElement>(null)

  return (
    <div className="size-full p-0" ref={containerRef}>
      <SplitPane
        min={200}
        max={350}
        initial={250}
        orientation="horizontal"
        containerRef={containerRef as React.RefObject<HTMLElement>}
        onResizeStart={(args) => console.table(args)}
        onResizeEnd={(args) => console.table(args)}
      >
        {({ position: x, separatorProps, isDragging }) => (
          <>
            {/* Left Panel */}
            <SplitPane.Panel position="first" className="bg-sidebar" style={{ width: `${x}px` }}>
              <div className="p-4">
                <h2 className="mb-4 font-semibold text-lg">Navigation Panel</h2>
                <div className="space-y-2">
                  <div className="rounded bg-white p-2 shadow dark:bg-slate-700">Item 1</div>
                  <div className="rounded bg-white p-2 shadow dark:bg-slate-700">Item 2</div>
                  <div className="rounded bg-white p-2 shadow dark:bg-slate-700">Item 3</div>
                </div>
              </div>
            </SplitPane.Panel>

            {/* Separator */}
            <SplitPane.Separator {...separatorProps} isDragging={isDragging} />

            {/* Right Panel */}
            <SplitPane.Panel position="last" className="bg-background">
              <div className="size-full p-6">
                <h1 className="mb-6 font-bold text-2xl">Table Editor</h1>
                <div className="rounded-lg bg-slate-50 p-4 shadow dark:bg-slate-800">
                  <p className="text-slate-600 dark:text-slate-300">Main</p>
                </div>
              </div>
            </SplitPane.Panel>
          </>
        )}
      </SplitPane>
    </div>
  )
}
