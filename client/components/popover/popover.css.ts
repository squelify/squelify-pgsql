import { tv, type VariantProps } from 'tailwind-variants/lite'

const popoverStyles = tv({
  base: [
    'max-h-[var(--radix-popper-available-height)] w-36 overflow-hidden rounded-md border p-2 text-sm shadow-sm',
    'border-border bg-popover text-popover-foreground will-change-[transform,opacity] data-[state=closed]:animate-hide',
    'data-[state=open]:data-[side=bottom]:animate-slide-down-fade data-[state=open]:data-[side=left]:animate-slide-down-fade',
    'data-[state=open]:data-[side=right]:animate-slide-right-fade data-[state=open]:data-[side=top]:animate-slide-up-fade',
  ],
})

type PopoverStyles = VariantProps<typeof popoverStyles>

export { popoverStyles, type PopoverStyles }
