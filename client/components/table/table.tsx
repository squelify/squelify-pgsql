import * as React from 'react'
import { tableStyles } from './table.css'

const TableRoot = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, forwardedRef) => {
    const styles = tableStyles()
    return (
      <div ref={forwardedRef}>
        {/* make table scrollable on mobile */}
        <div className={styles.root({ className })} {...props}>
          {children}
        </div>
      </div>
    )
  }
)

const Table = React.forwardRef<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, forwardedRef) => {
    const styles = tableStyles()
    return <table ref={forwardedRef} className={styles.table({ className })} {...props} />
  }
)

const TableHead = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, forwardedRef) => {
  const styles = tableStyles()
  return <thead ref={forwardedRef} className={styles.head({ className })} {...props} />
})

const TableHeaderCell = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, forwardedRef) => {
  const styles = tableStyles()
  return <th ref={forwardedRef} className={styles.headerCell({ className })} {...props} />
})

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, forwardedRef) => {
  const styles = tableStyles()
  return <tbody ref={forwardedRef} className={styles.body({ className })} {...props} />
})

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, forwardedRef) => {
    const styles = tableStyles()
    return <tr ref={forwardedRef} className={styles.row({ className })} {...props} />
  }
)

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, forwardedRef) => {
  const styles = tableStyles()
  return <td ref={forwardedRef} className={styles.cell({ className })} {...props} />
})

const TableFoot = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, forwardedRef) => {
  const styles = tableStyles()
  return <tfoot ref={forwardedRef} className={styles.foot({ className })} {...props} />
})

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, forwardedRef) => {
  const styles = tableStyles()
  return <caption ref={forwardedRef} className={styles.caption({ className })} {...props} />
})

TableRoot.displayName = 'TableRoot'
Table.displayName = 'Table'
TableHead.displayName = 'TableHead'
TableHeaderCell.displayName = 'TableHeaderCell'
TableBody.displayName = 'TableBody'
TableRow.displayName = 'TableRow'
TableCell.displayName = 'TableCell'
TableFoot.displayName = 'TableFoot'
TableCaption.displayName = 'TableCaption'

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFoot,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
}
