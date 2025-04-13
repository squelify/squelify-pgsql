import { type VariantProps, tv } from 'tailwind-variants'

const avatarStyles = tv({
  slots: {
    root: 'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
    image: 'aspect-square size-full',
    fallback: 'flex size-full items-center justify-center rounded-full bg-muted',
    group: 'flex flex-row items-center',
    groupItem: 'z-10 flex items-center justify-center bg-muted text-muted-foreground',
  },
  variants: {
    overlap: {
      true: {
        group: '-space-x-2 *:ring-3 *:ring-background',
      },
      false: {
        group: 'space-x-2',
      },
    },
  },
  defaultVariants: {
    overlap: true,
  },
})

type AvatarStyles = VariantProps<typeof avatarStyles>

export { avatarStyles, type AvatarStyles }
