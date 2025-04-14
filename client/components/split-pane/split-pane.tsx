/*!
 * Portions of this file are based on code from `RyoSogawa/react-resizable-layout`.
 * Credits to wyhaya: https://github.com/RyoSogawa/react-resizable-layout
 * Licensed under the MIT License.
 */

import { Slot } from 'radix-ui'
import * as React from 'react'
import { type SplitPaneStyles, splitPaneStyles } from './split-pane.css'

type SeparatorProps = React.ComponentPropsWithoutRef<'hr'> & {
  orientation?: 'horizontal' | 'vertical'
  isDragging?: boolean
}

type SplitPaneState = {
  /**
   * border position
   */
  position: number
  /**
   * position at end of drag
   */
  endPosition: number
  /**
   * whether the border is dragging
   */
  isDragging: boolean
  /**
   * props for drag bar
   */
  separatorProps: SeparatorProps
  /**
   * set border position
   */
  setPosition: React.Dispatch<React.SetStateAction<number>>
}

type UseSplitPaneProps = {
  /**
   * direction of resizing: horizontal (left-right) or vertical (up-down)
   */
  orientation: 'horizontal' | 'vertical'
  /**
   * ref of the container element
   */
  containerRef?: React.RefObject<HTMLElement | null>
  /**
   * if true, cannot resize
   */
  disabled?: boolean
  /**
   * initial border position
   */
  initial?: number
  /**
   * minimum border position
   */
  min?: number
  /**
   * maximum border position
   */
  max?: number
  /**
   * calculate border position from other side
   */
  reverse?: boolean
  /**
   * resizing step with keyboard
   */
  step?: number
  shiftStep?: number
  /**
   * callback when border position changes start
   */
  onResizeStart?: (args: { position: number }) => void
  /**
   * callback when border position changes end
   */
  onResizeEnd?: (args: { position: number }) => void
}

type SplitPaneProps = UseSplitPaneProps &
  SplitPaneStyles & {
    /**
     * callback children
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

const useSplitPane = ({
  orientation,
  disabled = false,
  initial = 0,
  min = 0,
  max = Number.POSITIVE_INFINITY,
  reverse,
  step = 10,
  shiftStep = 50,
  onResizeStart,
  onResizeEnd,
  containerRef,
}: UseSplitPaneProps): SplitPaneState => {
  const initialPosition = Math.min(Math.max(initial, min), max)
  const isResizing = React.useRef(false)

  const [isDragging, setIsDragging] = React.useState(false)
  const [position, setPosition] = React.useState(initialPosition)
  const [endPosition, setEndPosition] = React.useState(initialPosition)

  const positionRef = React.useRef(initialPosition)

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
      // exit if not resizing
      if (!isResizing.current) return

      // exit if disabled
      if (disabled) return

      e.stopPropagation()
      e.preventDefault() // prevent text selection

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
      setPosition(currentPosition)
      positionRef.current = currentPosition
    },
    [orientation, disabled, max, min, reverse, containerRef]
  )

  const handlePointerup = React.useCallback(
    (e: PointerEvent) => {
      if (disabled) return

      e.stopPropagation()
      isResizing.current = false
      setIsDragging(false)
      setEndPosition(positionRef.current)
      document.removeEventListener('pointermove', handlePointermove)
      document.removeEventListener('pointerup', handlePointerup)
      if (onResizeEnd) onResizeEnd({ position: positionRef.current })
    },
    [disabled, handlePointermove, onResizeEnd]
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

      const newPosition = position + changeStep * dir
      if (newPosition < min) {
        setPosition(min)
        positionRef.current = min
      } else if (newPosition > max) {
        setPosition(max)
        positionRef.current = max
      } else {
        setPosition(newPosition)
        positionRef.current = newPosition
      }

      if (onResizeEnd) onResizeEnd({ position: positionRef.current })
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
    ]
  )

  const handleDoubleClick = React.useCallback<React.MouseEventHandler>(() => {
    if (disabled) return
    setPosition(initial)
    positionRef.current = initial
  }, [disabled, initial])

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
