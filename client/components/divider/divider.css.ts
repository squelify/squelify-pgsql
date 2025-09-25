import { tv, type VariantProps } from 'tailwind-variants/lite'

const dividerStyles = tv({
  base: 'flex items-center justify-between gap-3 text-muted-foreground text-sm',
  slots: {
    line: 'bg-border',
    content: 'whitespace-nowrap text-inherit',
  },
  variants: {
    orientation: {
      horizontal: {
        base: 'mx-auto my-6 w-full shrink-0',
        line: 'h-[1px] w-full',
      },
      vertical: {
        base: 'mx-1 h-full',
        line: 'h-full w-[1px]',
      },
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
})

type DividerStyles = VariantProps<typeof dividerStyles>

export { dividerStyles, type DividerStyles }
