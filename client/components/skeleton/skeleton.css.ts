import { tv, type VariantProps } from 'tailwind-variants/lite'

const skeletonStyles = tv({
  base: 'animate-pulse rounded-md bg-muted',
})

type SkeletonStyles = VariantProps<typeof skeletonStyles>

export { skeletonStyles, type SkeletonStyles }
