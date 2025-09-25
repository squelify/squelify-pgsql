import { tv, type VariantProps } from 'tailwind-variants/lite'

const splitPaneStyles = tv({
  slots: {
    root: 'flex h-full w-full overflow-hidden',
    separator: [
      'flex items-center justify-center',
      'transition-colors duration-150',
      'focus:outline-none focus:ring-2 focus:ring-primary',
    ],
    panel: 'h-full overflow-auto transition-[width,height] duration-100 ease-out',
    firstPanel: '',
    lastPanel: 'flex-1',
  },
  variants: {
    orientation: {
      horizontal: {
        root: 'flex-row',
        separator: 'h-full w-0.5 cursor-col-resize',
        panel: 'transition-width',
      },
      vertical: {
        root: 'flex-col',
        separator: 'h-0.5 w-full cursor-row-resize',
        panel: 'transition-height',
      },
    },
    isDragging: {
      true: {
        separator: 'bg-accent/60',
        panel: 'transition-none',
      },
      false: {
        separator: 'bg-border/60 hover:bg-border/50 active:bg-border',
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
