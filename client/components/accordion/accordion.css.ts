import { type VariantProps, tv } from 'tailwind-variants'

const accordionStyles = tv({
  slots: {
    root: [],
    header: 'flex',
    triger: [
      'group flex flex-1 cursor-pointer items-center justify-between py-3 text-left font-medium text-foreground text-sm leading-none',
      'focus-visible:z-10 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset',
      'data-[disabled]:cursor-default data-[disabled]:text-muted-foreground',
    ],
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
})

type AccordionStyles = VariantProps<typeof accordionStyles>

export { accordionStyles, type AccordionStyles }
