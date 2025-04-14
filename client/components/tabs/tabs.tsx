import { Tabs as TabsPrimitive } from 'radix-ui'
import * as React from 'react'
import { type TabsStyles, tabsStyles } from './tabs.css'

const Tabs = (
  props: Omit<React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>, 'orientation'>
) => <TabsPrimitive.Root {...props} />

type TabsListVariant = NonNullable<TabsStyles['variant']>

const TabsListVariantContext = React.createContext<TabsListVariant>('line')

interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  variant?: TabsListVariant
}

const TabsList = React.forwardRef<React.ComponentRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, variant = 'line', children, ...props }, forwardedRef) => {
    const styles = tabsStyles({ variant })
    return (
      <TabsPrimitive.List ref={forwardedRef} className={styles.list({ className })} {...props}>
        <TabsListVariantContext.Provider value={variant}>
          {children}
        </TabsListVariantContext.Provider>
      </TabsPrimitive.List>
    )
  }
)

const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, forwardedRef) => {
  const variant = React.useContext(TabsListVariantContext)
  const styles = tabsStyles({ variant })
  return (
    <TabsPrimitive.Trigger
      ref={forwardedRef}
      className={styles.trigger({ className })}
      {...props}
    />
  )
})

const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, forwardedRef) => {
  const styles = tabsStyles()
  return (
    <TabsPrimitive.Content
      ref={forwardedRef}
      className={styles.content({ className })}
      {...props}
    />
  )
})

Tabs.displayName = 'Tabs'
TabsList.displayName = 'TabsList'
TabsTrigger.displayName = 'TabsTrigger'
TabsContent.displayName = 'TabsContent'

export { Tabs, TabsContent, TabsList, TabsTrigger }
