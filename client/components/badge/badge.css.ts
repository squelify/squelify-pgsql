import { tv, type VariantProps } from 'tailwind-variants/lite'

const badgeStyles = tv({
  base: [
    'inline-flex items-center gap-x-1 rounded-md px-2 py-1',
    'whitespace-nowrap font-medium text-xs ring-1 ring-inset',
  ],
  variants: {
    variant: {
      neutral: 'bg-sidebar text-foreground ring-ring/40',
      primary: 'bg-primary text-primary-foreground ring-ring/40',
      success: 'bg-success text-success-foreground ring-ring/40',
      error: 'bg-destructive text-destructive-foreground ring-ring/40',
      warning: 'bg-warning text-warning-foreground ring-ring/40',
      info: 'bg-info text-info-foreground ring-ring/40',
    },
  },
  defaultVariants: {
    variant: 'neutral',
  },
})

type BadgeStyles = VariantProps<typeof badgeStyles>

export { badgeStyles, type BadgeStyles }
