import { Checkbox as CheckboxPrimitive } from 'radix-ui'
import * as React from 'react'
import { checkboxStyles } from './checkbox.css'

const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, checked, ...props }, forwardedRef) => {
  const styles = checkboxStyles()
  return (
    <CheckboxPrimitive.Root
      ref={forwardedRef}
      className={styles.root({ className })}
      checked={checked}
      {...props}
    >
      <CheckboxPrimitive.Indicator className={styles.indicator()} asChild>
        {checked === 'indeterminate' ? (
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              x1="4"
              x2="12"
              y1="8"
              y2="8"
            />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.2 5.59998L6.79999 9.99998L4.79999 7.99998"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
})

Checkbox.displayName = 'Checkbox'

export { Checkbox }
