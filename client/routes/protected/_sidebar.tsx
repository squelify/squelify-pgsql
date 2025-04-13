import * as Lucide from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'
import { Sidebar, SidebarContent, SidebarFooter } from '#/components/sidebar'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from '#/components/sidebar'
import { SidebarGroupAction, SidebarGroupContent } from '#/components/sidebar'
import { SidebarGroup, SidebarGroupLabel } from '#/components/sidebar'
import { toast } from '#/components/toast'

export default function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  // Navigation items
  const navigationItems = [
    {
      title: 'Home',
      url: '/',
      icon: Lucide.Home,
    },
    {
      title: 'Inbox',
      url: '#inbox',
      icon: Lucide.Inbox,
    },
    {
      title: 'Calendar',
      url: '#calendar',
      icon: Lucide.Calendar,
    },
    {
      title: 'Search',
      url: '#search',
      icon: Lucide.Search,
    },
    {
      title: 'Settings',
      url: '#settings',
      icon: Lucide.Settings,
    },
  ]

  const handleLogout = () => {
    localStorage.removeItem('squelify_user')
    sessionStorage.removeItem('squelify_user')
    toast.success('You have been logged out')
    navigate('/login')
  }

  return (
    <Sidebar className="pt-14" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="sr-only">Application</SidebarGroupLabel>
          <SidebarGroupAction>
            <Lucide.Plus /> <span className="sr-only">Add Project</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild data-active={item.url === location.pathname}>
                    <a href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout}>
                <Lucide.LogOut className="mr-2 size-4" />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
