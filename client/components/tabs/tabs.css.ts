import { type VariantProps, tv } from 'tailwind-variants'

const tabsStyles = tv({
  slots: {
    list: [],
    trigger: ['outline-0 outline-primary outline-offset-2 focus-visible:outline-2'],
    content: ['outline-0 outline-hidden outline-primary outline-offset-2 focus-visible:outline-2'],
  },
  variants: {
    variant: {
      line: {
        list: 'flex items-center justify-start border-border border-b',
        trigger: [
          '-mb-px items-center justify-center whitespace-nowrap border-transparent border-b-2 px-3 pb-2 font-medium text-sm transition-all',
          'text-muted-foreground hover:border-border hover:text-foreground',
          'data-[state=active]:border-primary data-[state=active]:text-primary',
          'data-[disabled]:pointer-events-none data-[disabled]:text-muted',
        ],
      },
      solid: {
        list: 'inline-flex items-center justify-center rounded-md bg-muted p-1',
        trigger: [
          'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 font-medium text-sm ring-1 ring-inset',
          'text-muted-foreground ring-transparent transition-all hover:text-foreground',
          'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow',
          'data-[disabled]:pointer-events-none data-[disabled]:text-muted-foreground data-[disabled]:opacity-50',
        ],
      },
      curved: {
        list: [
          'relative inline-flex h-auto w-full items-center justify-start gap-0.5 rounded-md border-border bg-transparent p-0',
          'before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border',
        ],
        trigger: [
          'inline-flex items-center justify-start whitespace-nowrap rounded-sm px-3 py-2 font-medium text-sm ring-1 ring-inset',
          'overflow-hidden rounded-b-none border-x border-t transition-all',
          'bg-muted text-muted-foreground ring-transparent hover:text-foreground',
          'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow',
          'data-[state=active]:z-10 data-[state=active]:shadow-none',
          'data-[disabled]:pointer-events-none data-[disabled]:text-muted-foreground data-[disabled]:opacity-50',
        ],
      },
    },
  },
  defaultVariants: {
    variant: 'line',
  },
})

type TabsStyles = VariantProps<typeof tabsStyles>

export { tabsStyles, type TabsStyles }
