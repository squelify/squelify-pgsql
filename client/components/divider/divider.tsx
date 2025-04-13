import { Separator as DividerPrimitive } from 'radix-ui'
import * as React from 'react'
import { type DividerStyles, dividerStyles } from './divider.css'

interface DividerProps
  extends React.ComponentPropsWithoutRef<typeof DividerPrimitive.Root>,
    DividerStyles {}

const Divider = React.forwardRef<React.ComponentRef<typeof DividerPrimitive.Root>, DividerProps>(
  (
    { className, orientation = 'horizontal', decorative = true, children, ...props },
    forwardedRef
  ) => {
    const styles = dividerStyles({ orientation })
    return (
      <DividerPrimitive.Root
        ref={forwardedRef}
        decorative={decorative}
        orientation={orientation}
        className={styles.base({ className })}
        {...props}
      >
        {children ? (
          <>
            <DividerPrimitive.Separator className={styles.line()} />
            <div className={styles.content()}>{children}</div>
            <DividerPrimitive.Separator className={styles.line()} />
          </>
        ) : (
          <DividerPrimitive.Separator className={styles.line()} />
        )}
      </DividerPrimitive.Root>
    )
  }
)

Divider.displayName = DividerPrimitive.Root.displayName

export { Divider }
