import { type VariantProps, tv } from 'tailwind-variants'

export const textStyles = tv({
  base: 'transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
    },
    weight: {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
    variant: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary-foreground',
      destructive: 'text-destructive',
      success: 'text-success',
      warning: 'text-warning',
    },
  },
  compoundVariants: [
    {
      size: ['lg', 'xl', '2xl'],
      weight: ['semibold', 'bold'],
      className: 'leading-normal tracking-tight',
    },
    {
      size: ['xs', 'sm'],
      weight: ['light', 'normal'],
      className: 'leading-tight tracking-wide',
    },
  ],
  defaultVariants: {
    size: 'md',
    weight: 'normal',
    variant: 'default',
    align: 'left',
  },
})

export type TextStyles = VariantProps<typeof textStyles>
