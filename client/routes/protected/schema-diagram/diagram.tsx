import '@xyflow/react/dist/style.css'
import { Edge, Position, ReactFlow } from '@xyflow/react'
import { Background, MiniMap, NodeMouseHandler, Panel } from '@xyflow/react'
import { memo, useCallback, useState } from 'react'
import { Button } from '#/components/button'
import { DatabaseSchemaNodeHeader, LabeledHandle, ZoomSelect } from '#/components/reactflow'
import { DatabaseSchemaNode, DatabaseSchemaNodeBody } from '#/components/reactflow'
import { DatabaseSchemaTableCell, DatabaseSchemaTableRow } from '#/components/reactflow'
import { AnimatedSvgEdge } from '#/components/reactflow'

export type DatabaseSchemaNodeData = {
  selected?: boolean
  data: {
    label: string
    schema: { title: string; type: string }[]
  }
}

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

// Define relationship types for better edge positioning
type RelationType = 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many'

// Define edge data with relationship information that satisfies Record<string, unknown>
interface EdgeData extends Record<string, unknown> {
  relationship: RelationType
}

const defaultNodes = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    type: 'databaseSchema',
    data: {
      label: 'products',
      schema: [
        { title: 'id', type: 'uuid' },
        { title: 'name', type: 'varchar' },
        { title: 'description', type: 'varchar' },
        { title: 'warehouse_id', type: 'uuid' },
        { title: 'supplier_id', type: 'uuid' },
        { title: 'price', type: 'money' },
        { title: 'quantity', type: 'int4' },
      ],
    },
  },
  {
    id: '2',
    position: { x: 350, y: -100 },
    type: 'databaseSchema',
    data: {
      label: 'warehouses',
      schema: [
        { title: 'id', type: 'uuid' },
        { title: 'name', type: 'varchar' },
        { title: 'address', type: 'varchar' },
        { title: 'capacity', type: 'int4' },
      ],
    },
  },
  {
    id: '3',
    position: { x: 350, y: 200 },
    type: 'databaseSchema',
    data: {
      label: 'suppliers',
      schema: [
        { title: 'id', type: 'uuid' },
        { title: 'name', type: 'varchar' },
        { title: 'description', type: 'varchar' },
        { title: 'country', type: 'varchar' },
      ],
    },
  },
]

// Using step type for zigzag lines with relationship data
const defaultEdges: Edge<EdgeData>[] = [
  {
    id: 'products-warehouses',
    source: '1',
    target: '2',
    sourceHandle: 'warehouse_id',
    targetHandle: 'id',
    type: 'step',
    data: { relationship: 'many-to-one' },
  },
  {
    id: 'products-suppliers',
    source: '1',
    target: '3',
    sourceHandle: 'supplier_id',
    targetHandle: 'id',
    type: 'step',
    data: { relationship: 'many-to-one' },
  },
]

export default function Diagram() {
  const [showMiniMap, setShowMiniMap] = useState(true)
  const [edges, setEdges] = useState(defaultEdges)

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
            // Maintain dashed line style during animation
            style: {
              ...edge.style,
              strokeDasharray: '5,5',
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
          // Maintain dashed line style
          style: {
            strokeDasharray: '5,5',
            strokeWidth: 2,
          },
        }
      })
    )
  }, [])

  const edgeTypes = {
    animatedSvgEdge: AnimatedSvgEdge,
  }

  return (
    <ReactFlow
      defaultViewport={{ x: 0, y: 0, zoom: 1.5 }}
      fitViewOptions={{ maxZoom: 0.8 }}
      defaultNodes={defaultNodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodeMouseEnter={onNodeMouseEnter}
      onNodeMouseLeave={onNodeMouseLeave}
      fitView={true}
      defaultEdgeOptions={{
        type: 'step',
        style: {
          strokeWidth: 2,
          strokeDasharray: '5,5',
        },
      }}
    >
      <Background gap={20} size={1} />
      <ZoomSelect position="bottom-left" />
      {showMiniMap && <MiniMap nodeStrokeWidth={1} nodeColor="var(--color-muted)" />}
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
          <Button type="button" variant="secondary" size="xs">
            Auto Layout
          </Button>
        </div>
      </Panel>
    </ReactFlow>
  )
}
