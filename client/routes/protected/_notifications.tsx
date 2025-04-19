import * as Lucide from 'lucide-react'
import * as React from 'react'
import { Button } from '#/components/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '#/components/collapsible'
import Link from '#/components/link'

type Notification = {
  id: string
  title: string
  message: string
  time: string
  read: boolean
}

export default function Notifications() {
  const [open, setOpen] = React.useState(false)

  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: '1',
      title: 'System Update',
      message: 'Squelify has been updated to the latest version. View changes.',
      time: '5m',
      read: false,
    },
    {
      id: '2',
      title: 'Access Request',
      message: 'New user requested access to production database.',
      time: '1h',
      read: false,
    },
    {
      id: '3',
      title: 'Query Alert',
      message: 'Query "SELECT * FROM users" took more than 30 seconds to execute.',
      time: '2h',
      read: false,
    },
  ])

  // Function to mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    )
  }

  // Count unread notifications
  const unreadCount = notifications.filter((notification) => !notification.read).length

  // Handle click outside manually
  const collapsibleRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        collapsibleRef.current &&
        !collapsibleRef.current.contains(event.target as Node) &&
        open
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  return (
    <Collapsible open={open} onOpenChange={setOpen} ref={collapsibleRef}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="relative size-8 rounded-full hover:bg-sidebar-accent">
          <Lucide.BellRing className="size-4 shrink-0 opacity-50" />
          {unreadCount > 0 && (
            <span className="-top-1 -right-1 absolute flex size-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="absolute top-full right-0 z-50 mt-1 w-80 rounded-md border bg-card shadow-lg">
        <div className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={markAllAsRead}>
                <Lucide.CheckCheck className="mr-1 size-3" />
                Mark all as read
              </Button>
            )}
          </div>

          <div className="max-h-[300px] space-y-2 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-md border-l-4 ${notification.read ? 'border-l-muted-foreground' : 'border-l-primary'} bg-muted/50 p-3 text-sm`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-medium">{notification.title}</span>
                    <span className="text-muted-foreground text-xs">{notification.time}</span>
                  </div>
                  <p className="mt-1 text-muted-foreground text-sm">{notification.message}</p>
                </div>
              ))
            ) : (
              <div className="pt-6 pb-8 text-center text-muted-foreground">
                <Lucide.Bell className="mx-auto mb-2.5 size-7 opacity-30" />
                <p className="font-medium text-sm opacity-80">No notifications</p>
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="mt-2 border-t pt-2 text-center">
              <Button
                size="sm"
                variant="link"
                className="text-muted-foreground text-sm"
                onClick={() => setOpen((prev) => !prev)}
                asChild
              >
                <Link href="/notifications">View all notifications</Link>
              </Button>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
