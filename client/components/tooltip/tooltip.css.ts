import { type VariantProps, tv } from 'tailwind-variants'

const tooltipStyles = tv({
  slots: {
    content: [
      'max-w-60 select-none rounded-md px-2.5 py-1.5 text-sm leading-5 shadow-xs',
      'border border-border bg-popover text-popover-foreground will-change-[transform,opacity]',
      'data-[side=bottom]:animate-slide-down-fade data-[side=top]:animate-slide-up-fade',
      'data-[side=left]:animate-slide-down-fade data-[side=right]:animate-slide-right-fade',
      'data-[state=closed]:animate-hide',
      // Styling for arrow indicator
      'after:absolute after:size-3 after:rotate-45 after:border-border after:border-r after:border-b after:bg-popover after:content-[""]',
      'data-[side=top]:after:bottom-[-6px] data-[side=top]:after:left-[50%] data-[side=top]:after:translate-x-[-50%]',
      'data-[side=bottom]:after:top-[-6px] data-[side=bottom]:after:left-[50%] data-[side=bottom]:after:translate-x-[-50%] data-[side=bottom]:after:border-t data-[side=bottom]:after:border-r-0 data-[side=bottom]:after:border-b-0 data-[side=bottom]:after:border-l',
      'data-[side=left]:after:top-[50%] data-[side=left]:after:right-[-6px] data-[side=left]:after:translate-y-[-50%] data-[side=left]:after:border-t data-[side=left]:after:border-r data-[side=left]:after:border-b-0 data-[side=left]:after:border-l-0',
      'data-[side=right]:after:top-[50%] data-[side=right]:after:left-[-6px] data-[side=right]:after:translate-y-[-50%] data-[side=right]:after:border-t-0 data-[side=right]:after:border-r-0 data-[side=right]:after:border-b data-[side=right]:after:border-l',
    ],
    arrow: '',
  },
  variants: {
    hideArrow: {
      true: { content: 'after:hidden' },
      false: { content: '' },
    },
  },
  defaultVariants: {
    hideArrow: false,
  },
})

type TooltipStyles = VariantProps<typeof tooltipStyles>

export { tooltipStyles, type TooltipStyles }
