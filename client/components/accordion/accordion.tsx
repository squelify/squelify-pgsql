import * as Lucide from 'lucide-react'
import { Accordion as AccordionPrimitive } from 'radix-ui'
import * as React from 'react'
import { accordionStyles } from './accordion.css'

const Accordion = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
>(({ className, orientation = 'vertical', ...props }, forwardedRef) => {
  const styles = accordionStyles({ orientation })
  return (
    <AccordionPrimitive.Root
      ref={forwardedRef}
      className={styles.root({ className })}
      orientation={orientation}
      {...props}
    />
  )
})

const AccordionTrigger = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, forwardedRef) => {
  const styles = accordionStyles()
  return (
    <AccordionPrimitive.Header className={styles.header()}>
      <AccordionPrimitive.Trigger
        className={styles.triger({ className })}
        ref={forwardedRef}
        {...props}
      >
        {children}
        <Lucide.Plus
          className={styles.trigerIcon()}
          aria-hidden="true"
          focusable="false"
          strokeWidth={2}
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
})

const AccordionContent = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, forwardedRef) => {
  const styles = accordionStyles()
  return (
    <AccordionPrimitive.Content className={styles.content()} ref={forwardedRef} {...props}>
      <div className={styles.contentInner({ className })}>{children}</div>
    </AccordionPrimitive.Content>
  )
})

const AccordionItem = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, forwardedRef) => {
  const styles = accordionStyles()
  return (
    <AccordionPrimitive.Item className={styles.item({ className })} ref={forwardedRef} {...props} />
  )
})

Accordion.displayName = 'AccordionItem'
AccordionTrigger.displayName = 'AccordionTrigger'
AccordionContent.displayName = 'AccordionContent'
AccordionItem.displayName = 'AccordionItem'

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
