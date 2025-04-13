import { Slot } from 'radix-ui'
import * as React from 'react'
import { type SkeletonStyles, skeletonStyles } from './skeleton.css'

interface SkeletonProps extends React.ComponentPropsWithoutRef<'div'>, SkeletonStyles {
  asChild?: boolean
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, asChild = false, ...props }: SkeletonProps, forwardedRef) => {
    const Comp = asChild ? Slot.Root : 'div'
    return <Comp ref={forwardedRef} className={skeletonStyles({ className })} {...props} />
  }
)

Skeleton.displayName = 'Skeleton'

export { Skeleton, type SkeletonProps }
