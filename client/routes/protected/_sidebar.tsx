import * as Lucide from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'
import { Kbd } from '#/components/kbd'
import Link from '#/components/link'
import { Sidebar, SidebarContent, SidebarFooter, SidebarMenuBadge } from '#/components/sidebar'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from '#/components/sidebar'
import { SidebarGroupAction, SidebarGroupContent } from '#/components/sidebar'
import { SidebarGroup, SidebarGroupLabel } from '#/components/sidebar'
import { toast } from '#/components/toast'

interface AppSidebarProps {
  openCommand: (open: boolean) => void
}

export default function AppSidebar({ openCommand }: AppSidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()

  // Navigation items grouped by category
  const navigationGroups = [
    {
      label: null,
      items: [
        {
          title: 'Overview',
          url: '/',
          icon: Lucide.LayoutDashboard,
        },
      ],
    },
    {
      label: 'Database',
      items: [
        {
          title: 'Table Editor',
          url: '/database/table-editor',
          icon: Lucide.Table2,
        },
        {
          title: 'SQL Console',
          url: '/database/sql-console',
          icon: Lucide.SquareChartGantt,
        },
        {
          title: 'Schema Diagram',
          url: '/database/schema-diagram',
          icon: Lucide.Proportions,
        },
      ],
    },
    {
      label: 'Content',
      items: [
        {
          title: 'Collections',
          url: '/content/collections',
          icon: Lucide.Layers,
        },
        {
          title: 'Media Library',
          url: '/content/media',
          icon: Lucide.Image,
        },
      ],
    },
    {
      label: 'Authentication',
      items: [
        {
          title: 'Users',
          url: '/auth/users',
          icon: Lucide.Users,
        },
        {
          title: 'Roles',
          url: '/auth/roles',
          icon: Lucide.Shield,
        },
        {
          title: 'Permissions',
          url: '/auth/permissions',
          icon: Lucide.Lock,
        },
      ],
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
        {navigationGroups.map((group) => (
          <SidebarGroup key={group.label}>
            {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
            <SidebarGroupAction className="sr-only">
              <Lucide.Plus />
              <span className="sr-only">Add {group.label || 'Item'}</span>
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild data-active={item.url === location.pathname}>
                      <Link href={item.url}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => openCommand(true)}>
                <Lucide.Command className="size-4" />
                <span>Open Command</span>
                <SidebarMenuBadge>
                  <Kbd keys={['command']}>K</Kbd>
                </SidebarMenuBadge>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarGroupContent className="border-t pt-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout}>
                <Lucide.LogOut className="size-4" />
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
