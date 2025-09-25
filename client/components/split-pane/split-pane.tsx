/*!
 * Portions of this file are based on code from `RyoSogawa/react-resizable-layout`.
 * Credits to Ryo Sogawa: https://github.com/RyoSogawa/react-resizable-layout
 * Licensed under the MIT License.
 */

import { Slot } from 'radix-ui'
import * as React from 'react'
import { type SplitPaneStyles, splitPaneStyles } from './split-pane.css'
import { SplitPaneState, UseSplitPaneProps } from './split-pane-utils'
import { useSplitPane } from './use-split-pane'

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
  persistVisibility = false,
  visibilityKey,
  initialVisible = true,
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
    persistVisibility,
    visibilityKey,
    initialVisible,
  })

  return <div className={styles.root({ orientation, className })}>{children(resizable)}</div>
}

Panel.displayName = 'SplitPane.Panel'
Separator.displayName = 'SplitPane.Separator'

// Attach subcomponents
SplitPane.Panel = Panel
SplitPane.Separator = Separator

export { SplitPane }
