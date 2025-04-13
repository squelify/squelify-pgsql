import { type VariantProps, tv } from 'tailwind-variants'

const descriptionListStyles = tv({
  slots: {
    dl: 'grid w-full grid-cols-1 text-base/6 sm:grid-cols-[min(50%,--spacing(80))_auto] sm:text-sm/6',
    dt: [
      'col-start-1 border-border border-t pt-3 text-muted-foreground',
      'first:border-none sm:border-border sm:border-t sm:py-3',
    ],
    dd: ['pt-1 pb-3 text-foreground', 'sm:border-border sm:border-t sm:nth-2:border-none sm:py-3'],
  },
  variants: {
    variant: {
      default: {},
      bordered: {
        dl: 'rounded-lg border border-border p-4',
      },
      card: {
        dl: 'rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm',
      },
    },
    size: {
      xs: {
        dl: 'text-xs/5 sm:text-xs/5',
        dt: 'pt-2 text-xs',
        dd: 'pt-1 pb-2 text-xs',
      },
      sm: {
        dl: 'text-sm/5 sm:text-sm/5',
        dt: 'pt-2.5 text-sm',
        dd: 'pt-1 pb-2.5 text-sm',
      },
      md: {
        dl: 'text-base/6 sm:text-sm/6',
        dt: 'pt-3',
        dd: 'pt-1 pb-3',
      },
      lg: {
        dl: 'text-lg/6 sm:text-base/6',
        dt: 'pt-3.5',
        dd: 'pt-1.5 pb-3.5',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})

type DescriptionListStyles = VariantProps<typeof descriptionListStyles>

export { descriptionListStyles, type DescriptionListStyles }
