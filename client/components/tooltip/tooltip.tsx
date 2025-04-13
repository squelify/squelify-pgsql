import { Tooltip as TooltipPrimitive } from 'radix-ui'
import * as React from 'react'
import { type TooltipStyles, tooltipStyles } from './tooltip.css'

interface TooltipProps
  extends Pick<
    TooltipPrimitive.TooltipProps,
    'open' | 'defaultOpen' | 'onOpenChange' | 'delayDuration'
  > {
  delayDuration?: number
}

interface TooltipTriggerProps extends TooltipPrimitive.TooltipTriggerProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

interface TooltipContentProps
  extends Omit<TooltipPrimitive.TooltipContentProps, 'content'>,
    TooltipStyles {
  side?: 'bottom' | 'left' | 'top' | 'right'
  content?: React.ReactNode
}

const Tooltip: React.FC<TooltipProps & { children: React.ReactNode }> = ({
  children,
  delayDuration = 150,
  ...rootProps
}) => {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root {...rootProps}>{children}</TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}

const TooltipTrigger = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Trigger>,
  TooltipTriggerProps
>(({ onClick, asChild, ...props }: TooltipTriggerProps, forwardedRef) => {
  return (
    <TooltipPrimitive.Trigger ref={forwardedRef} onClick={onClick} asChild={asChild} {...props} />
  )
})

const TooltipPortal = TooltipPrimitive.Portal

const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(
  (
    {
      className,
      content,
      children,
      hideArrow,
      side,
      sideOffset = 10,
      ...props
    }: TooltipContentProps,
    forwardedRef
  ) => {
    const styles = tooltipStyles({ hideArrow })
    const contentToRender = content || children

    return (
      <TooltipPortal>
        <TooltipPrimitive.Content
          ref={forwardedRef}
          sideOffset={sideOffset}
          className={styles.content({ className })}
          align="center"
          side={side}
          {...props}
        >
          {contentToRender}
          {!hideArrow ? (
            <TooltipPrimitive.Arrow
              className={styles.arrow()}
              aria-hidden="true"
              width={12}
              height={7}
            />
          ) : null}
        </TooltipPrimitive.Content>
      </TooltipPortal>
    )
  }
)

Tooltip.displayName = 'Tooltip'
TooltipTrigger.displayName = 'TooltipTrigger'
TooltipContent.displayName = 'TooltipContent'
TooltipPortal.displayName = 'TooltipPortal'

export { Tooltip, TooltipTrigger, TooltipContent, TooltipPortal, type TooltipProps }
