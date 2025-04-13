import { Slot } from 'radix-ui'
import * as React from 'react'
import { type DescriptionListStyles, descriptionListStyles } from './description-list.css'

interface DescriptionListProps extends React.ComponentPropsWithoutRef<'dl'>, DescriptionListStyles {
  asChild?: boolean
}

const DescriptionList = React.forwardRef<HTMLDListElement, DescriptionListProps>(
  ({ className, asChild = false, size, variant, ...props }: DescriptionListProps, forwardedRef) => {
    const Comp = asChild ? Slot.Root : 'dl'
    const styles = descriptionListStyles({ size, variant })
    return <Comp ref={forwardedRef} className={styles.dl({ className })} {...props} />
  }
)

interface DescriptionTermProps extends React.ComponentPropsWithoutRef<'dt'> {
  asChild?: boolean
}

const DescriptionTerm = React.forwardRef<HTMLElement, DescriptionTermProps>(
  ({ className, asChild = false, ...props }: DescriptionTermProps, forwardedRef) => {
    const Comp = asChild ? Slot.Root : 'dt'
    const styles = descriptionListStyles()
    return <Comp ref={forwardedRef} className={styles.dt({ className })} {...props} />
  }
)

interface DescriptionDetailsProps extends React.ComponentPropsWithoutRef<'dd'> {
  asChild?: boolean
}

const DescriptionDetails = React.forwardRef<HTMLElement, DescriptionDetailsProps>(
  ({ className, asChild = false, ...props }: DescriptionDetailsProps, forwardedRef) => {
    const Comp = asChild ? Slot.Root : 'dd'
    const styles = descriptionListStyles()
    return <Comp ref={forwardedRef} className={styles.dd({ className })} {...props} />
  }
)

DescriptionList.displayName = 'DescriptionList'
DescriptionTerm.displayName = 'DescriptionTerm'
DescriptionDetails.displayName = 'DescriptionDetails'

export { DescriptionList, DescriptionTerm, DescriptionDetails }
