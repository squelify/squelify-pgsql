import { Slot } from 'radix-ui'
import * as React from 'react'
import { type TextStyles, textStyles } from './text.css'

interface TextProps extends React.ComponentPropsWithoutRef<'p'>, TextStyles {
  asChild?: boolean
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, size, weight, align, variant, asChild = false, ...props }, forwardedRef) => {
    const Comp = asChild ? Slot.Root : 'p'
    return (
      <Comp
        ref={forwardedRef}
        className={textStyles({ size, weight, align, variant, className })}
        {...props}
      />
    )
  }
)

Text.displayName = 'Text'

export { Text }
