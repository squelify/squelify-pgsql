import { Collapsible as CollapsiblePrimitive } from 'radix-ui'
import * as React from 'react'
import { collapsibleStyles } from './collapsible.css'

const Collapsible = React.forwardRef<
  React.ComponentRef<typeof CollapsiblePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>
>(({ className, ...props }, forwardedRef) => {
  const styles = collapsibleStyles()
  return (
    <CollapsiblePrimitive.Root
      ref={forwardedRef}
      className={styles.base({ className })}
      {...props}
    />
  )
})

const CollapsibleTrigger = React.forwardRef<
  React.ComponentRef<typeof CollapsiblePrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger>
>(({ className, ...props }, forwardedRef) => {
  const styles = collapsibleStyles()
  return (
    <CollapsiblePrimitive.Trigger
      ref={forwardedRef}
      className={styles.trigger({ className })}
      {...props}
    />
  )
})

const CollapsibleContent = React.forwardRef<
  React.ComponentRef<typeof CollapsiblePrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>
>(({ className, ...props }, forwardedRef) => {
  const styles = collapsibleStyles()
  return (
    <CollapsiblePrimitive.Content
      ref={forwardedRef}
      className={styles.content({ className })}
      {...props}
    />
  )
})

Collapsible.displayName = 'Collapsible'
CollapsibleTrigger.displayName = 'CollapsibleTrigger'
CollapsibleContent.displayName = 'CollapsibleContent'

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
