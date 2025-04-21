import { Handle, HandleProps } from '@xyflow/react'
import { forwardRef } from 'react'
import { clx } from 'twistail-utils'

export type BaseHandleProps = HandleProps

export const BaseHandle = forwardRef<HTMLDivElement, BaseHandleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Handle
        ref={ref}
        {...props}
        className={clx(
          'size-[11px] rounded-full border transition',
          'border-slate-300 bg-slate-100 dark:border-secondary dark:bg-secondary',
          className
        )}
        {...props}
      >
        {children}
      </Handle>
    )
  }
)

BaseHandle.displayName = 'BaseHandle'
