import { Slot } from 'radix-ui'
import * as React from 'react'
import { type BadgeStyles, badgeStyles } from './badge.css'

interface BadgeProps extends React.ComponentPropsWithoutRef<'span'>, BadgeStyles {
  asChild?: boolean
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, asChild = false, ...props }: BadgeProps, forwardedRef) => {
    const Comp = asChild ? Slot.Root : 'span'
    return <Comp ref={forwardedRef} className={badgeStyles({ variant, className })} {...props} />
  }
)

Badge.displayName = 'Badge'

export { Badge, type BadgeProps }
