import type { BuiltInNode, Node, NodeTypes } from '@xyflow/react'
import { Handle, type NodeProps, Position } from '@xyflow/react'

type PositionLoggerNode = Node<{ label?: string }, 'position-logger'>
type AppNode = BuiltInNode | PositionLoggerNode

function PositionLoggerNode({
  positionAbsoluteX,
  positionAbsoluteY,
  data,
}: NodeProps<PositionLoggerNode>) {
  const _x = `${Math.round(positionAbsoluteX)}px`
  const _y = `${Math.round(positionAbsoluteY)}px`

  return (
    // We add this class to use the same styles as React Flow's default nodes.
    <div className="react-flow__node-default">
      {data.label && <div>{data.label}</div>}

      <div>x y</div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export const initialNodes: AppNode[] = [
  { id: 'a', type: 'input', position: { x: 0, y: 0 }, data: { label: 'wire' } },
  {
    id: 'b',
    type: 'position-logger',
    position: { x: -100, y: 100 },
    data: { label: 'drag me!' },
  },
  { id: 'c', position: { x: 100, y: 100 }, data: { label: 'your ideas' } },
  {
    id: 'd',
    type: 'output',
    position: { x: 0, y: 200 },
    data: { label: 'with React Flow' },
  },
]

export const nodeTypes = {
  'position-logger': PositionLoggerNode,
  // Add any of your custom nodes here!
} satisfies NodeTypes
