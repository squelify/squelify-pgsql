import { useHead } from '@unhead/react'
import { Outlet } from 'react-router'
import AppLogo from '/favicon.svg'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '#/components/sidebar'
import AppSidebar from './_sidebar'
import UserMenu from './_usermenu'

export default function ProtectedLayout() {
  useHead({ titleTemplate: '%s - Squelify' })

  return (
    <SidebarProvider className="flex h-screen flex-col overflow-hidden">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4">
        <SidebarTrigger className="md:hidden" />
        <div className="flex items-center gap-2 pr-1">
          <img src={AppLogo} alt="Squelify Logo" className="h-6 w-6 text-primary" />
          <span className="hidden font-bold text-lg md:inline-block">Squelify</span>
        </div>
        <div className="flex-1" />
        <UserMenu />
      </header>
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex-1 overflow-y-auto">
          <Outlet />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
