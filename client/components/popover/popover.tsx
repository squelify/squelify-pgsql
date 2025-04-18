import { Popover as PopoverPrimitive } from 'radix-ui'
import * as React from 'react'
import { popoverStyles } from './popover.css'

const Popover = (props: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root>) => {
  return <PopoverPrimitive.Root {...props} />
}

const PopoverTrigger = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>
>((props, forwardedRef) => {
  return <PopoverPrimitive.Trigger ref={forwardedRef} {...props} />
})

const PopoverAnchor = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Anchor>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Anchor>
>((props, forwardedRef) => {
  return <PopoverPrimitive.Anchor ref={forwardedRef} {...props} />
})

const PopoverClose = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Close>
>((props, forwardedRef) => {
  return <PopoverPrimitive.Close ref={forwardedRef} {...props} />
})

type ContentProps = React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>

const PopoverPortal = PopoverPrimitive.Portal

const PopoverContent = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Content>,
  ContentProps
>(
  (
    {
      className,
      sideOffset = 10,
      side = 'bottom',
      align = 'center',
      collisionPadding,
      avoidCollisions = true,
      ...props
    }: ContentProps,
    forwardedRef
  ) => {
    return (
      <PopoverPortal>
        <PopoverPrimitive.Content
          ref={forwardedRef}
          sideOffset={sideOffset}
          side={side}
          align={align}
          collisionPadding={collisionPadding}
          avoidCollisions={avoidCollisions}
          className={popoverStyles({ className })}
          // https://github.com/radix-ui/primitives/issues/1159
          onWheel={(event) => {
            event.stopPropagation()
            const isScrollingDown = event.deltaY > 0
            if (isScrollingDown) {
              event.currentTarget.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
            } else {
              event.currentTarget.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))
            }
          }}
          {...props}
        />
      </PopoverPortal>
    )
  }
)

Popover.displayName = 'Popover'
PopoverTrigger.displayName = 'PopoverTrigger'
PopoverAnchor.displayName = 'PopoverAnchor'
PopoverClose.displayName = 'PopoverClose'
PopoverContent.displayName = 'PopoverContent'
PopoverPortal.displayName = 'PopoverPortal'

export { Popover, PopoverAnchor, PopoverClose, PopoverContent, PopoverTrigger, PopoverPortal }
