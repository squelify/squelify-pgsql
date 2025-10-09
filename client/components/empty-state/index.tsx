import * as React from 'react'
import { clx } from 'twistail-utils'

interface EmptyStateProps {
  className?: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

export default function EmptyState(props: EmptyStateProps) {
  return (
    <div
      className={clx(
        'mx-auto flex h-auto w-full items-center justify-center py-46',
        props.className
      )}
    >
      <div className="md:-mt-16 flex h-full min-h-[96%] max-w-2xl flex-col items-center justify-center p-4 text-center">
        <div className="mb-8">
          <props.icon className="size-20 text-muted-foreground transition-colors duration-200 hover:text-primary" />
        </div>
        <h1 className="mb-4 font-bold text-2xl">Nothing to display!</h1>
        <div className="space-y-4 text-muted-foreground">
          <p className="font-medium leading-7">
            Apparently, we still work on this feature. <br />
            Please check back later.
          </p>
        </div>
      </div>
    </div>
  )
}
