import '@xyflow/react/dist/style.css'
import '../../../styles/diagram.css'
import { addEdge, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react'
import { Background, Controls, MiniMap, Panel, ReactFlow } from '@xyflow/react'
import { MarkerType, type OnConnect, ReactFlowProvider } from '@xyflow/react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Button } from '#/components/button'
import { edgeTypes, initialEdges } from './edges'
import { getLayoutedElements } from './layout-utils'
import { AppNode, initialNodes, nodeTypes } from './nodes'

// Inner component that uses ReactFlow hooks
function DiagramContent() {
  // Use useRef to track if auto layout has been applied
  const layoutApplied = useRef(false)

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [showMiniMap, setShowMiniMap] = useState(true)

  // Get ReactFlow instance using the hook
  const reactFlowInstance = useReactFlow()

  // Function to apply auto layout
  const resetLayout = useCallback(() => {
    if (!nodes.length) return

    // Direction: Top to Bottom
    const { nodes: layoutedNodes, edges: _layoutedEdges } = getLayoutedElements(nodes, edges, 'TB')

    // Update nodes with new positions
    setNodes(layoutedNodes as AppNode[])

    // Wait a bit then fit view
    setTimeout(() => {
      reactFlowInstance.fitView({ padding: 0.2 })
    }, 100)

    // Mark that layout has been applied
    layoutApplied.current = true
  }, [nodes, edges, setNodes, reactFlowInstance])
  // Apply auto layout only once when component is first loaded
  useEffect(() => {
    // Only apply layout if it hasn't been applied yet
    if (!layoutApplied.current) {
      // Small delay to ensure ReactFlow is fully initialized
      const timer = setTimeout(() => {
        resetLayout()
      }, 200)

      return () => clearTimeout(timer)
    }
  }, [resetLayout])

  const onConnect: OnConnect = useCallback(
    (connection) =>
      setEdges((edges) =>
        addEdge(
          {
            ...connection,
            type: 'relationship',
            data: { label: '1:N' },
            markerEnd: MarkerType.Arrow,
            animated: true,
          },
          edges
        )
      ),
    [setEdges]
  )

  return (
    <ReactFlow
      nodes={nodes}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      edges={edges}
      edgeTypes={edgeTypes}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      minZoom={0.2}
      maxZoom={4}
      defaultEdgeOptions={{ type: 'relationship' }}
      defaultViewport={{ x: 0, y: 0, zoom: 1.5 }}
      nodesDraggable={true}
      elementsSelectable={true}
      snapToGrid={true}
      snapGrid={[10, 10]}
    >
      <Background color="var(--color-border)" gap={16} size={1} />
      {showMiniMap && <MiniMap nodeStrokeWidth={1} nodeColor="var(--color-muted)" />}
      <Controls showInteractive={false} />
      <Panel position="top-right">
        <div className="flex flex-col gap-2 rounded-md border border-border bg-card px-2.5 py-2 text-card-foreground text-sm">
          <h3 className="font-medium text-lg">ERD Diagram</h3>
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
            <Button type="button" onClick={resetLayout} variant="secondary" size="xs">
              Auto Layout
            </Button>
          </div>
        </div>
      </Panel>
    </ReactFlow>
  )
}

// Main component that provides ReactFlowProvider
export default function Diagram() {
  return (
    <ReactFlowProvider>
      <DiagramContent />
    </ReactFlowProvider>
  )
}
