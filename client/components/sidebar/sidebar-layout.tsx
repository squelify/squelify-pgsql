import { Separator as SeparatorPrimitive, Slot } from 'radix-ui'
import * as React from 'react'
import { sidebarStyles } from './sidebar.css'

export const SidebarHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, forwardedRef) => {
    const styles = sidebarStyles()
    return (
      <div
        ref={forwardedRef}
        data-sidebar="header"
        className={styles.header({ className })}
        {...props}
      />
    )
  }
)

export const SidebarFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, forwardedRef) => {
    const styles = sidebarStyles()
    return (
      <div
        ref={forwardedRef}
        data-sidebar="footer"
        className={styles.footer({ className })}
        {...props}
      />
    )
  }
)

export const SidebarSeparator = React.forwardRef<
  React.ComponentRef<typeof SeparatorPrimitive.Root>,
  React.ComponentProps<typeof SeparatorPrimitive.Root>
>(({ className, ...props }, forwardedRef) => {
  const styles = sidebarStyles()
  return (
    <SeparatorPrimitive.Root
      ref={forwardedRef}
      data-sidebar="separator"
      className={styles.separator({ className })}
      {...props}
    />
  )
})

export const SidebarContent = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, forwardedRef) => {
    const styles = sidebarStyles()
    return (
      <div
        ref={forwardedRef}
        data-sidebar="content"
        className={styles.content({ className })}
        {...props}
      />
    )
  }
)

export const SidebarGroup = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, forwardedRef) => {
    const styles = sidebarStyles()
    return (
      <div
        ref={forwardedRef}
        className={styles.group({ className })}
        data-sidebar="group"
        {...props}
      />
    )
  }
)

export const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, forwardedRef) => {
  const Comp = asChild ? Slot.Root : 'div'
  const styles = sidebarStyles()
  return (
    <Comp
      ref={forwardedRef}
      className={styles.groupLabel({ className })}
      data-sidebar="group-label"
      {...props}
    />
  )
})

export const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, forwardedRef) => {
  const Comp = asChild ? Slot.Root : 'button'
  const styles = sidebarStyles()
  return (
    <Comp
      ref={forwardedRef}
      className={styles.groupAction({ className })}
      data-sidebar="group-action"
      {...props}
    />
  )
})

export const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, forwardedRef) => {
    const styles = sidebarStyles()
    return (
      <div
        ref={forwardedRef}
        className={styles.groupContent({ className })}
        data-sidebar="group-content"
        {...props}
      />
    )
  }
)

SidebarHeader.displayName = 'SidebarHeader'
SidebarFooter.displayName = 'SidebarFooter'
SidebarSeparator.displayName = 'SidebarSeparator'
SidebarContent.displayName = 'SidebarContent'
SidebarGroup.displayName = 'SidebarGroup'
SidebarGroupLabel.displayName = 'SidebarGroupLabel'
SidebarGroupAction.displayName = 'SidebarGroupAction'
SidebarGroupContent.displayName = 'SidebarGroupContent'
