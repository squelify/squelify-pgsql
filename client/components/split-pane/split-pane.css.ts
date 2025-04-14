import { type VariantProps, tv } from 'tailwind-variants'

const splitPaneStyles = tv({
  slots: {
    root: 'flex h-full w-full overflow-hidden',
    separator: [
      'flex items-center justify-center',
      'transition-colors duration-150',
      'focus:outline-none focus:ring-2 focus:ring-primary',
    ],
    panel: 'h-full overflow-auto',
    firstPanel: '',
    lastPanel: 'flex-1',
  },
  variants: {
    orientation: {
      horizontal: {
        root: 'flex-row',
        separator: 'h-full w-0.5 cursor-col-resize',
      },
      vertical: {
        root: 'flex-col',
        separator: 'h-0.5 w-full cursor-row-resize',
      },
    },
    isDragging: {
      true: {
        separator: 'bg-accent/60',
      },
      false: {
        separator: 'bg-border/50 hover:bg-border/50 active:bg-border/80',
      },
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    isDragging: false,
  },
})

type SplitPaneStyles = VariantProps<typeof splitPaneStyles>

export { splitPaneStyles, type SplitPaneStyles }
