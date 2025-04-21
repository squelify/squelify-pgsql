import { Node } from '@xyflow/react'

export type DatabaseSchemaNodeData = {
  selected?: boolean
  data: {
    label: string
    schema: { title: string; type: string }[]
  }
}

/**
 * Database schema nodes for the ER diagram
 * This file contains comprehensive examples of database tables
 */
export const schemaNodes: Node<DatabaseSchemaNodeData['data']>[] = [
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
