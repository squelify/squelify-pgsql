import { type VariantProps, tv } from 'tailwind-variants'

const toastStyles = tv({
  slots: {
    root: 'toaster group',
    toast: [
      'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground',
      'group-[.toaster]:border-border group-[.toaster]:shadow-md',
    ],
    title: '',
    description: 'group-[.toast]:text-muted-foreground',
    loader: '',
    closeButton: '',
    cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
    actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
    success: '',
    error: '',
    info: '',
    warning: '',
    loading: '',
    default: '',
    content: '',
    icon: 'size-4',
  },
})

type ToastStyles = VariantProps<typeof toastStyles>

export { toastStyles, type ToastStyles }
