import { ReactNode } from 'react'
import { clx } from 'twistail-utils'
import { BaseNode } from '#/components/reactflow'
import { TableBody, TableCell, TableRow } from '#/components/table'

/**
 * A container for the database schema node header.
 */
type DatabaseSchemaNodeHeaderProps = { children?: ReactNode }

export const DatabaseSchemaNodeHeader = ({ children }: DatabaseSchemaNodeHeaderProps) => {
  return (
    <h2 className="rounded-tl-md rounded-tr-md bg-secondary p-2 text-center text-muted-foreground text-sm">
      {children}
    </h2>
  )
}

/**
 * A container for the database schema node body that wraps the table.
 */
type DatabaseSchemaNodeBodyProps = { children?: ReactNode }

export const DatabaseSchemaNodeBody = ({ children }: DatabaseSchemaNodeBodyProps) => {
  return (
    <table className="border-spacing-10 overflow-visible">
      <TableBody>{children}</TableBody>
    </table>
  )
}

/**
 * A wrapper for individual table rows in the database schema node.
 */

type DatabaseSchemaTableRowProps = {
  children: ReactNode
  className?: string
}

export const DatabaseSchemaTableRow = ({ children, className }: DatabaseSchemaTableRowProps) => {
  return <TableRow className={clx('relative text-xs', className)}>{children}</TableRow>
}

/**
 * A simplified table cell for the database schema node.
 * Renders static content without additional dynamic props.
 */
type DatabaseSchemaTableCellProps = {
  className?: string
  children?: ReactNode
}

export const DatabaseSchemaTableCell = ({ className, children }: DatabaseSchemaTableCellProps) => {
  return <TableCell className={clx('px-4 py-3', className)}>{children}</TableCell>
}

/**
 * The main DatabaseSchemaNode component that wraps the header and body.
 * It maps over the provided schema data to render rows and cells.
 */
type DatabaseSchemaNodeProps = {
  className?: string
  selected?: boolean
  children?: ReactNode
}

export const DatabaseSchemaNode = ({ className, selected, children }: DatabaseSchemaNodeProps) => {
  return (
    <BaseNode className={className} selected={selected}>
      {children}
    </BaseNode>
  )
}
