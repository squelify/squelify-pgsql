import { tv, type VariantProps } from 'tailwind-variants/lite'

const cardStyles = tv({
  slots: {
    base: [
      'relative w-full rounded-lg border border-border bg-card text-card-foreground shadow-sm',
      'outline-0 outline-primary outline-offset-2 transition-colors duration-200 focus-visible:outline-2',
    ],
    header: 'flex flex-col space-y-1.5 p-6',
    title: 'font-semibold text-foreground text-lg leading-none tracking-tight',
    description: 'text-muted-foreground text-sm',
    content: 'p-6',
    footer: 'flex flex-col-reverse justify-center p-6 sm:flex-row sm:space-x-2',
    divider: 'mx-6 my-0 border-border border-t',
  },
  variants: {
    spacing: {
      default: {},
      compact: {
        header: 'p-5',
        content: 'p-5',
        footer: 'p-5',
        divider: 'mx-5 my-0',
      },
    },
  },
  defaultVariants: {
    spacing: 'default',
  },
})

type CardStyles = VariantProps<typeof cardStyles>

export { cardStyles, type CardStyles }
