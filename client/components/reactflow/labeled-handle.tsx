import { HandleProps } from '@xyflow/react'
import { HTMLAttributes, forwardRef } from 'react'
import { clx } from 'twistail-utils'
import { BaseHandle } from '#/components/reactflow'

const flexDirections = {
  top: 'flex-col',
  right: 'flex-row-reverse justify-end',
  bottom: 'flex-col-reverse justify-end',
  left: 'flex-row',
}

export const LabeledHandle = forwardRef<
  HTMLDivElement,
  HandleProps &
    HTMLAttributes<HTMLDivElement> & {
      title: string
      handleClassName?: string
      labelClassName?: string
    }
>(({ className, labelClassName, handleClassName, title, position, ...props }, ref) => (
  <div
    ref={ref}
    title={title}
    className={clx('relative flex items-center', flexDirections[position], className)}
  >
    <BaseHandle position={position} className={handleClassName} {...props} />
    {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
    <label className={clx('px-3 text-foreground', labelClassName)}>{title}</label>
  </div>
))

LabeledHandle.displayName = 'LabeledHandle'
