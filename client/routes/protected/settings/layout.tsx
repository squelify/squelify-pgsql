import * as Lucide from 'lucide-react'
import { useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import { clx } from 'twistail-utils'
import { Button } from '#/components/button'
import Link from '#/components/link'

export default function SettingsLayout() {
  const location = useLocation()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const settingsTabs = [
    { path: '/settings/general', label: 'General', icon: Lucide.Settings },
    { path: '/settings/email', label: 'Email', icon: Lucide.Mail },
    { path: '#', label: 'Security', icon: Lucide.ShieldCheck },
    { path: '#', label: 'Appearance', icon: Lucide.Palette },
    { path: '#', label: 'Integrations', icon: Lucide.Plug },
  ]

  const activeTab = settingsTabs.find((tab) => tab.path === location.pathname) || settingsTabs[0]

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
        <div className="p-4">
          <h2 className="mb-4 hidden font-semibold text-lg text-sidebar-foreground md:block">
            System Settings
          </h2>
          <nav className="grid gap-1">
            {settingsTabs.map((tab) => (
              <Link
                key={tab.path}
                href={tab.path}
                onClick={() => setMobileNavOpen(false)}
                className={clx(
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                  location.pathname === tab.path
                    ? 'bg-sidebar-primary/50 font-medium text-sidebar-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-hover hover:text-sidebar-foreground'
                )}
              >
                <tab.icon className="size-4" />
                <span>{tab.label}</span>
              </Link>
            ))}
          </nav>
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
