import { useHead } from '@unhead/react'
import * as Lucide from 'lucide-react'
import * as React from 'react'
import { Outlet } from 'react-router'
import AppLogo from '/favicon.svg'
import { Button } from '#/components/button'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '#/components/sidebar'
import AppCommand from './_command'
import Notifications from './_notifications'
import AppSidebar from './_sidebar'
import UserMenu from './_usermenu'

export default function AppLayout() {
  useHead({ titleTemplate: '%s - Squelify' })

  const [openCommand, setOpenCommand] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpenCommand((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <SidebarProvider className="flex h-screen flex-col overflow-hidden">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4">
        <SidebarTrigger className="md:hidden" />
        <div className="hidden items-center gap-2 pr-1 md:flex">
          <img src={AppLogo} alt="Squelify Logo" className="h-6 w-6 text-primary" />
          <span className="hidden font-bold text-lg md:inline-block">Squelify</span>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <div className="relative flex items-center gap-1">
            <Notifications />
            <Button variant="ghost" className="size-8">
              <Lucide.CircleHelp className="size-4 shrink-0 opacity-50" />
              <span className="sr-only">Help</span>
            </Button>
          </div>
          <div className="mr-2 ml-1 hidden h-6 w-px bg-border sm:block" />
          <UserMenu />
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar openCommand={setOpenCommand} />
        <SidebarInset className="flex-1 overflow-y-auto">
          <div className="h-max md:h-full">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
      <AppCommand open={openCommand} setOpen={setOpenCommand} />
    </SidebarProvider>
  )
}
