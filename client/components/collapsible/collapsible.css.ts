import { type VariantProps, tv } from 'tailwind-variants'

const collapsibleStyles = tv({
  slots: {
    base: 'w-full',
    trigger: 'relative',
    content: [
      'overflow-hidden',
      'data-[state=open]:animate-collapsible-open',
      'data-[state=closed]:animate-collapsible-close',
    ],
  },
})

type CollapsibleStyles = VariantProps<typeof collapsibleStyles>

export { collapsibleStyles, type CollapsibleStyles }
