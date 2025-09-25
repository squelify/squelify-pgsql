import { tv, type VariantProps } from 'tailwind-variants/lite'

const progressBarStyles = tv({
  base: 'flex w-full items-center',
  slots: {
    root: 'relative h-4 w-full overflow-hidden rounded-full',
    indicator: 'h-full w-full flex-1 transition-all',
    label: 'ml-2 whitespace-nowrap font-medium text-foreground text-sm leading-none',
  },
  variants: {
    variant: {
      default: {
        root: 'bg-secondary',
        indicator: 'bg-primary',
      },
      neutral: {
        root: 'bg-muted',
        indicator: 'bg-muted-foreground',
      },
      warning: {
        root: 'bg-warning/30',
        indicator: 'bg-warning',
      },
      error: {
        root: 'bg-destructive/30',
        indicator: 'bg-destructive',
      },
      success: {
        root: 'bg-success/30',
        indicator: 'bg-success',
      },
    },
    size: {
      sm: { root: 'h-2' },
      md: { root: 'h-4' },
      lg: { root: 'h-6' },
    },
    animated: {
      true: {
        indicator: 'transform-gpu transition-all duration-300 ease-in-out',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    animated: true,
  },
})

type ProgressBarStyles = VariantProps<typeof progressBarStyles>

export { progressBarStyles, type ProgressBarStyles }
