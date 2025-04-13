import { type VariantProps, tv } from 'tailwind-variants'

const dropdownMenuStyles = tv({
  slots: {
    trigger: [],
    group: [],
    subMenu: [],
    radioGroup: [],
    subMenuTrigger: [
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pr-1 pl-2 outline-hidden transition-colors sm:text-sm',
      'text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground ',
      'data-[disabled]:pointer-events-none data-[state=checked]:font-semibold data-[disabled]:text-muted-foreground',
      'data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
    ],
    subMenuTriggerIcon: 'ml-auto size-4 shrink-0',
    subMenuContent: [
      'relative z-50 overflow-hidden rounded-md border p-1 shadow-black/[2.5%] shadow-lg',
      'max-h-[var(--radix-popper-available-height)] min-w-32',
      'border-border bg-popover text-popover-foreground',
      'will-change-[transform,opacity] data-[state=closed]:animate-hide',
      'data-[side=bottom]:animate-slide-down-fade data-[side=left]:animate-slide-down-fade',
      'data-[side=right]:animate-slide-right-fade data-[side=top]:animate-slide-up-fade',
    ],
    content: [
      'relative z-50 overflow-hidden rounded-md border p-1 shadow-black/[2.5%] shadow-lg',
      'max-h-[var(--radix-popper-available-height)] min-w-48 border-border bg-popover text-popover-foreground',
      'will-change-[transform,opacity] data-[state=closed]:animate-hide',
      'data-[side=bottom]:animate-slide-down-fade data-[side=left]:animate-slide-down-fade',
      'data-[side=right]:animate-slide-right-fade data-[side=top]:animate-slide-up-fade',
    ],
    item: [
      'group/DropdownMenuItem relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pr-1 pl-2',
      'text-foreground outline-hidden transition-colors data-[state=checked]:font-semibold sm:text-sm',
      'data-[disabled]:pointer-events-none data-[disabled]:text-muted-foreground',
      'focus-visible:bg-accent focus-visible:text-accent-foreground',
      'hover:bg-accent hover:text-accent-foreground',
    ],
    itemHint: 'ml-auto pl-2 text-muted-foreground text-sm',
    checkboxItem: [
      // Base and layout
      'relative flex cursor-pointer select-none items-center gap-x-2 rounded-sm py-1.5 pr-1 pl-8 outline-hidden transition-colors sm:text-sm',
      'text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground',
      'data-[disabled]:pointer-events-none data-[state=checked]:font-semibold data-[disabled]:text-muted-foreground',
    ],
    checkboxItemIndicator: 'absolute left-2 flex size-4 items-center justify-center',
    checkboxItemIndicatorIcon: 'size-full shrink-0 text-foreground',
    checkboxItemHint: 'ml-auto font-normal text-muted-foreground text-sm',
    checkboxItemShortcut: ['ml-auto font-normal text-muted-foreground text-sm tracking-widest'],
    radioItem: [
      'group/DropdownMenuRadioItem relative flex cursor-pointer select-none items-center gap-x-2 rounded-sm py-1.5 pr-1 pl-8',
      'text-foreground outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground sm:text-sm',
      'focus-visible:bg-accent focus-visible:text-accent-foreground',
      'data-[disabled]:pointer-events-none data-[state=checked]:font-semibold data-[disabled]:text-muted-foreground',
    ],
    radioItemIndicator: 'absolute left-2 flex size-4 items-center justify-center',
    radioItemIndicatorIconCheck: [
      'size-full shrink-0 text-primary group-data-[state=checked]/DropdownMenuRadioItem:flex',
      'group-data-[state=unchecked]/DropdownMenuRadioItem:hidden',
    ],
    radioItemIndicatorIconCircle: [
      'size-full shrink-0 text-muted group-data-[state=unchecked]/DropdownMenuRadioItem:flex',
      'group-data-[state=checked]/DropdownMenuRadioItem:hidden',
    ],
    radioItemHint: 'ml-auto font-normal text-muted-foreground text-sm',
    radioItemShortcut: ['ml-auto font-normal text-muted-foreground text-sm tracking-widest'],
    label: 'px-2 py-2 font-medium text-muted-foreground text-xs tracking-wide',
    separator: '-mx-1 my-1 h-px border-border border-t',
    iconWrapper: 'text-muted-foreground group-data-[disabled]/DropdownMenuItem:text-muted',
  },
})

type DropdownMenuStyles = VariantProps<typeof dropdownMenuStyles>

export { dropdownMenuStyles, type DropdownMenuStyles }
