import { Panel, PanelProps, useReactFlow, useStore } from '@xyflow/react'
import { forwardRef, useCallback } from 'react'
import { clx } from 'twistail-utils'
import { Listbox, ListboxItem, ListboxValue } from '#/components/listbox'
import { ListboxContent, ListboxTrigger } from '#/components/listbox'

export const ZoomSelect = forwardRef<HTMLDivElement, Omit<PanelProps, 'children'>>(
  ({ className, ...props }, ref) => {
    const { zoomTo, fitView } = useReactFlow()

    const handleZoomChange = useCallback(
      (value: string) => {
        if (value === 'best-fit') {
          fitView()
        } else {
          const zoomValue = Number.parseFloat(value)
          if (!Number.isNaN(zoomValue)) {
            zoomTo(zoomValue)
          }
        }
      },
      [fitView, zoomTo]
    )

    const zoomLevels = useStore((state) => {
      const { minZoom, maxZoom } = state
      const levels = []
      const zoomIncrement = 50

      for (let i = Math.ceil(minZoom * 100); i <= Math.floor(maxZoom * 100); i += zoomIncrement) {
        levels.push((i / 100).toString())
      }

      return levels
    })

    return (
      <Panel
        ref={ref}
        className={clx('flex bg-primary-foreground text-foreground', className)}
        {...props}
      >
        <Listbox onValueChange={handleZoomChange}>
          <ListboxTrigger className="w-[140px] bg-primary-foreground">
            <ListboxValue placeholder="Zoom" />
          </ListboxTrigger>
          <ListboxContent>
            <ListboxItem value="best-fit">Best Fit</ListboxItem>
            <div className="mx-2 my-1 border-t" />
            {zoomLevels.map((level) => (
              <ListboxItem key={level} value={level}>
                {`${(Number.parseFloat(level) * 100).toFixed(0)}%`}
              </ListboxItem>
            ))}
          </ListboxContent>
        </Listbox>
      </Panel>
    )
  }
)

ZoomSelect.displayName = 'ZoomSelect'
