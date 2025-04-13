import { type VariantProps, tv } from 'tailwind-variants'

const kbdStyles = tv({
  base: [
    'inline-flex cursor-default items-center rounded-md px-1.5 antialiased',
    'gap-0.5 border-1 border-ring/40 font-sans text-muted-foreground [&>abbr]:no-underline',
  ],
  variants: {
    size: {
      xs: 'text-xs/5',
      sm: 'text-sm/5',
      md: 'py-0.5 text-base/5',
      lg: 'py-0.5 text-lg',
    },
  },
  defaultVariants: {
    size: 'xs',
  },
})

type KbdStyles = VariantProps<typeof kbdStyles>

export { kbdStyles, type KbdStyles }
