import type { EditableGridCell, GridColumn, Item } from '@glideapps/glide-data-grid'
import { GridCellKind } from '@glideapps/glide-data-grid'
import { consola } from 'consola'
import * as Lucide from 'lucide-react'
import * as React from 'react'
import { clx } from 'twistail-utils'
import { Button } from '#/components/button'
import DataGrid from '#/components/datagrid'
import { SplitPane } from '#/components/split-pane'
import { generateEmail, generateName, generatePhone, getRandomElement } from '#/utils/dummy'

interface PanelBottomProps {
  height: number
  isDragging: boolean
  separatorProps: React.HTMLAttributes<HTMLDivElement>
}

type DummyItem = {
  name: string
  company: string
  email: string
  phone: string
}

const TOTAL_ROWS = 250

const COMPANIES = ['Acme Corp', 'TechStart', 'GlobalSys', 'DataFlow', 'CloudNet', 'SecureIT']

// Grid columns may also provide icon, overlayIcon, menu, style, and theme overrides
const columns: GridColumn[] = [
  { id: 'name', title: 'Name', width: 150 },
  { id: 'company', title: 'Company', width: 150 },
  { id: 'email', title: 'Email', width: 150 },
  { id: 'phone', title: 'Phone', width: 150 },
]

const generateDummyData = (count: number): DummyItem[] => {
  return Array.from({ length: count }, () => {
    const name = generateName()
    return {
      name,
      company: getRandomElement(COMPANIES),
      email: generateEmail(name),
      phone: generatePhone(),
    }
  })
}

const data = generateDummyData(TOTAL_ROWS)

export function PanelBottom({ height, isDragging, separatorProps }: PanelBottomProps) {
  const onCellEdited = React.useCallback((cell: Item, newValue: EditableGridCell) => {
    if (newValue.kind !== GridCellKind.Text) {
      // we only have text cells, might as well just die here.
      return
    }
    const indexes: (keyof DummyItem)[] = ['name', 'company', 'email', 'phone']
    const [col, row] = cell
    const key = indexes[col]
    data[row][key] = newValue.data
  }, [])

  return (
    <>
      <SplitPane.Separator {...separatorProps} isDragging={isDragging} orientation="vertical" />
      {/* Action Bar */}
      <div className="sticky bottom-0 flex h-9 items-center border-border border-t bg-sidebar p-1.5">
        <Button size="xs" variant="outline" className="gap-1.5">
          <Lucide.Download className="-ml-0.5 size-4" strokeWidth={1.8} />
          <span>Export</span>
        </Button>
      </div>
      <div
        className={clx(
          'custom-datagrid z-50 mt-0 h-[calc(100%-36px)] shrink-0 border-t bg-sidebar/80',
          isDragging && 'transition-none'
        )}
        style={{ height: `${height}px` }}
        id="portal"
      >
        <DataGrid
          data={data}
          columns={columns}
          enableCopyPaste
          enableRowMarkers
          enableMultiSelect
          onCellEdited={onCellEdited}
          onSelectionChange={(selection) => {
            consola.log('Selection:', selection)
          }}
        />
      </div>
    </>
  )
}
