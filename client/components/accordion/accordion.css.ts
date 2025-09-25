import { tv, type VariantProps } from 'tailwind-variants/lite'

const accordionStyles = tv({
  slots: {
    root: [],
    header: 'flex',
    triger: [
      'group flex flex-1 cursor-pointer items-center gap-2 py-3 text-left font-medium text-foreground text-sm leading-none',
      'focus-visible:z-10 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset',
      'data-[disabled]:cursor-default data-[disabled]:text-muted-foreground',
    ],
    trigerContent: 'flex-1',
    trigerIcon: [
      'size-4 shrink-0 text-muted-foreground transition-transform duration-150 ease-[cubic-bezier(0.87,_0,_0.13,_1)]',
      'group-data-[state=open]:-rotate-45 group-data-[disabled]:text-muted',
    ],
    content: [
      'transform-gpu data-[state=closed]:animate-accordion-close data-[state=open]:animate-accordion-open',
    ],
    contentInner: 'overflow-hidden pb-4 text-accent-foreground text-sm',
    item: 'overflow-hidden border-border border-b first:mt-0',
  },
  variants: {
    orientation: {
      vertical: {},
      horizontal: {
        root: 'flex flex-row',
        item: 'border-r border-b-0 last:border-r-0',
        content: 'h-full',
      },
    },
    triggerPosition: {
      left: {
        triger: 'justify-between',
        trigerIcon: 'order-first',
      },
      right: {
        triger: 'w-full justify-between',
        trigerIcon: 'order-last',
      },
    },
  },
  defaultVariants: {
    orientation: 'vertical',
    triggerPosition: 'right',
  },
})

type AccordionStyles = VariantProps<typeof accordionStyles>

export { accordionStyles, type AccordionStyles }
