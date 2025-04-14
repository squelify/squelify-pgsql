/*!
 * Portions of this file are based on code from `RyoSogawa/react-resizable-layout`.
 * Credits to Ryo Sogawa: https://github.com/RyoSogawa/react-resizable-layout
 * Licensed under the MIT License.
 */

import * as React from 'react'
import {
  KEYS_HORIZONTAL,
  KEYS_POSITIVE,
  KEYS_VERTICAL,
  SeparatorProps,
  SplitPaneState,
  UseSplitPaneProps,
  positionStorage,
  throttle,
  visibilityStorage,
} from './split-pane-utils'

/**
 * Hook for managing split pane state and behavior
 */
export const useSplitPane = ({
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
  persistVisibility = false,
  visibilityKey,
  initialVisible = true,
}: UseSplitPaneProps): SplitPaneState => {
  // Determine storage key for visibility
  const storageKey = visibilityKey || (id ? `${id}-visible` : undefined)

  // Get initial position from localStorage if id is provided
  const savedInitial = React.useMemo(() => {
    if (!id) return initial
    return positionStorage.get(id, initial)
  }, [id, initial])

  // Get initial visibility state from localStorage if persistVisibility is true
  const savedVisibility = React.useMemo(() => {
    if (!persistVisibility || !storageKey) return initialVisible
    return visibilityStorage.get(storageKey, initialVisible)
  }, [persistVisibility, storageKey, initialVisible])

  const isResizing = React.useRef(false)
  const initialPosition = Math.min(Math.max(savedInitial, min), max)
  const positionRef = React.useRef(initialPosition)
  const lastPositionRef = React.useRef(initialPosition)

  const [isDragging, setIsDragging] = React.useState(false)
  const [position, setPosition] = React.useState(savedVisibility ? initialPosition : 0)
  const [endPosition, setEndPosition] = React.useState(initialPosition)
  const [isVisible, setIsVisible] = React.useState(savedVisibility)

  // Create throttled position setter - memoized once
  // biome-ignore lint/correctness/useExhaustiveDependencies: Empty dependency array as we don't want to recreate this on throttleTime changes
  const throttledSetPosition = React.useMemo(() => {
    return throttle((newPosition: number) => {
      setPosition(newPosition)
    }, throttleTime)
  }, [])

  // Visibility management functions
  const setVisibility = React.useCallback(
    (visible: boolean) => {
      setIsVisible(visible)

      // Persist to localStorage if enabled
      if (persistVisibility && storageKey) {
        visibilityStorage.set(storageKey, visible)
      }

      // Update position based on visibility
      if (visible) {
        setPosition(lastPositionRef.current)
      } else {
        // Save last position before hiding
        if (position > 0) {
          lastPositionRef.current = position
        }
        setPosition(0)
      }
    },
    [persistVisibility, storageKey, position]
  )

  const toggleVisibility = React.useCallback(() => {
    setVisibility(!isVisible)
  }, [isVisible, setVisibility])

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

      // Update lastPosition if position is greater than 0
      if (finalPosition > 0) {
        lastPositionRef.current = finalPosition
      }

      // Persist position to localStorage if id is provided
      if (id) {
        positionStorage.set(id, finalPosition)
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
          positionStorage.set(id, initial)
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
        positionStorage.set(id, newPosition)
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
      positionStorage.set(id, initial)
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
    isVisible,
    toggleVisibility,
    setVisibility,
    lastPosition: lastPositionRef.current,
  }
}
