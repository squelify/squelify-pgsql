import { type VariantProps, tv } from 'tailwind-variants'

const dialogStyles = tv({
  slots: {
    overlay: [
      'fixed inset-0 z-50 overflow-y-auto bg-black/40 dark:bg-black/80',
      'data-[state=closed]:animate-dialog-overlay-hide data-[state=open]:animate-dialog-overlay-show',
    ],
    content: [
      '-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-50 w-[95vw] max-w-lg overflow-y-auto rounded-lg border p-6 shadow-sm',
      'border-border bg-card text-card-foreground outline-0 outline-primary outline-offset-2 transition-colors duration-200 focus-visible:outline-2',
      'data-[state=closed]:animate-dialog-content-hide data-[state=open]:animate-dialog-content-show',
    ],
    header: 'flex flex-col space-y-1.5',
    title: 'font-semibold text-foreground text-lg leading-none tracking-tight',
    description: 'mt-1 text-muted-foreground text-sm',
    footer: 'mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-0 sm:space-x-2',
    divider: 'mx-0 my-6 border-border border-t',
  },
  variants: {
    spacing: {
      default: {},
      compact: {
        content: 'p-5',
        footer: 'mt-5',
        divider: 'my-5',
      },
    },
  },
  defaultVariants: {
    spacing: 'default',
  },
})

type DialogStyles = VariantProps<typeof dialogStyles>

export { dialogStyles, type DialogStyles }
