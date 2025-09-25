import { tv, type VariantProps } from 'tailwind-variants/lite'

const tableStyles = tv({
  slots: {
    root: 'w-full overflow-auto whitespace-nowrap',
    table: 'w-full caption-bottom border-border border-b',
    head: [],
    headerCell: [
      'border-border border-b px-4 py-3.5 text-left font-semibold text-foreground text-sm',
    ],
    body: 'divide-y divide-border',
    row: [
      '[&_td:last-child]:pr-4 [&_th:last-child]:pr-4',
      '[&_td:first-child]:pl-4 [&_th:first-child]:pl-4',
    ],
    cell: 'p-4 text-muted-foreground text-sm',
    foot: 'border-border border-t text-left font-medium text-foreground',
    caption: 'p-3 text-center text-muted-foreground text-sm',
  },
})

type TableStyles = VariantProps<typeof tableStyles>

export { tableStyles, type TableStyles }
