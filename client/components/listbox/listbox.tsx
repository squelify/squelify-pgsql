import * as Lucide from 'lucide-react'
import { Select as ListboxPrimitive } from 'radix-ui'
import * as React from 'react'
import { type ListboxStyles, listboxStyles } from './listbox.css'

const Listbox = ListboxPrimitive.Root
const ListboxGroup = ListboxPrimitive.Group
const ListboxValue = ListboxPrimitive.Value
const ListboxPortal = ListboxPrimitive.Portal

interface ListboxTriggerProps
  extends React.ComponentPropsWithoutRef<typeof ListboxPrimitive.Trigger>,
    ListboxStyles {}

const ListboxTrigger = React.forwardRef<
  React.ComponentRef<typeof ListboxPrimitive.Trigger>,
  ListboxTriggerProps
>(({ className, hasError, hideChevrons, children, ...props }, forwardedRef) => {
  const styles = listboxStyles({ hasError, hideChevrons })
  return (
    <ListboxPrimitive.Trigger
      ref={forwardedRef}
      className={styles.trigger({ className })}
      {...props}
    >
      <span className={styles.triggerInner()}>{children}</span>
      <ListboxPrimitive.Icon asChild>
        <Lucide.ChevronsUpDown className={styles.triggerChevrons()} />
      </ListboxPrimitive.Icon>
    </ListboxPrimitive.Trigger>
  )
})

const ListboxScrollUpButton = React.forwardRef<
  React.ComponentRef<typeof ListboxPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof ListboxPrimitive.ScrollUpButton>
>(({ className, ...props }, forwardedRef) => {
  const styles = listboxStyles()
  return (
    <ListboxPrimitive.ScrollUpButton
      ref={forwardedRef}
      className={styles.scrollUpButton({ className })}
      {...props}
    >
      <Lucide.ChevronUp className={styles.scrollUpButtonIcon()} aria-hidden="true" />
    </ListboxPrimitive.ScrollUpButton>
  )
})

const ListboxScrollDownButton = React.forwardRef<
  React.ComponentRef<typeof ListboxPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof ListboxPrimitive.ScrollDownButton>
>(({ className, ...props }, forwardedRef) => {
  const styles = listboxStyles()
  return (
    <ListboxPrimitive.ScrollDownButton
      ref={forwardedRef}
      className={styles.scrollDownButton({ className })}
      {...props}
    >
      <Lucide.ChevronDown className={styles.scrollDownButtonIcon()} aria-hidden="true" />
    </ListboxPrimitive.ScrollDownButton>
  )
})

interface ListboxContentProps
  extends React.ComponentPropsWithoutRef<typeof ListboxPrimitive.Content>,
    ListboxStyles {}

const ListboxContent = React.forwardRef<
  React.ComponentRef<typeof ListboxPrimitive.Content>,
  ListboxContentProps
>(
  (
    { className, position = 'popper', children, sideOffset = 8, collisionPadding = 10, ...props },
    forwardedRef
  ) => {
    const styles = listboxStyles({ position })
    return (
      <ListboxPortal>
        <ListboxPrimitive.Content
          ref={forwardedRef}
          className={styles.content({ className })}
          collisionPadding={collisionPadding}
          sideOffset={sideOffset}
          position={position}
          {...props}
        >
          <ListboxScrollUpButton />
          <ListboxPrimitive.Viewport className={styles.contentViewport()}>
            {children}
          </ListboxPrimitive.Viewport>
          <ListboxScrollDownButton />
        </ListboxPrimitive.Content>
      </ListboxPortal>
    )
  }
)

const ListboxGroupLabel = React.forwardRef<
  React.ComponentRef<typeof ListboxPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ListboxPrimitive.Label>
>(({ className, ...props }, forwardedRef) => {
  const styles = listboxStyles()
  return (
    <ListboxPrimitive.Label
      ref={forwardedRef}
      className={styles.grouplabel({ className })}
      {...props}
    />
  )
})

const ListboxItem = React.forwardRef<
  React.ComponentRef<typeof ListboxPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ListboxPrimitive.Item>
>(({ className, children, ...props }, forwardedRef) => {
  const styles = listboxStyles()
  return (
    <ListboxPrimitive.Item ref={forwardedRef} className={styles.item({ className })} {...props}>
      <ListboxPrimitive.ItemText className={styles.itemText()}>
        {children}
      </ListboxPrimitive.ItemText>
      <ListboxPrimitive.ItemIndicator>
        <Lucide.Check className={styles.itemIndicatorIcon()} aria-hidden="true" />
      </ListboxPrimitive.ItemIndicator>
    </ListboxPrimitive.Item>
  )
})

const ListboxSeparator = React.forwardRef<
  React.ComponentRef<typeof ListboxPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ListboxPrimitive.Separator>
>(({ className, ...props }, forwardedRef) => {
  const styles = listboxStyles()
  return (
    <ListboxPrimitive.Separator
      ref={forwardedRef}
      className={styles.separator({ className })}
      {...props}
    />
  )
})

Listbox.displayName = 'Listbox'
ListboxGroup.displayName = 'ListboxGroup'
ListboxValue.displayName = 'ListboxValue'
ListboxTrigger.displayName = 'ListboxTrigger'
ListboxScrollUpButton.displayName = ListboxPrimitive.ScrollUpButton.displayName
ListboxScrollDownButton.displayName = ListboxPrimitive.ScrollDownButton.displayName
ListboxContent.displayName = 'ListboxContent'
ListboxGroupLabel.displayName = 'ListboxGroupLabel'
ListboxItem.displayName = 'ListboxItem'
ListboxSeparator.displayName = 'ListboxSeparator'

export {
  Listbox,
  ListboxContent,
  ListboxGroup,
  ListboxGroupLabel,
  ListboxItem,
  ListboxPortal,
  ListboxSeparator,
  ListboxTrigger,
  ListboxValue,
}
