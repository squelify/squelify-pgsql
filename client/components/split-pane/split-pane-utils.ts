/**
 * Utility functions and types for the split pane component
 */

// Throttle function to limit update frequency
export const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean
  let lastFunc: ReturnType<typeof setTimeout>
  let lastRan: number

  return function (this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args)
      lastRan = Date.now()
      inThrottle = true
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(
        () => {
          if (Date.now() - lastRan >= limit) {
            func.apply(this, args)
            lastRan = Date.now()
          }
        },
        limit - (Date.now() - lastRan)
      )
    }
  }
}

// Constants for localStorage keys
export const STORAGE_PREFIX = 'splitpane-position-'
export const VISIBILITY_PREFIX = 'splitpane-visible-'

// Keys for keyboard navigation
export const KEYS_LEFT = ['ArrowLeft', 'Left']
export const KEYS_RIGHT = ['ArrowRight', 'Right']
export const KEYS_UP = ['ArrowUp', 'Up']
export const KEYS_DOWN = ['ArrowDown', 'Down']
export const KEYS_HORIZONTAL = [...KEYS_LEFT, ...KEYS_RIGHT]
export const KEYS_VERTICAL = [...KEYS_UP, ...KEYS_DOWN]
export const KEYS_POSITIVE = [...KEYS_RIGHT, ...KEYS_DOWN]

// Helper function to safely interact with localStorage for position
export const positionStorage = {
  get: (key: string, fallback: number): number => {
    if (typeof window === 'undefined') return fallback
    try {
      const value = window.localStorage.getItem(`${STORAGE_PREFIX}${key}`)
      return value ? Number.parseFloat(value) : fallback
    } catch (e) {
      console.warn('Failed to retrieve from localStorage:', e)
      return fallback
    }
  },
  set: (key: string, value: number): void => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(`${STORAGE_PREFIX}${key}`, value.toString())
    } catch (e) {
      console.warn('Failed to save to localStorage:', e)
    }
  },
}

// Helper function to safely interact with localStorage for visibility
export const visibilityStorage = {
  get: (key: string, fallback: boolean): boolean => {
    if (typeof window === 'undefined') return fallback
    try {
      const value = window.localStorage.getItem(`${VISIBILITY_PREFIX}${key}`)
      return value === null ? fallback : value === 'true'
    } catch (e) {
      console.warn('Failed to retrieve visibility from localStorage:', e)
      return fallback
    }
  },
  set: (key: string, value: boolean): void => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(`${VISIBILITY_PREFIX}${key}`, value.toString())
    } catch (e) {
      console.warn('Failed to save visibility to localStorage:', e)
    }
  },
}

// Types
export type SeparatorProps = React.ComponentPropsWithoutRef<'hr'> & {
  orientation?: 'horizontal' | 'vertical'
  isDragging?: boolean
}

export type ResizeCallbackArgs = {
  /**
   * Position at the time of callback
   */
  position: number
}

export type UseSplitPaneProps = {
  /**
   * Direction of resizing: horizontal (left-right) or vertical (up-down)
   */
  orientation: 'horizontal' | 'vertical'
  /**
   * Reference to the container element
   */
  containerRef?: React.RefObject<HTMLElement | null>
  /**
   * If true, resizing is disabled
   */
  disabled?: boolean
  /**
   * Initial position of the separator
   */
  initial?: number
  /**
   * Minimum allowed position
   */
  min?: number
  /**
   * Maximum allowed position
   */
  max?: number
  /**
   * Calculate position from opposite side
   */
  reverse?: boolean
  /**
   * Step size for keyboard navigation
   */
  step?: number
  /**
   * Step size when Shift key is pressed
   */
  shiftStep?: number
  /**
   * Throttle time in ms for smooth resizing
   */
  throttleTime?: number
  /**
   * Unique ID for persisting position in localStorage
   */
  id?: string
  /**
   * Callback when resizing starts
   */
  onResizeStart?: (args: ResizeCallbackArgs) => void
  /**
   * Callback when resizing ends
   */
  onResizeEnd?: (args: ResizeCallbackArgs) => void
  /**
   * Enable persistent visibility state in localStorage
   */
  persistVisibility?: boolean
  /**
   * Key prefix for localStorage visibility state
   */
  visibilityKey?: string
  /**
   * Initial visibility state
   */
  initialVisible?: boolean
}

export type SplitPaneState = {
  /**
   * Current position of the separator
   */
  position: number
  /**
   * Position at end of drag
   */
  endPosition: number
  /**
   * Whether the separator is being dragged
   */
  isDragging: boolean
  /**
   * Props for the separator element
   */
  separatorProps: SeparatorProps
  /**
   * Function to set the position
   */
  setPosition: React.Dispatch<React.SetStateAction<number>>
  /**
   * Whether the panel is visible
   */
  isVisible: boolean
  /**
   * Toggle panel visibility
   */
  toggleVisibility: () => void
  /**
   * Set panel visibility
   */
  setVisibility: (visible: boolean) => void
  /**
   * Last non-zero position before hiding
   */
  lastPosition: number
}
