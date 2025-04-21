import { Edge } from '@xyflow/react'

/**
 * Relationship types for database schema connections
 * - one-to-one: A single record in table A relates to a single record in table B
 * - one-to-many: A single record in table A relates to multiple records in table B
 * - many-to-one: Multiple records in table A relate to a single record in table B
 * - many-to-many: Multiple records in table A relate to multiple records in table B
 */
export type RelationType = 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many'

/**
 * Edge data with relationship information
 */
export interface EdgeData extends Record<string, unknown> {
  relationship: RelationType
  description?: string
}

/**
 * Database schema edges representing relationships between tables
 * Each edge includes the relationship type to determine animation direction
 */
export const schemaEdges: Edge<EdgeData>[] = [
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
