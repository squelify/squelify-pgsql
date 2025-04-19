import '@xyflow/react/dist/style.css'
import { addEdge, useEdgesState, useNodesState } from '@xyflow/react'
import { Background, Controls, MiniMap, type OnConnect, ReactFlow } from '@xyflow/react'
import { useCallback } from 'react'

import { edgeTypes, initialEdges } from './edges'
import { initialNodes, nodeTypes } from './nodes'

export default function Diagram() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
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
    >
      <Background />
      <MiniMap />
      <Controls />
    </ReactFlow>
  )
}
