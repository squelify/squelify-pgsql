import type { BuiltInNode, Node, NodeTypes } from '@xyflow/react'
import { Handle, type NodeProps, Position } from '@xyflow/react'

// Entity node type definition
type EntityNode = Node<
  {
    tableName: string
    attributes: Array<{ name: string; type: string; isPrimary?: boolean; isForeign?: boolean }>
  },
  'entity'
>

type PositionLoggerNode = Node<{ label?: string }, 'position-logger'>
type AppNode = BuiltInNode | PositionLoggerNode | EntityNode

// Custom Entity Node for ERD
function EntityNodeComponent({ data }: NodeProps<EntityNode>) {
  return (
    <div
      className="react-flow__node-default entity-node"
      style={{
        width: 180,
        padding: 0,
        fontSize: '0.875rem',
        maxWidth: '100%',
      }}
    >
      {/* Table Name Header */}
      <div
        style={{
          backgroundColor: 'var(--color-muted)',
          color: 'var(--color-foreground)',
          padding: '4px 6px',
          fontWeight: 'bold',
          borderTopLeftRadius: 'var(--radius-sm)',
          borderTopRightRadius: 'var(--radius-sm)',
          fontSize: '0.9rem',
          textTransform: 'capitalize',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        {data.tableName}
      </div>

      {/* Table Attributes */}
      <div style={{ padding: '6px 8px' }}>
        {data.attributes.map((attr, index) => (
          <div
            key={attr.name}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '3px 0',
              borderBottom:
                index < data.attributes.length - 1 ? '1px solid var(--color-border)' : 'none',
              fontSize: '0.8rem',
              lineHeight: '1.2',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {attr.isPrimary && (
                <span
                  style={{
                    marginRight: '4px',
                    color: 'var(--color-muted-foreground)',
                    fontSize: '0.75rem',
                  }}
                >
                  PK
                </span>
              )}
              {attr.isForeign && (
                <span
                  style={{
                    marginRight: '4px',
                    color: 'var(--color-muted-foreground)',
                    fontSize: '0.75rem',
                  }}
                >
                  FK
                </span>
              )}
              {attr.name}
            </div>
            <div
              style={{
                color: 'var(--color-muted-foreground)',
                fontSize: '0.75rem',
                marginLeft: '8px',
              }}
            >
              {attr.type}
            </div>
          </div>
        ))}
      </div>

      {/* Handles for connections */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: 'var(--color-muted-foreground)', width: '8px', height: '8px' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: 'var(--color-muted-foreground)', width: '8px', height: '8px' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: 'var(--color-muted-foreground)', width: '8px', height: '8px' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: 'var(--color-muted-foreground)', width: '8px', height: '8px' }}
      />
    </div>
  )
}

function PositionLoggerNode({
  positionAbsoluteX,
  positionAbsoluteY,
  data,
}: NodeProps<PositionLoggerNode>) {
  const _x = `${Math.round(positionAbsoluteX)}px`
  const _y = `${Math.round(positionAbsoluteY)}px`

  return (
    <div
      className="react-flow__node-default"
      style={{
        background: 'var(--color-card)',
        color: 'var(--color-card-foreground)',
        fontSize: '0.8rem',
        padding: '6px 8px',
      }}
    >
      {data.label && <div>{data.label}</div>}
      <div>x y</div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: 'var(--color-muted-foreground)', width: '8px', height: '8px' }}
      />
    </div>
  )
}

// Sample ERD nodes
export const initialNodes: AppNode[] = [
  {
    id: 'users',
    type: 'entity',
    position: { x: 50, y: 50 },
    data: {
      tableName: 'users',
      attributes: [
        { name: 'id', type: 'uuid', isPrimary: true },
        { name: 'username', type: 'varchar(50)' },
        { name: 'email', type: 'varchar(100)' },
        { name: 'created_at', type: 'timestamp' },
      ],
    },
  },
  {
    id: 'posts',
    type: 'entity',
    position: { x: 300, y: 50 },
    data: {
      tableName: 'posts',
      attributes: [
        { name: 'id', type: 'uuid', isPrimary: true },
        { name: 'title', type: 'varchar(200)' },
        { name: 'content', type: 'text' },
        { name: 'user_id', type: 'uuid', isForeign: true },
        { name: 'published', type: 'boolean' },
      ],
    },
  },
  {
    id: 'comments',
    type: 'entity',
    position: { x: 300, y: 250 },
    data: {
      tableName: 'comments',
      attributes: [
        { name: 'id', type: 'uuid', isPrimary: true },
        { name: 'content', type: 'text' },
        { name: 'user_id', type: 'uuid', isForeign: true },
        { name: 'post_id', type: 'uuid', isForeign: true },
        { name: 'created_at', type: 'timestamp' },
      ],
    },
  },
]

export const nodeTypes = {
  'position-logger': PositionLoggerNode,
  entity: EntityNodeComponent,
} satisfies NodeTypes
