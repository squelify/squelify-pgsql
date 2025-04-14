/*!
 * Portions of this file are based on code from `RyoSogawa/react-resizable-layout`.
 * Credits to wyhaya: https://github.com/RyoSogawa/react-resizable-layout
 * Licensed under the MIT License.
 */

import { Slot } from 'radix-ui'
import * as React from 'react'
import { type SplitPaneStyles, splitPaneStyles } from './split-pane.css'

// Throttle function to limit update frequency
const throttle = (func: Function, limit: number) => {
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

export type SeparatorProps = React.ComponentPropsWithoutRef<'hr'> & {
  orientation?: 'horizontal' | 'vertical'
  isDragging?: boolean
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
}

export type SplitPaneProps = UseSplitPaneProps &
  SplitPaneStyles & {
    /**
     * Render function for children
     */
    children: (props: SplitPaneState) => React.JSX.Element
    /**
     * Class name for the container
     */
    className?: string
  }

const KEYS_LEFT = ['ArrowLeft', 'Left']
const KEYS_RIGHT = ['ArrowRight', 'Right']
const KEYS_UP = ['ArrowUp', 'Up']
const KEYS_DOWN = ['ArrowDown', 'Down']
const KEYS_HORIZONTAL = [...KEYS_LEFT, ...KEYS_RIGHT]
const KEYS_VERTICAL = [...KEYS_UP, ...KEYS_DOWN]
const KEYS_POSITIVE = [...KEYS_RIGHT, ...KEYS_DOWN]
const STORAGE_PREFIX = 'splitpane-position-'

// Helper function to safely interact with localStorage
const storage = {
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

const useSplitPane = ({
  orientation,
  disabled = false,
  initial = 0,
  min = 0,
  max = Number.POSITIVE_INFINITY,
  reverse,
  step = 10,
  shiftStep = 50,
  throttleTime = 16, // ~60fps
  id,
  onResizeStart,
  onResizeEnd,
  containerRef,
}: UseSplitPaneProps): SplitPaneState => {
  // Get initial position from localStorage if id is provided
  const savedInitial = React.useMemo(() => {
    if (!id) return initial
    return storage.get(id, initial)
  }, [id, initial])

  const isResizing = React.useRef(false)
  const initialPosition = Math.min(Math.max(savedInitial, min), max)
  const positionRef = React.useRef(initialPosition)

  const [isDragging, setIsDragging] = React.useState(false)
  const [position, setPosition] = React.useState(initialPosition)
  const [endPosition, setEndPosition] = React.useState(initialPosition)

  // Create throttled position setter - memoized once
  // biome-ignore lint/correctness/useExhaustiveDependencies: Empty dependency array as we don't want to recreate this on throttleTime changes
  const throttledSetPosition = React.useMemo(() => {
    return throttle((newPosition: number) => {
      setPosition(newPosition)
    }, throttleTime)
  }, [])

  const ariaProps = React.useMemo<SeparatorProps>(
    () => ({
      role: 'separator',
      'aria-valuenow': position,
      'aria-valuemin': min,
      'aria-valuemax': max,
      'aria-orientation': orientation === 'horizontal' ? 'vertical' : 'horizontal',
      'aria-disabled': disabled,
      orientation,
    }),
    [orientation, disabled, max, min, position]
  )

  const handlePointermove = React.useCallback(
    (e: PointerEvent) => {
      // Exit if not resizing
      if (!isResizing.current) return

      if (disabled) return

      e.stopPropagation()
      e.preventDefault() // Prevent text selection

      let currentPosition = (() => {
        if (orientation === 'horizontal') {
          if (containerRef?.current) {
            const containerNode = containerRef.current
            const { left, width } = containerNode.getBoundingClientRect()
            return reverse ? left + width - e.clientX : e.clientX - left
          }
          return reverse ? document.body.offsetWidth - e.clientX : e.clientX
        }
        if (containerRef?.current) {
          const containerNode = containerRef.current
          const { top, height } = containerNode.getBoundingClientRect()
          return reverse ? top + height - e.clientY : e.clientY - top
        }
        return reverse ? document.body.offsetHeight - e.clientY : e.clientY
      })()

      currentPosition = Math.min(Math.max(currentPosition, min), max)
      throttledSetPosition(currentPosition)
      positionRef.current = currentPosition
    },
    [orientation, disabled, max, min, reverse, containerRef, throttledSetPosition]
  )

  const handlePointerup = React.useCallback(
    (e: PointerEvent) => {
      if (disabled) return

      e.stopPropagation()
      isResizing.current = false
      setIsDragging(false)

      // Save final position
      const finalPosition = positionRef.current
      setEndPosition(finalPosition)
      setPosition(finalPosition)

      // Persist position to localStorage if id is provided
      if (id) {
        storage.set(id, finalPosition)
      }

      document.removeEventListener('pointermove', handlePointermove)
      document.removeEventListener('pointerup', handlePointerup)

      if (onResizeEnd) onResizeEnd({ position: finalPosition })
    },
    [disabled, handlePointermove, onResizeEnd, id]
  )

  const handlePointerdown = React.useCallback<React.PointerEventHandler>(
    (e) => {
      if (disabled) return

      e.stopPropagation()
      isResizing.current = true
      setIsDragging(true)
      document.addEventListener('pointermove', handlePointermove)
      document.addEventListener('pointerup', handlePointerup)
      if (onResizeStart) onResizeStart({ position: positionRef.current })
    },
    [disabled, handlePointermove, handlePointerup, onResizeStart]
  )

  const handleKeyDown = React.useCallback<React.KeyboardEventHandler>(
    (e) => {
      if (disabled) return

      if (e.key === 'Enter') {
        setPosition(initial)
        positionRef.current = initial
        if (id) {
          storage.set(id, initial)
        }
        return
      }
      if (
        (orientation === 'horizontal' && !KEYS_HORIZONTAL.includes(e.key)) ||
        (orientation === 'vertical' && !KEYS_VERTICAL.includes(e.key))
      ) {
        return
      }

      if (onResizeStart) onResizeStart({ position: positionRef.current })

      const changeStep = e.shiftKey ? shiftStep : step
      const reversed = reverse ? -1 : 1
      const dir = KEYS_POSITIVE.includes(e.key) ? reversed : -1 * reversed

      let newPosition = position + changeStep * dir
      if (newPosition < min) {
        newPosition = min
      } else if (newPosition > max) {
        newPosition = max
      }

      setPosition(newPosition)
      positionRef.current = newPosition

      // Persist position to localStorage if id is provided
      if (id) {
        storage.set(id, newPosition)
      }

      if (onResizeEnd) onResizeEnd({ position: newPosition })
    },
    [
      disabled,
      orientation,
      onResizeStart,
      shiftStep,
      step,
      reverse,
      position,
      min,
      max,
      onResizeEnd,
      initial,
      id,
    ]
  )

  const handleDoubleClick = React.useCallback<React.MouseEventHandler>(() => {
    if (disabled) return
    setPosition(initial)
    positionRef.current = initial

    // Persist position to localStorage if id is provided
    if (id) {
      storage.set(id, initial)
    }
  }, [disabled, initial, id])

  return {
    position,
    endPosition,
    isDragging,
    separatorProps: {
      ...ariaProps,
      onPointerDown: handlePointerdown,
      onKeyDown: handleKeyDown,
      onDoubleClick: handleDoubleClick,
      isDragging,
    },
    setPosition,
  }
}

// Panel component for first and last panels
interface PanelProps extends React.ComponentPropsWithoutRef<'div'> {
  asChild?: boolean
  position?: 'first' | 'last'
}

const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ className, position = 'first', asChild = false, ...props }, ref) => {
    const styles = splitPaneStyles()
    const Comp = asChild ? Slot.Root : 'div'

    return (
      <Comp
        ref={ref}
        className={
          position === 'first' ? styles.firstPanel({ className }) : styles.lastPanel({ className })
        }
        {...props}
      />
    )
  }
)

// Separator component
interface SeparatorComponentProps extends React.ComponentPropsWithoutRef<'hr'> {
  asChild?: boolean
  orientation?: 'horizontal' | 'vertical'
  isDragging?: boolean
}

const Separator = React.forwardRef<HTMLHRElement, SeparatorComponentProps>(
  (
    { className, orientation = 'horizontal', isDragging = false, asChild = false, ...props },
    ref
  ) => {
    const styles = splitPaneStyles()
    const Comp = asChild ? Slot.Root : 'hr'

    return (
      <Comp
        ref={ref}
        className={styles.separator({ orientation, isDragging, className })}
        {...props}
      />
    )
  }
)

const SplitPane = ({
  orientation = 'horizontal',
  disabled = false,
  initial = 0,
  min = 0,
  max = Number.POSITIVE_INFINITY,
  reverse,
  step = 10,
  shiftStep = 50,
  throttleTime = 16,
  id,
  onResizeStart,
  onResizeEnd,
  children,
  containerRef,
  className,
}: SplitPaneProps): React.JSX.Element => {
  const styles = splitPaneStyles()
  const resizable = useSplitPane({
    orientation,
    disabled,
    initial,
    min,
    max,
    reverse,
    step,
    shiftStep,
    throttleTime,
    id,
    onResizeStart,
    onResizeEnd,
    containerRef,
  })

  return <div className={styles.root({ orientation, className })}>{children(resizable)}</div>
}

Panel.displayName = 'SplitPane.Panel'
Separator.displayName = 'SplitPane.Separator'

// Attach subcomponents
SplitPane.Panel = Panel
SplitPane.Separator = Separator

export { SplitPane, useSplitPane }
