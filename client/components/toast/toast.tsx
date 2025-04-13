import * as Lucide from 'lucide-react'
import { useTheme } from 'next-themes'
import { Toaster as Sonner, toast } from 'sonner'
import { toastStyles } from './toast.css'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ className, ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()
  const styles = toastStyles()
  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className={styles.root({ className })}
      toastOptions={{
        classNames: {
          toast: styles.toast(),
          title: styles.title(),
          description: styles.description(),
          loader: styles.loader(),
          closeButton: styles.closeButton(),
          cancelButton: styles.cancelButton(),
          actionButton: styles.actionButton(),
          success: styles.success(),
          error: styles.error(),
          info: styles.info(),
          warning: styles.warning(),
          loading: styles.loading(),
          default: styles.default(),
          content: styles.content(),
          icon: styles.icon(),
        },
      }}
      icons={{
        success: <Lucide.CircleCheckBig className={styles.icon()} strokeWidth={2} />,
        info: <Lucide.Info className={styles.icon()} strokeWidth={2} />,
        warning: <Lucide.OctagonAlert className={styles.icon()} strokeWidth={2} />,
        error: <Lucide.CircleOff className={styles.icon()} strokeWidth={2} />,
        loading: (
          <Lucide.Loader
            className={styles.icon({ className: 'shrink-0 animate-spin' })}
            strokeWidth={2}
          />
        ),
      }}
      {...props}
    />
  )
}

export { Toaster, toast, type ToasterProps }
