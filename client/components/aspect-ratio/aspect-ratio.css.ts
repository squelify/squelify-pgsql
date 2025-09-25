import { tv, type VariantProps } from 'tailwind-variants/lite'

export const aspectRatioStyles = tv({
  base: 'relative w-full',
  variants: {
    ratio: {
      square: 'aspect-square',
      video: 'aspect-video',
      custom: '',
    },
  },
  defaultVariants: {
    ratio: 'custom',
  },
})

export type AspectRatioStyles = VariantProps<typeof aspectRatioStyles>
