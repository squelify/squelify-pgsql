import { tv, type VariantProps } from 'tailwind-variants/lite'

const formStyles = tv({
  slots: {
    root: 'w-full',
    field: 'mb-4 grid gap-2',
    label: [
      'font-medium text-foreground text-sm leading-none',
      'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
    ],
    control: [
      'flex w-full appearance-none rounded-md border shadow-xs outline-hidden transition sm:text-sm',
      'border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground',
      'focus:border-primary focus:ring-2 focus:ring-primary/20',
      'disabled:cursor-not-allowed disabled:border-input disabled:bg-muted disabled:text-muted-foreground',
      'data-[invalid=true]:border-destructive data-[invalid=true]:ring-1 data-[invalid=true]:ring-destructive/20',
      'data-[valid=true]:border-success data-[valid=true]:ring-1 data-[valid]:ring-success/20',
    ],
    message: 'font-medium text-destructive text-xs',
    validityState: 'text-muted-foreground text-sm',
  },
  variants: {
    size: {
      xs: {
        control: 'h-7 px-2.5 py-1.5 text-xs',
        submit: 'h-7 px-2.5 text-xs',
        label: 'text-xs',
        message: 'text-xs',
        validityState: 'text-xs',
      },
      sm: {
        control: 'h-8 px-3 py-1.5 text-xs',
        submit: 'h-8 px-3 text-xs',
        label: 'text-xs',
        message: 'text-xs',
        validityState: 'text-xs',
      },
      md: {
        control: 'h-10 px-4 py-2',
        submit: 'h-10 px-4 text-sm',
      },
      lg: {
        control: 'h-12 px-4 py-3 text-base',
        submit: 'h-12 px-8 text-base',
      },
      xl: {
        control: 'h-14 px-4 py-3 text-base',
        submit: 'h-14 px-8 text-base',
      },
    },
    hasError: {
      true: {
        control: 'border-destructive ring-1 ring-destructive/20',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    hasError: false,
  },
})

type FormStyles = VariantProps<typeof formStyles>

export { formStyles, type FormStyles }
