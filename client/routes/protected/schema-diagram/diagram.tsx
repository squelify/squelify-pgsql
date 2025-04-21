import '@xyflow/react/dist/style.css'
import { Edge, Position, ReactFlow } from '@xyflow/react'
import { Background, MiniMap, NodeMouseHandler } from '@xyflow/react'
import { memo, useCallback, useState } from 'react'
import { DatabaseSchemaNodeHeader, LabeledHandle, ZoomSelect } from '#/components/reactflow'
import { DatabaseSchemaNode, DatabaseSchemaNodeBody } from '#/components/reactflow'
import { DatabaseSchemaTableCell, DatabaseSchemaTableRow } from '#/components/reactflow'
import { AnimatedSvgEdge } from '#/components/reactflow'
import { toast } from '#/components/toast'
import ControlPanel from './control'
import { schemaEdges } from './use-edges'
import { type DatabaseSchemaNodeData, schemaNodes } from './use-nodes'

const DatabaseSchemaDemo = memo(({ data, selected }: DatabaseSchemaNodeData) => {
  return (
    <DatabaseSchemaNode className="p-0" selected={selected}>
      <DatabaseSchemaNodeHeader>{data.label}</DatabaseSchemaNodeHeader>
      <DatabaseSchemaNodeBody>
        {data.schema.map((entry) => (
          <DatabaseSchemaTableRow key={entry.title}>
            <DatabaseSchemaTableCell className="pr-6 pl-0 font-light">
              <LabeledHandle
                id={entry.title}
                title={entry.title}
                type="target"
                position={Position.Left}
              />
            </DatabaseSchemaTableCell>
            <DatabaseSchemaTableCell className="pr-0 font-thin">
              <LabeledHandle
                id={entry.title}
                title={entry.type}
                type="source"
                position={Position.Right}
                className="p-0"
                handleClassName="p-0"
                labelClassName="p-0 w-full pr-3 text-right"
              />
            </DatabaseSchemaTableCell>
          </DatabaseSchemaTableRow>
        ))}
      </DatabaseSchemaNodeBody>
    </DatabaseSchemaNode>
  )
})

const nodeTypes = { databaseSchema: DatabaseSchemaDemo }

export default function Diagram() {
  const [showMiniMap, setShowMiniMap] = useState(false)
  const [edges, setEdges] = useState(schemaEdges)

  // Handler for mouse enter on node
  const onNodeMouseEnter: NodeMouseHandler = useCallback((_, node) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.source === node.id || edge.target === node.id) {
          // Keep the relationship data and style when animating
          const relationshipData = edge.data?.relationship || 'one-to-one'

          return {
            ...edge,
            type: 'animatedSvgEdge',
            data: {
              duration: 1.5,
              shape: 'circle',
              // Use step for zigzag animation
              path: 'step',
              direction: 'alternate',
              repeat: 'indefinite',
              relationship: relationshipData,
            },
            // Maintain dashed line style during animation and add color
            style: {
              ...edge.style,
              strokeDasharray: '5,5',
              stroke: 'var(--color-primary)',
              strokeWidth: 2,
            },
          }
        }
        return edge
      })
    )
  }, [])

  // Handler for mouse leave on node
  const onNodeMouseLeave: NodeMouseHandler = useCallback(() => {
    setEdges((eds) =>
      eds.map((edge) => {
        // Preserve the relationship data when returning to normal state
        const relationshipData = edge.data?.relationship || 'one-to-one'

        return {
          ...edge,
          // Return to step type to maintain zigzag
          type: 'step',
          data: { relationship: relationshipData },
          // Return to original style
          style: {
            strokeDasharray: '5,5',
            stroke: 'var(--color-muted-foreground)',
            strokeWidth: 2,
          },
        }
      })
    )
  }, [])

  const applyAutoLayout = useCallback(() => {
    toast.warning('This feature is not available yet!')
  }, [])

  const edgeTypes = {
    animatedSvgEdge: AnimatedSvgEdge,
  }

  return (
    <ReactFlow
      defaultViewport={{ x: 0, y: 0, zoom: 1.5 }}
      fitViewOptions={{ maxZoom: 0.8 }}
      defaultNodes={schemaNodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodeMouseEnter={onNodeMouseEnter}
      onNodeMouseLeave={onNodeMouseLeave}
      fitView={true}
      defaultEdgeOptions={{
        type: 'step',
        style: {
          strokeDasharray: '5,5',
          stroke: 'var(--color-muted-foreground)',
          strokeWidth: 2,
        },
      }}
    >
      <Background gap={20} size={1} />
      <ZoomSelect position="bottom-left" />
      {showMiniMap && <MiniMap nodeStrokeWidth={1} />}
      <ControlPanel
        showMiniMap={showMiniMap}
        setShowMiniMap={setShowMiniMap}
        applyAutoLayout={applyAutoLayout}
      />
    </ReactFlow>
  )
}
