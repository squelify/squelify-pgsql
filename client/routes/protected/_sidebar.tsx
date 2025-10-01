import * as Lucide from 'lucide-react'
import { useLocation } from 'react-router'
import { Kbd } from '#/components/kbd'
import Link from '#/components/link'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '#/components/sidebar'
import AppLogo from '/favicon.svg'

interface AppSidebarProps {
  openCommand: (open: boolean) => void
}

export default function AppSidebar({ openCommand }: AppSidebarProps) {
  const location = useLocation()

  // Primary navigation items
  const primaryNavigation = [
    {
      label: null,
      items: [{ title: 'Overview', url: '/', icon: Lucide.LayoutDashboard }],
    },
    {
      label: 'Database',
      items: [
        { title: 'Table  Editor', url: '/table-editor', icon: Lucide.Table2 },
        { title: 'SQL Console', url: '/sql-console', icon: Lucide.SquareChartGantt },
        { title: 'Schema Diagram', url: '/schema-diagram', icon: Lucide.Proportions },
      ],
    },
    {
      label: 'Content',
      items: [
        { title: 'Collections', url: '/collections', icon: Lucide.Layers },
        { title: 'Media Library', url: '/media-library', icon: Lucide.Image },
        { title: 'Functions', url: '/functions', icon: Lucide.FunctionSquare },
      ],
    },
    {
      label: 'Authentication',
      items: [
        { title: 'Users', url: '/auth/users', icon: Lucide.Users },
        { title: 'Roles', url: '/auth/roles', icon: Lucide.ShieldEllipsis },
        { title: 'Permissions', url: '/auth/permissions', icon: Lucide.Lock },
        { title: 'API Keys', url: '/auth/api-keys', icon: Lucide.GlobeLock },
      ],
    },
  ]

  // Secondary navigation items
  const secondaryNavigation = [
    { title: 'Audit Log', url: '/audit-log', icon: Lucide.FileClock },
    { title: 'Settings', url: '/settings', icon: Lucide.Settings },
  ]

  return (
    <Sidebar className="pt-14" collapsible="icon">
      <SidebarHeader className="md:hidden">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-start px-1 py-2">
            <img src={AppLogo} alt="Squelify Logo" className="size-7 text-primary" />
            <span className="inline-block font-bold text-lg">Squelify</span>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {primaryNavigation.map((group) => (
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
                    <SidebarMenuButton
                      data-active={
                        item.url === '/'
                          ? location.pathname === '/'
                          : location.pathname === item.url ||
                            location.pathname.startsWith(`${item.url}/`)
                      }
                      tooltip={item.title}
                      asChild
                    >
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
        <SidebarGroupLabel className="sr-only">System</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {secondaryNavigation.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  data-active={
                    item.url === '/'
                      ? location.pathname === '/'
                      : location.pathname === item.url ||
                        location.pathname.startsWith(`${item.url}/`)
                  }
                  tooltip={item.title}
                  asChild
                >
                  <Link href={item.url}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarGroupContent className="hidden border-t pt-2 sm:block">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Quick Action" onClick={() => openCommand(true)}>
                <Lucide.Command className="size-4" />
                <span>Quick Action</span>
                <SidebarMenuBadge>
                  <Kbd keys={['command']}>K</Kbd>
                </SidebarMenuBadge>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
