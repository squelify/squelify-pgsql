import { Progress as ProgressPrimitive } from 'radix-ui'
import * as React from 'react'
import { type ProgressBarStyles, progressBarStyles } from './progress-bar.css'

interface ProgressBarProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    ProgressBarStyles {
  value?: number
  max?: number
  label?: string
  labelId?: string
}

const ProgressBar = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressBarProps
>(
  (
    { value = 0, max = 100, label, labelId, variant, size, animated, className, ...props },
    forwardedRef
  ) => {
    const styles = progressBarStyles({ variant, size, animated })
    const safeValue = Math.min(max, Math.max(value, 0))
    const percentage = max ? (safeValue / max) * 100 : safeValue

    return (
      <div
        className={styles.base({ className })}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={safeValue}
        aria-labelledby={label && labelId ? labelId : undefined}
      >
        <ProgressPrimitive.Root
          ref={forwardedRef}
          className={styles.root()}
          value={value}
          max={max}
          {...props}
        >
          <ProgressPrimitive.Indicator
            className={styles.indicator()}
            style={{ transform: `translateX(-${100 - percentage}%)` }}
          />
        </ProgressPrimitive.Root>

        {label ? (
          <span id={labelId} className={styles.label()}>
            {label}
          </span>
        ) : null}
      </div>
    )
  }
)

ProgressBar.displayName = 'ProgressBar'

export { ProgressBar, type ProgressBarProps }
