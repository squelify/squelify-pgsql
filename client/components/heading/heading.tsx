import { Slot } from 'radix-ui'
import * as React from 'react'
import { type HeadingStyles, headingStyles } from './heading.css'

interface HeadingProps extends React.ComponentPropsWithoutRef<'h2'>, HeadingStyles {
  asChild?: boolean
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = 'h2', weight, align, asChild = false, ...props }, forwardedRef) => {
    const Comp = asChild ? Slot.Root : level
    return (
      <Comp
        ref={forwardedRef}
        className={headingStyles({ level, weight, align, className })}
        {...props}
      />
    )
  }
)

Heading.displayName = 'Heading'

export { Heading }
