import * as Lucide from 'lucide-react'
import * as React from 'react'
import { Button } from '#/components/button'
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '#/components/drawer'
import { Input } from '#/components/input'
import { useSidebar } from './sidebar-context'
import { sidebarStyles } from './sidebar.css'
import type { SidebarStyles } from './sidebar.css'

type SidebarProps = React.ComponentProps<'div'> & {
  collapsible?: 'offcanvas' | 'icon' | 'none'
} & SidebarStyles

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      side = 'left',
      variant = 'sidebar',
      collapsible = 'offcanvas',
      className,
      children,
      ...props
    },
    forwardedRef
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()
    const styles = sidebarStyles({ variant, side })

    if (collapsible === 'none') {
      return (
        <div className={styles.rootExpanded({ className })} ref={forwardedRef} {...props}>
          {children}
        </div>
      )
    }

    if (isMobile) {
      return (
        <Drawer open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <DrawerContent
            data-mobile="true"
            data-sidebar="sidebar"
            className={styles.rootMobileDrawer()}
            side={side}
          >
            <DrawerHeader className="sr-only">
              <DrawerTitle>Sidebar</DrawerTitle>
              <DrawerDescription>Displays the mobile sidebar.</DrawerDescription>
            </DrawerHeader>
            <DrawerBody className={styles.rootMobileDrawerInner()}>{children}</DrawerBody>
          </DrawerContent>
        </Drawer>
      )
    }

    return (
      <div
        ref={forwardedRef}
        className={styles.rootWrapper()}
        data-collapsible={state === 'collapsed' ? collapsible : ''}
        data-variant={variant}
        data-state={state}
        data-side={side}
      >
        {/* This is what handles the sidebar gap on desktop */}
        <div className={styles.rootGapDesktop()} />
        <div className={styles.rootContent({ className })} {...props}>
          <div data-sidebar="sidebar" className={styles.rootContentInner()}>
            {children}
          </div>
        </div>
      </div>
    )
  }
)

export const SidebarTrigger = React.forwardRef<
  React.ComponentRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, forwardedRef) => {
  const { toggleSidebar } = useSidebar()
  const styles = sidebarStyles()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    toggleSidebar()
  }

  return (
    <Button
      ref={forwardedRef}
      variant="ghost"
      size="icon"
      className={styles.trigger({ className })}
      onClick={handleClick}
      data-sidebar="trigger"
      {...props}
    >
      <Lucide.PanelLeft strokeWidth={2} />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})

export const SidebarRail = React.forwardRef<HTMLButtonElement, React.ComponentProps<'button'>>(
  ({ className, ...props }, forwardedRef) => {
    const { toggleSidebar } = useSidebar()
    const styles = sidebarStyles()
    return (
      <button
        ref={forwardedRef}
        data-sidebar="rail"
        aria-label="Toggle Sidebar"
        className={styles.rail({ className })}
        onClick={toggleSidebar}
        title="Toggle Sidebar"
        tabIndex={-1}
        {...props}
      />
    )
  }
)

export const SidebarInset = React.forwardRef<HTMLDivElement, React.ComponentProps<'main'>>(
  ({ className, ...props }, forwardedRef) => {
    const styles = sidebarStyles()
    return <main ref={forwardedRef} className={styles.inset({ className })} {...props} />
  }
)

export const SidebarInput = React.forwardRef<
  React.ComponentRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, forwardedRef) => {
  const styles = sidebarStyles()
  return (
    <Input
      ref={forwardedRef}
      className={styles.input({ className })}
      data-sidebar="input"
      {...props}
    />
  )
})

Sidebar.displayName = 'Sidebar'
SidebarTrigger.displayName = 'SidebarTrigger'
SidebarRail.displayName = 'SidebarRail'
SidebarInset.displayName = 'SidebarInset'
SidebarInput.displayName = 'SidebarInput'
