import { AspectRatio as AspectRatioPrimitive } from 'radix-ui'
import * as React from 'react'
import { type AspectRatioStyles, aspectRatioStyles } from './aspect-ratio.css'

interface AspectRatioProps
  extends Omit<React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root>, 'ratio'>,
    Omit<AspectRatioStyles, 'ratio'> {
  ratio?: number | AspectRatioStyles['ratio']
}

const AspectRatio = React.forwardRef<
  React.ComponentRef<typeof AspectRatioPrimitive.Root>,
  AspectRatioProps
>(({ className, ratio, ...props }, forwardedRef) => {
  const variant = typeof ratio === 'string' ? ratio : 'custom'
  const numeric = typeof ratio === 'number' ? ratio : undefined
  return (
    <AspectRatioPrimitive.Root
      ref={forwardedRef}
      className={aspectRatioStyles({ ratio: variant, className })}
      ratio={numeric}
      {...props}
    />
  )
})

AspectRatio.displayName = 'AspectRatio'

export { AspectRatio }
