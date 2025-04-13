import { useHead } from '@unhead/react'
import * as Lucide from 'lucide-react'
import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router'
import AppLogo from '/favicon.svg'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/avatar'
import { Button } from '#/components/button'
import { Drawer, DrawerBody, DrawerClose, DrawerContent } from '#/components/drawer'
import { DrawerHeader, DrawerTitle, DrawerTrigger } from '#/components/drawer'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup } from '#/components/dropdown-menu'
import { DropdownMenuItem, DropdownMenuLabel } from '#/components/dropdown-menu'
import { DropdownMenuSeparator, DropdownMenuTrigger } from '#/components/dropdown-menu'
import { toast } from '#/components/toast'

// Navigation items
const navigationItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: <Lucide.LayoutDashboard className="h-4 w-4" />,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: <Lucide.Settings className="h-4 w-4" />,
  },
]

export default function ProtectedLayout() {
  useHead({ titleTemplate: '%s - Squelify' })

  const location = useLocation()
  const navigate = useNavigate()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  // Get user data from storage (in a real app, this would come from a context)
  const getUserData = () => {
    const userData =
      localStorage.getItem('squelify_user') || sessionStorage.getItem('squelify_user')
    return userData ? JSON.parse(userData) : null
  }

  const user = getUserData()

  // Handle logout
  const handleLogout = () => {
    // Clear storage
    localStorage.removeItem('squelify_user')
    sessionStorage.removeItem('squelify_user')

    // Show toast
    toast.success('You have been logged out')

    // Redirect to login
    navigate('/login')
  }

  // Check if a nav item is active
  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(`${href}/`)
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header - sticky */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4">
        <Drawer open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Lucide.Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-full w-72" side="left">
            <DrawerHeader>
              <DrawerTitle>
                <div className="flex items-center gap-2">
                  <img src={AppLogo} alt="Squelify Logo" className="h-6 w-6 text-primary" />
                  <span className="font-bold text-lg">Squelify</span>
                </div>
              </DrawerTitle>
            </DrawerHeader>
            <DrawerBody className="py-4">
              <nav className="flex flex-col space-y-1">
                {navigationItems.map((item) => (
                  <DrawerClose key={item.href} asChild>
                    <Link
                      to={item.href}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 font-medium text-sm ${
                        isActive(item.href)
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      {item.icon}
                      {item.title}
                    </Link>
                  </DrawerClose>
                ))}
              </nav>
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        <div className="flex items-center gap-2 pr-1">
          <img src={AppLogo} alt="Squelify Logo" className="h-6 w-6 text-primary" />
          <span className="hidden font-bold text-lg md:inline-block">Squelify</span>
        </div>

        <div className="flex-1" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage
                  src={`https://avatar.vercel.sh/${user?.name || 'user'}`}
                  alt={user?.name || 'User'}
                />
                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="font-medium text-sm">{user?.name || 'User'}</p>
                <p className="text-muted-foreground text-xs">{user?.email || 'user@example.com'}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link to="/profile" className="flex items-center">
                  <Lucide.User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/settings" className="flex items-center">
                  <Lucide.Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="flex items-center">
              <Lucide.LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Main content area - flex with sidebar and content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (desktop only) - full height */}
        <aside className="hidden h-full w-64 flex-shrink-0 border-r bg-background md:block">
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="flex flex-col space-y-1 px-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 font-medium text-sm ${
                      isActive(item.href) ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                    }`}
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="border-t p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={`https://avatar.vercel.sh/${user?.name || 'user'}`}
                    alt={user?.name || 'User'}
                  />
                  <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{user?.name || 'User'}</span>
                  <span className="text-muted-foreground text-xs">{user?.role || 'User'}</span>
                </div>
                <Button variant="ghost" size="icon" className="ml-auto" onClick={handleLogout}>
                  <Lucide.LogOut className="h-4 w-4" />
                  <span className="sr-only">Log out</span>
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Page content - scrollable */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
