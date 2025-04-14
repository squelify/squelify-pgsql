import { type VariantProps, tv } from 'tailwind-variants'

const tabNavigationStyles = tv({
  slots: {
    list: [
      'flex items-center justify-start whitespace-nowrap',
      '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    ],
    item: 'flex',
    link: 'group relative flex shrink-0 select-none items-center justify-center',
    linkInner: [
      'flex items-center justify-center whitespace-nowrap px-3 pb-2 font-medium text-sm transition-all',
      'outline-0 outline-primary outline-offset-2 focus-visible:outline-2',
    ],
  },
  variants: {
    variant: {
      line: {
        list: 'border-border border-b',
        linkInner: [
          '-mb-px border-transparent border-b-2',
          'text-muted-foreground group-hover:border-border group-hover:text-foreground',
          'group-data-[active]:border-primary group-data-[active]:text-primary',
        ],
      },
      solid: {
        list: 'inline-flex items-center justify-center rounded-md bg-muted p-1',
        linkInner: [
          'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 ring-1 ring-inset',
          'text-muted-foreground ring-transparent transition-all hover:text-foreground',
          'group-data-[active]:bg-background group-data-[active]:text-foreground group-data-[active]:shadow',
        ],
      },
      curved: {
        list: [
          'relative inline-flex h-auto w-full items-center justify-start gap-0.5 rounded-md border-border bg-transparent p-0',
          'before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border',
        ],
        linkInner: [
          'inline-flex items-center justify-start whitespace-nowrap rounded-sm px-3 py-2 ring-1 ring-inset',
          'overflow-hidden rounded-b-none border-x border-t transition-all',
          'bg-muted text-muted-foreground ring-transparent hover:text-foreground',
          'group-data-[active]:bg-background group-data-[active]:text-foreground group-data-[active]:shadow',
          'group-data-[active]:z-10 group-data-[active]:shadow-none',
        ],
      },
    },
    disabled: {
      true: {
        link: 'pointer-events-none',
        linkInner: 'pointer-events-none text-muted',
      },
    },
  },
  defaultVariants: {
    variant: 'line',
    disabled: false,
  },
  compoundVariants: [
    {
      variant: 'solid',
      disabled: true,
      className: {
        linkInner: 'opacity-50',
      },
    },
    {
      variant: 'curved',
      disabled: true,
      className: {
        linkInner: 'opacity-50',
      },
    },
  ],
})

type TabNavigationStyles = VariantProps<typeof tabNavigationStyles>

export { tabNavigationStyles, type TabNavigationStyles }
