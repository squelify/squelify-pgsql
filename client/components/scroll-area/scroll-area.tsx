import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui'
import * as React from 'react'
import { type ScrollAreaStyles, scrollAreaStyles } from './scroll-area.css'

const ScrollArea = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, forwardedRef) => {
  const styles = scrollAreaStyles()
  return (
    <ScrollAreaPrimitive.Root ref={forwardedRef} className={styles.root({ className })} {...props}>
      <ScrollAreaPrimitive.Viewport className={styles.viewport()}>
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner className={styles.corner()} />
    </ScrollAreaPrimitive.Root>
  )
})

interface ScrollBarProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
    ScrollAreaStyles {}

const ScrollBar = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  ScrollBarProps
>(({ className, orientation = 'vertical', ...props }, forwardedRef) => {
  const styles = scrollAreaStyles({ orientation })
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={forwardedRef}
      orientation={orientation}
      className={styles.scrollbar({ className })}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className={styles.thumb()} />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
})

ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
