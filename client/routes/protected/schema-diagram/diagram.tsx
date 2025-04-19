import '@xyflow/react/dist/style.css'
import '../../../styles/diagram.css'
import { MarkerType, addEdge, useEdgesState, useNodesState } from '@xyflow/react'
import { Background, Controls, MiniMap, type OnConnect, Panel, ReactFlow } from '@xyflow/react'
import { useCallback, useState } from 'react'

import { edgeTypes, initialEdges } from './edges'
import { initialNodes, nodeTypes } from './nodes'

export default function Diagram() {
  const [nodes, _setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [showMiniMap, setShowMiniMap] = useState(true)

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
    <>
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
        nodesDraggable
        elementsSelectable
        snapToGrid
        snapGrid={[10, 10]}
      >
        <Background color="var(--color-border)" gap={16} size={1} />
        {showMiniMap && <MiniMap nodeStrokeWidth={1} nodeColor="var(--color-muted)" />}
        <Controls showInteractive={false} />
        <Panel position="top-right">
          <div
            style={{
              background: 'var(--color-card)',
              color: 'var(--color-card-foreground)',
              padding: '8px 10px',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              border: '1px solid var(--color-border)',
              fontSize: '0.875rem',
            }}
          >
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem' }}>ERD Diagram</h3>
            <div>
              <label
                style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
              >
                <input
                  type="checkbox"
                  checked={showMiniMap}
                  onChange={() => setShowMiniMap(!showMiniMap)}
                  style={{ margin: 0 }}
                />
                Show Mini Map
              </label>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </>
  )
}
