import * as Lucide from 'lucide-react'
import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui'
import * as React from 'react'
import { dropdownMenuStyles } from './dropdown-menu.css'

const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuGroup = DropdownMenuPrimitive.Group
const DropdownMenuSubMenu = DropdownMenuPrimitive.Sub
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup
const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSubMenuTrigger = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.SubTrigger>,
  Omit<React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger>, 'asChild'>
>(({ className, children, ...props }, forwardedRef) => {
  const styles = dropdownMenuStyles()
  return (
    <DropdownMenuPrimitive.SubTrigger
      ref={forwardedRef}
      className={styles.subMenuTrigger({ className })}
      {...props}
    >
      {children}
      <Lucide.ChevronRight className={styles.subMenuTriggerIcon()} aria-hidden="true" />
    </DropdownMenuPrimitive.SubTrigger>
  )
})

const DropdownMenuSubMenuContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, collisionPadding = 8, ...props }, forwardedRef) => {
  const styles = dropdownMenuStyles()
  return (
    <DropdownMenuPortal>
      <DropdownMenuPrimitive.SubContent
        ref={forwardedRef}
        collisionPadding={collisionPadding}
        className={styles.subMenuContent({ className })}
        {...props}
      />
    </DropdownMenuPortal>
  )
})

const DropdownMenuContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(
  (
    { className, sideOffset = 8, collisionPadding = 8, align = 'center', loop = true, ...props },
    forwardedRef
  ) => {
    const styles = dropdownMenuStyles()
    return (
      <DropdownMenuPortal>
        <DropdownMenuPrimitive.Content
          ref={forwardedRef}
          className={styles.content({ className })}
          collisionPadding={collisionPadding}
          sideOffset={sideOffset}
          align={align}
          loop={loop}
          {...props}
        />
      </DropdownMenuPortal>
    )
  }
)

const DropdownMenuItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Item>,
  Omit<React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>, 'asChild'> & {
    shortcut?: string
    hint?: string
  }
>(({ className, shortcut, hint, children, ...props }, forwardedRef) => {
  const styles = dropdownMenuStyles()
  return (
    <DropdownMenuPrimitive.Item
      ref={forwardedRef}
      className={styles.item({ className })}
      {...props}
    >
      {children}
      {hint && <span className={styles.itemHint()}>{hint}</span>}
      {shortcut && <span className={styles.itemHint()}>{shortcut}</span>}
    </DropdownMenuPrimitive.Item>
  )
})

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  Omit<React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>, 'asChild'> & {
    shortcut?: string
    hint?: string
  }
>(({ className, hint, shortcut, children, checked, ...props }, forwardedRef) => {
  const styles = dropdownMenuStyles()
  return (
    <DropdownMenuPrimitive.CheckboxItem
      ref={forwardedRef}
      className={styles.checkboxItem({ className })}
      checked={checked}
      {...props}
    >
      <span className={styles.checkboxItemIndicator()}>
        <DropdownMenuPrimitive.ItemIndicator>
          <Lucide.Check className={styles.checkboxItemIndicatorIcon()} aria-hidden="true" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
      {hint && <span className={styles.checkboxItemHint()}>{hint}</span>}
      {shortcut && <span className={styles.checkboxItemShortcut()}>{shortcut}</span>}
    </DropdownMenuPrimitive.CheckboxItem>
  )
})

const DropdownMenuRadioItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.RadioItem>,
  Omit<React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>, 'asChild'> & {
    shortcut?: string
    hint?: string
  }
>(({ className, hint, shortcut, children, ...props }, forwardedRef) => {
  const styles = dropdownMenuStyles()
  return (
    <DropdownMenuPrimitive.RadioItem
      ref={forwardedRef}
      className={styles.radioItem({ className })}
      {...props}
    >
      <span className={styles.radioItemIndicator()}>
        <Lucide.Check className={styles.radioItemIndicatorIconCheck()} aria-hidden="true" />
        <Lucide.Circle className={styles.radioItemIndicatorIconCircle()} aria-hidden="true" />
      </span>
      {children}
      {hint && <span className={styles.radioItemHint()}>{hint}</span>}
      {shortcut && <span className={styles.radioItemShortcut()}>{shortcut}</span>}
    </DropdownMenuPrimitive.RadioItem>
  )
})

const DropdownMenuLabel = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ className, ...props }, forwardedRef) => {
  const styles = dropdownMenuStyles()
  return (
    <DropdownMenuPrimitive.Label
      ref={forwardedRef}
      className={styles.label({ className })}
      {...props}
    />
  )
})

const DropdownMenuSeparator = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, forwardedRef) => {
  const styles = dropdownMenuStyles()
  return (
    <DropdownMenuPrimitive.Separator
      ref={forwardedRef}
      className={styles.separator({ className })}
      {...props}
    />
  )
})

const DropdownMenuIconWrapper = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  const styles = dropdownMenuStyles()
  return <div className={styles.iconWrapper({ className })} {...props} />
}

DropdownMenu.displayName = 'DropdownMenu'
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger'
DropdownMenuGroup.displayName = 'DropdownMenuGroup'
DropdownMenuSubMenu.displayName = 'DropdownMenuSubMenu'
DropdownMenuRadioGroup.displayName = 'DropdownMenuRadioGroup'
DropdownMenuSubMenuTrigger.displayName = 'DropdownMenuSubMenuTrigger'
DropdownMenuSubMenuContent.displayName = 'DropdownMenuSubMenuContent'
DropdownMenuContent.displayName = 'DropdownMenuContent'
DropdownMenuItem.displayName = 'DropdownMenuItem'
DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem'
DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem'
DropdownMenuLabel.displayName = 'DropdownMenuLabel'
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator'
DropdownMenuIconWrapper.displayName = 'DropdownMenuIconWrapper'

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuSubMenuTrigger,
  DropdownMenuSubMenu,
  DropdownMenuSubMenuContent,
  DropdownMenuGroup,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuCheckboxItem,
  DropdownMenuIconWrapper,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuPortal,
}
