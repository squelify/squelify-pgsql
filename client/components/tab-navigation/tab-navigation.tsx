import { NavigationMenu as NavigationMenuPrimitive } from 'radix-ui'
import * as React from 'react'
import { tabNavigationStyles } from './tab-navigation.css'

function getSubtree(
  options: { asChild: boolean | undefined; children: React.ReactNode },
  content: React.ReactNode | ((children: React.ReactNode) => React.ReactNode)
) {
  const { asChild, children } = options
  if (!asChild) return typeof content === 'function' ? content(children) : content

  const firstChild = React.Children.only(children) as React.ReactElement<{
    children?: React.ReactNode
  }>

  return React.cloneElement(
    firstChild,
    undefined,
    typeof content === 'function' ? content(firstChild.props.children) : content
  )
}

type TabNavigationVariant = 'line' | 'solid' | 'curved'

const TabNavigationVariantContext = React.createContext<TabNavigationVariant>('line')

interface TabNavigationProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>,
    'orientation' | 'defaultValue' | 'dir'
  > {
  variant?: TabNavigationVariant
}

const TabNavigation = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Root>,
  TabNavigationProps
>(({ className, variant = 'line', children, ...props }, forwardedRef) => {
  const styles = tabNavigationStyles({ variant })
  return (
    <TabNavigationVariantContext.Provider value={variant}>
      <NavigationMenuPrimitive.Root ref={forwardedRef} {...props} asChild={false}>
        <NavigationMenuPrimitive.List className={styles.list({ className })}>
          {children}
        </NavigationMenuPrimitive.List>
      </NavigationMenuPrimitive.Root>
    </TabNavigationVariantContext.Provider>
  )
})

const TabNavigationLink = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitive.Link>,
  Omit<React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link>, 'onSelect'> & {
    disabled?: boolean
    active?: boolean
  }
>(({ asChild, disabled, active, className, children, ...props }, forwardedRef) => {
  const variant = React.useContext(TabNavigationVariantContext)
  const styles = tabNavigationStyles({ variant, disabled })

  return (
    <NavigationMenuPrimitive.Item className={styles.item()} aria-disabled={disabled}>
      <NavigationMenuPrimitive.Link
        aria-disabled={disabled}
        className={styles.link()}
        ref={forwardedRef}
        onSelect={() => {}}
        asChild={asChild}
        data-active={active || undefined}
        {...props}
      >
        {getSubtree({ asChild, children }, (children) => (
          <span className={styles.linkInner({ className })}>{children}</span>
        ))}
      </NavigationMenuPrimitive.Link>
    </NavigationMenuPrimitive.Item>
  )
})

TabNavigation.displayName = 'TabNavigation'
TabNavigationLink.displayName = 'TabNavigationLink'

export { TabNavigation, TabNavigationLink }
