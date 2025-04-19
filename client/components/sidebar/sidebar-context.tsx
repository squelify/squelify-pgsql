import { useStore } from '@nanostores/react'
import * as React from 'react'
import { Tooltip } from '#/components/tooltip'
import { type SidebarState, saveUiState, uiStore } from '#/context/stores/ui.store'
import { sidebarStyles } from './sidebar.css'

type SidebarContextProps = {
  state: SidebarState
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.')
  }
  return context
}

// Detect if the current viewport is mobile based on breakpoint
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const onChange = () => setIsMobile(mql.matches)
    onChange() // Set initial value
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [breakpoint])

  return isMobile
}

type SidebarProviderProps = React.ComponentProps<'div'> & {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  shortcutKey?: string
}

const SidebarProvider = React.forwardRef<HTMLDivElement, SidebarProviderProps>(
  (
    { open: controlledOpen, onOpenChange, shortcutKey = 'e', className, children, ...props },
    forwardedRef
  ) => {
    const uiState = useStore(uiStore)
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)
    const styles = sidebarStyles()

    // Determine if component is controlled or uncontrolled
    const isControlled = controlledOpen !== undefined

    // For uncontrolled mode, use UI store value
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(
      uiState.global.sidebar === 'expanded'
    )

    // Use controlled value if provided, otherwise use uncontrolled
    const open = isControlled ? controlledOpen : uncontrolledOpen

    // Update UI store and state when sidebar is toggled
    const setOpen = React.useCallback(
      (value: boolean | ((prev: boolean) => boolean)) => {
        const newOpen = typeof value === 'function' ? value(open) : value
        const newState: SidebarState = newOpen ? 'expanded' : 'collapsed'

        // Update UI store
        saveUiState('global', { sidebar: newState })

        // Update local state if uncontrolled
        if (!isControlled) {
          setUncontrolledOpen(newOpen)
        }

        // Call external handler if provided
        onOpenChange?.(newOpen)
      },
      [open, isControlled, onOpenChange]
    )

    // Sync with UI store when it changes (only for uncontrolled mode)
    React.useEffect(() => {
      if (!isControlled) {
        const storeOpen = uiState.global.sidebar === 'expanded'
        if (uncontrolledOpen !== storeOpen) {
          setUncontrolledOpen(storeOpen)
        }
      }
    }, [uiState.global.sidebar, uncontrolledOpen, isControlled])

    // Toggle sidebar based on device type
    const toggleSidebar = React.useCallback(() => {
      if (isMobile) {
        setOpenMobile((prev) => !prev)
      } else {
        setOpen(!open)
      }
    }, [isMobile, open, setOpen])

    // Keyboard shortcut
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

    // Current sidebar state for styling
    const state: SidebarState = open ? 'expanded' : 'collapsed'

    // Memoize context value to prevent unnecessary re-renders
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

export { SidebarProvider, useSidebar, useIsMobile }
