import { Slot } from 'radix-ui'
import * as React from 'react'
import { Skeleton } from '#/components/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '#/components/tooltip'
import { useSidebar } from './sidebar-context'
import { sidebarMenuButtonStyles, sidebarStyles } from './sidebar.css'
import type { SidebarMenuButtonStyles, SidebarStyles } from './sidebar.css'

export const SidebarMenu = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
  ({ className, ...props }, forwardedRef) => {
    const styles = sidebarStyles()
    return (
      <ul
        ref={forwardedRef}
        className={styles.menu({ className })}
        data-sidebar="menu"
        {...props}
      />
    )
  }
)

export const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(
  ({ className, ...props }, forwardedRef) => {
    const styles = sidebarStyles()
    return (
      <li
        ref={forwardedRef}
        className={styles.menuItem({ className })}
        data-sidebar="menu-item"
        {...props}
      />
    )
  }
)

type SidebarMenuButtonProps = React.ComponentProps<'button'> & {
  asChild?: boolean
  isActive?: boolean
  tooltip?: string | React.ComponentProps<typeof TooltipContent>
} & SidebarMenuButtonStyles

export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  (
    {
      asChild = false,
      isActive = false,
      variant = 'default',
      size = 'md',
      tooltip,
      className,
      ...props
    },
    forwardedRef
  ) => {
    const Comp = asChild ? Slot.Root : 'button'
    const { isMobile, state } = useSidebar()

    const button = (
      <Comp
        ref={forwardedRef}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={sidebarMenuButtonStyles({ variant, size, className })}
        {...props}
      />
    )

    if (!tooltip) {
      return button
    }

    if (typeof tooltip === 'string') {
      tooltip = {
        children: tooltip,
      }
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== 'collapsed' || isMobile}
          {...tooltip}
        />
      </Tooltip>
    )
  }
)

export const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & {
    asChild?: boolean
  } & SidebarStyles
>(({ className, asChild = false, showOnHover = false, ...props }, forwardedRef) => {
  const Comp = asChild ? Slot.Root : 'button'
  const styles = sidebarStyles({ showOnHover })
  return (
    <Comp
      ref={forwardedRef}
      className={styles.menuAction({ className })}
      data-sidebar="menu-action"
      {...props}
    />
  )
})

export const SidebarMenuBadge = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, ...props }, forwardedRef) => {
    const styles = sidebarStyles()
    return (
      <div
        ref={forwardedRef}
        className={styles.menuBadge({ className })}
        data-sidebar="menu-badge"
        {...props}
      />
    )
  }
)

export const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    showIcon?: boolean
  }
>(({ className, showIcon = false, ...props }, forwardedRef) => {
  const styles = sidebarStyles()

  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      ref={forwardedRef}
      className={styles.menuSkeleton({ className })}
      data-sidebar="menu-skeleton"
      {...props}
    >
      {showIcon && (
        <Skeleton className={styles.menuSkeletonIcon()} data-sidebar="menu-skeleton-icon" />
      )}
      <Skeleton
        data-sidebar="menu-skeleton-text"
        className={styles.menuSkeletonInner()}
        style={{ '--skeleton-width': width } as React.CSSProperties}
      />
    </div>
  )
})

export const SidebarMenuSub = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
  ({ className, ...props }, forwardedRef) => {
    const styles = sidebarStyles()
    return (
      <ul
        ref={forwardedRef}
        className={styles.menuSub({ className })}
        data-sidebar="menu-sub"
        {...props}
      />
    )
  }
)

export const SidebarMenuSubItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(
  ({ className, ...props }, forwardedRef) => {
    const styles = sidebarStyles()
    return <li ref={forwardedRef} className={styles.menuSubItem({ className })} {...props} />
  }
)

export const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<'a'> & {
    asChild?: boolean
    isActive?: boolean
  } & SidebarStyles
>(({ asChild = false, size = 'md', isActive, className, ...props }, forwardedRef) => {
  const Comp = asChild ? Slot.Root : 'a'
  const styles = sidebarStyles({ size })
  return (
    <Comp
      ref={forwardedRef}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={styles.menuSubButton({ className })}
      {...props}
    />
  )
})

SidebarMenu.displayName = 'SidebarMenu'
SidebarMenuItem.displayName = 'SidebarMenuItem'
SidebarMenuButton.displayName = 'SidebarMenuButton'
SidebarMenuAction.displayName = 'SidebarMenuAction'
SidebarMenuBadge.displayName = 'SidebarMenuBadge'
SidebarMenuSkeleton.displayName = 'SidebarMenuSkeleton'
SidebarMenuSub.displayName = 'SidebarMenuSub'
SidebarMenuSubItem.displayName = 'SidebarMenuSubItem'
SidebarMenuSubButton.displayName = 'SidebarMenuSubButton'
