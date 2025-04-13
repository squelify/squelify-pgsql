import * as React from 'react'
import { Tooltip } from '#/components/tooltip'
import { sidebarStyles } from './sidebar.css'

type SidebarContextProps = {
  state: 'expanded' | 'collapsed'
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.')
  }
  return context
}

// Detect if the current viewport is mobile based on breakpoint
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }
    mql.addEventListener('change', onChange)
    setIsMobile(window.innerWidth < breakpoint)
    return () => mql.removeEventListener('change', onChange)
  }, [breakpoint])

  return !!isMobile
}

type SidebarProviderProps = React.ComponentProps<'div'> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  shortcutKey?: string
  cookieName?: string
  cookieMaxAge?: number
}

export const SidebarProvider = React.forwardRef<HTMLDivElement, SidebarProviderProps>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      shortcutKey = 'e',
      cookieName = 'sidebar_state',
      cookieMaxAge = 60 * 60 * 24 * 7 /* 7 days */,
      className,
      style,
      children,
      ...props
    },
    forwardedRef
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)
    const styles = sidebarStyles()

    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === 'function' ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }
        // This sets the cookie to keep the sidebar state.
        document.cookie = `${cookieName}=${openState}; path=/; max-age=${cookieMaxAge};`
      },
      [setOpenProp, open, cookieName, cookieMaxAge]
    )

    // Helper to toggle the sidebar.
    const toggleSidebar = React.useCallback(() => {
      return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)
    }, [isMobile, setOpen])

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === shortcutKey && (event.metaKey || event.ctrlKey)) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }, [toggleSidebar, shortcutKey])

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state = open ? 'expanded' : 'collapsed'

    const contextValue = React.useMemo<SidebarContextProps>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <Tooltip delayDuration={0}>
          <div className={styles.providerTooltip({ className })} ref={forwardedRef} {...props}>
            {children}
          </div>
        </Tooltip>
      </SidebarContext.Provider>
    )
  }
)

SidebarProvider.displayName = 'SidebarProvider'
