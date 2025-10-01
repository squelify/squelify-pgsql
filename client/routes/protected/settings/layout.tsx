import * as Lucide from 'lucide-react'
import { useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import { clx } from 'twistail-utils'
import { Button } from '#/components/button'
import Link from '#/components/link'
import pkg from '~~/package.json' with { type: 'json' }
import { AboutDialog } from './about'

export default function SettingsLayout() {
  const location = useLocation()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const settingsMenu = [
    {
      title: 'System Settings',
      items: [
        { path: '/settings/application', label: 'Application', icon: Lucide.AppWindow },
        { path: '/settings/authentication', label: 'Authentication', icon: Lucide.LockKeyhole },
        { path: '/settings/storage', label: 'Storage & Media', icon: Lucide.ImageUp },
        { path: '/settings/email', label: 'SMTP Mailer', icon: Lucide.Mail },
        { path: '/settings/integrations', label: 'Integrations', icon: Lucide.Plug },
        { path: '/settings/scheduler', label: 'Scheduler', icon: Lucide.TimerReset },
        { path: '/settings/webhooks', label: 'Webhooks', icon: Lucide.Webhook },
      ],
    },
    {
      title: 'Sync & Backup',
      items: [
        { path: '/settings/backup', label: 'Backup Database', icon: Lucide.Archive },
        { path: '/settings/restore', label: 'Restore Database', icon: Lucide.ArchiveRestore },
      ],
    },
    {
      title: 'Account Settings',
      items: [
        { path: '/settings/profile', label: 'Profile', icon: Lucide.User },
        { path: '/settings/security', label: 'Security', icon: Lucide.ShieldEllipsis },
        { path: '/settings/preferences', label: 'Preferences', icon: Lucide.Settings2 },
        { path: '/settings/activity-log', label: 'Activity Log', icon: Lucide.Activity },
      ],
    },
    {
      title: 'Administrator',
      items: [
        { path: '/settings/administrator', label: 'Manage Users', icon: Lucide.UsersRound },
        { path: '/settings/admin-roles', label: 'Manage Roles', icon: Lucide.ShieldUser },
      ],
    },
  ]

  // Flatten all tabs for finding active tab
  const allTabs = settingsMenu.flatMap((group) => group.items)
  const activeTab = allTabs.find((tab) => tab.path === location.pathname) || allTabs[0]

  return (
    <div className="flex size-full flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="flex items-center justify-between border-b px-4 py-2 md:hidden">
        <h1 className="font-semibold text-lg">{activeTab.label} Settings</h1>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-label="Toggle settings menu"
        >
          <Lucide.Menu className="size-5" />
        </Button>
      </div>

      {/* Left Panel - Vertical Tabs */}
      <div
        className={clx(
          'w-full border-b bg-sidebar md:w-64 md:flex-shrink-0 md:border-r md:border-b-0',
          mobileNavOpen ? 'block' : 'hidden md:block'
        )}
      >
        <div className="flex h-full flex-col p-4">
          <nav className="grid gap-8">
            {settingsMenu.map((group) => (
              <div key={group.title}>
                <h3 className="mb-2 font-medium text-sidebar-foreground/60 text-xs uppercase tracking-wider">
                  {group.title}
                </h3>
                <div className="grid gap-1">
                  {group.items.map((tab) => (
                    <Link
                      key={tab.path}
                      href={tab.path}
                      onClick={() => setMobileNavOpen(false)}
                      className={clx(
                        'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                        location.pathname === tab.path
                          ? 'bg-sidebar-primary/80 font-medium text-sidebar-foreground'
                          : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                      )}
                    >
                      <tab.icon className="size-4" />
                      <span>{tab.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Version Information as Dialog */}
          <div className="mt-auto pt-4 text-sidebar-foreground/50 text-xs">
            <div className="flex items-center justify-between pr-2 pl-1">
              <AboutDialog />
              <Link
                href={pkg.homepage}
                className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-sidebar-foreground"
                newTab
              >
                <Lucide.Github className="size-3" />
                <span>GitHub</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Content */}
      <div className="flex-1 overflow-auto">
        <div className="h-full p-4 md:p-6">
          <div className="mb-4 hidden md:mb-6 md:block">
            <h1 className="font-semibold text-xl">{activeTab.label}</h1>
            <p className="mt-1 text-muted-foreground text-sm">
              Manage your {activeTab.label.toLowerCase()} settings and preferences.
            </p>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
