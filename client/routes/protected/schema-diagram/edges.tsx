import type { Edge, EdgeProps, EdgeTypes } from '@xyflow/react'
import { MarkerType, getBezierPath, getSmoothStepPath } from '@xyflow/react'
import * as React from 'react'

// Custom edge component for relationships
const RelationshipEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
  animated,
}) => {
  // Gunakan getSmoothStepPath untuk membuat jalur zigzag
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 5,
    offset: 24,
  })

  return (
    <>
      <path
        id={id}
        style={{ ...style, strokeWidth: 1.5, stroke: 'var(--color-muted-foreground)' }}
        className={`react-flow__edge-path ${animated ? 'animated' : ''}`}
        d={edgePath}
        markerEnd={markerEnd}
      />
      {data?.label && (
        <text
          x={labelX}
          y={labelY}
          style={{
            fontSize: '10px',
            fill: 'var(--color-foreground)',
            fontFamily: 'var(--font-sans)',
            fontWeight: 500,
            textAnchor: 'middle',
            dominantBaseline: 'central',
            pointerEvents: 'none',
            userSelect: 'none',
            backgroundColor: 'var(--color-card)',
            padding: '2px',
          }}
          dy={-6}
        >
          {String(data.label)}
        </text>
      )}
    </>
  )
}

// Define marker type
const markerType: MarkerType = MarkerType.Arrow

// ERD relationship edges
export const initialEdges = [
  {
    id: 'users-posts',
    source: 'users',
    target: 'posts',
    type: 'relationship',
    data: { label: '1:N' },
    markerEnd: markerType,
    animated: true,
  },
  {
    id: 'users-comments',
    source: 'users',
    target: 'comments',
    type: 'relationship',
    data: { label: '1:N' },
    markerEnd: markerType,
    animated: true,
  },
  {
    id: 'posts-comments',
    source: 'posts',
    target: 'comments',
    type: 'relationship',
    data: { label: '1:N' },
    markerEnd: markerType,
    animated: true,
  },
] satisfies Edge[]

export const edgeTypes = {
  relationship: RelationshipEdge,
} satisfies EdgeTypes
