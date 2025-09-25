import { tv, type VariantProps } from 'tailwind-variants/lite'

const inputStyles = tv({
  slots: {
    container: 'relative w-full',
    input: [
      'relative block w-full appearance-none rounded-md border px-2.5 py-2 shadow-xs outline-hidden transition sm:text-sm',
      'border-input bg-background text-foreground placeholder-muted-foreground',
      'disabled:border-input disabled:bg-muted disabled:text-muted-foreground',
      'focus:border-primary focus:ring-2 focus:ring-primary/20',
      [
        // File input
        'file:-my-2 file:-ml-2.5 file:cursor-pointer file:rounded-r-none file:rounded-l-[5px] file:border-0 file:px-3 file:py-2',
        'file:outline-hidden focus:outline-hidden disabled:pointer-events-none file:disabled:pointer-events-none',
        'file:border-input file:border-solid file:bg-muted file:text-muted-foreground file:hover:bg-accent',
        'file:hover:text-accent-foreground file:disabled:bg-muted file:disabled:text-muted-foreground',
        'file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem]',
      ],
      // Search cancel button (optional)
      '[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden',
    ],
    leftIconContainer: [
      'pointer-events-none absolute bottom-0 left-2 flex h-full items-center',
      'justify-center text-muted-foreground',
    ],
    leftIcon: 'size-[1.125rem] shrink-0',
    passwordContainer: 'absolute right-0 bottom-0 flex h-full items-center justify-center px-3',
    passwordButton: [
      'size-fit rounded-sm text-muted-foreground outline-hidden transition-all hover:text-accent-foreground',
      '-mr-1.5 p-1 outline-none outline-primary outline-offset-2 focus-visible:outline-2',
      'focus:border-primary/60 focus:ring-2 focus:ring-primary/60',
    ],
    passwordIcon: 'size-5 shrink-0',
  },
  variants: {
    isSearch: {
      true: {
        input: 'pl-8',
      },
    },
    isPassword: {
      true: {
        input: 'pr-10',
      },
    },
    hasError: {
      true: {
        input: 'border-destructive ring-1 ring-destructive',
      },
    },
    enableStepper: {
      false: {
        input: [
          // Number input stepper
          '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
        ],
      },
    },
  },
  defaultVariants: {
    isSearch: false,
    isPassword: false,
    hasError: false,
    enableStepper: true,
  },
})

type InputStyles = VariantProps<typeof inputStyles>

export { inputStyles, type InputStyles }
