import { Panel } from '@xyflow/react'
import { FC } from 'react'
import { Button } from '#/components/button'

interface ControlPanelProps {
  showMiniMap: boolean
  setShowMiniMap: (show: boolean) => void
  applyAutoLayout: () => void
}

const ControlPanel: FC<ControlPanelProps> = ({ showMiniMap, setShowMiniMap, applyAutoLayout }) => {
  return (
    <Panel
      position="top-left"
      className="flex flex-col gap-2 rounded-md border border-border bg-card px-2.5 py-2 text-card-foreground text-sm"
    >
      <div className="flex flex-col gap-2">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={showMiniMap}
            onChange={() => setShowMiniMap(!showMiniMap)}
            className="m-0"
          />
          Show Mini Map
        </label>
        <Button type="button" variant="secondary" size="xs" onClick={applyAutoLayout}>
          Auto Layout
        </Button>
      </div>
    </Panel>
  )
}

export default ControlPanel
