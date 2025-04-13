import { Slot } from 'radix-ui'
import * as React from 'react'
import { type CardStyles, cardStyles } from './card.css'

interface CardProps extends React.ComponentPropsWithoutRef<'div'>, CardStyles {
  asChild?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, asChild = false, spacing, ...props }, forwardedRef) => {
    const Comp = asChild ? Slot.Root : 'div'
    const styles = cardStyles({ spacing })
    return <Comp ref={forwardedRef} className={styles.base({ className })} {...props} />
  }
)

interface CardHeaderProps extends React.ComponentPropsWithoutRef<'div'>, CardStyles {
  asChild?: boolean
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, asChild = false, spacing, ...props }, forwardedRef) => {
    const Comp = asChild ? Slot.Root : 'div'
    const styles = cardStyles({ spacing })
    return <Comp ref={forwardedRef} className={styles.header({ className })} {...props} />
  }
)

interface CardTitleProps extends React.ComponentPropsWithoutRef<'h3'> {
  asChild?: boolean
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, asChild = false, ...props }, forwardedRef) => {
    const Comp = asChild ? Slot.Root : 'h3'
    const styles = cardStyles()
    return <Comp ref={forwardedRef} className={styles.title({ className })} {...props} />
  }
)

interface CardDescriptionProps extends React.ComponentPropsWithoutRef<'p'> {
  asChild?: boolean
}

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, asChild = false, ...props }, forwardedRef) => {
    const Comp = asChild ? Slot.Root : 'p'
    const styles = cardStyles()
    return <Comp ref={forwardedRef} className={styles.description({ className })} {...props} />
  }
)

interface CardContentProps extends React.ComponentPropsWithoutRef<'div'>, CardStyles {
  asChild?: boolean
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, asChild = false, spacing, ...props }, forwardedRef) => {
    const Comp = asChild ? Slot.Root : 'div'
    const styles = cardStyles({ spacing })
    return <Comp ref={forwardedRef} className={styles.content({ className })} {...props} />
  }
)

interface CardFooterProps extends React.ComponentPropsWithoutRef<'div'>, CardStyles {
  asChild?: boolean
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, asChild = false, spacing, ...props }, forwardedRef) => {
    const Comp = asChild ? Slot.Root : 'div'
    const styles = cardStyles({ spacing })
    return <Comp ref={forwardedRef} className={styles.footer({ className })} {...props} />
  }
)

interface CardDividerProps extends React.ComponentPropsWithoutRef<'hr'>, CardStyles {}

const CardDivider = React.forwardRef<HTMLHRElement, CardDividerProps>(
  ({ className, spacing, ...props }, forwardedRef) => {
    const styles = cardStyles({ spacing })
    return <hr ref={forwardedRef} className={styles.divider({ className })} {...props} />
  }
)

Card.displayName = 'Card'
CardHeader.displayName = 'CardHeader'
CardTitle.displayName = 'CardTitle'
CardDescription.displayName = 'CardDescription'
CardContent.displayName = 'CardContent'
CardFooter.displayName = 'CardFooter'
CardDivider.displayName = 'CardDivider'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardDivider }
