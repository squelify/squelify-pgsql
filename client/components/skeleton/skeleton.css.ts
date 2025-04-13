import { type VariantProps, tv } from 'tailwind-variants'

const skeletonStyles = tv({
  base: 'animate-pulse rounded-md bg-muted',
})

type SkeletonStyles = VariantProps<typeof skeletonStyles>

export { skeletonStyles, type SkeletonStyles }
