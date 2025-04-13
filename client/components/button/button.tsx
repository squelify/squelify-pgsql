import * as Lucide from 'lucide-react'
import { Slot } from 'radix-ui'
import * as React from 'react'
import { type ButtonStyles, buttonStyles } from './button.css'

interface ButtonProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'color'>,
    ButtonStyles {
  asChild?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild,
      isLoading = false,
      loadingText,
      className,
      disabled,
      variant,
      size,
      children,
      ...props
    }: ButtonProps,
    forwardedRef
  ) => {
    const Comp = asChild ? Slot.Root : 'button'
    const styles = buttonStyles({ variant, size, isLoading })

    const withLoading = (
      <span className={styles.span()}>
        <Lucide.LoaderCircle className={styles.icon()} aria-hidden="true" />
        <span className="sr-only">{loadingText ? loadingText : 'Loading'}</span>
        {loadingText ? loadingText : children}
      </span>
    )

    return (
      <Comp
        ref={forwardedRef}
        className={styles.base({ className })}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? withLoading : children}
      </Comp>
    )
  }
)

Button.displayName = 'Button'

export { Button, type ButtonProps }
