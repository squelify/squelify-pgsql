import * as Lucide from 'lucide-react'
import { useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import { clx } from 'twistail-utils'
import { Button } from '#/components/button'
import Link from '#/components/link'
import { Skeleton } from '#/components/skeleton/skeleton'

interface CollectionItems {
  title: string
  items: {
    path: string
    label: string
    icon: React.ComponentType<{ className?: string }>
  }[]
}

export default function CollectionLayout() {
  const location = useLocation()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading state (remove after API integration)
  setTimeout(() => setIsLoading(false), 800)

  const collectionItems: CollectionItems[] = [
    {
      title: 'Single Types',
      items: [],
    },
    {
      title: 'Collection Types',
      items: [],
    },
  ]

  // Flatten all tabs for finding active tab
  const allTabs = collectionItems.flatMap((group) => group.items)
  const activeTab = allTabs.find((tab) => tab.path === location.pathname) || {
    path: location.pathname,
    label: 'Collections',
    icon: Lucide.Layers,
  }

  const hasItems = collectionItems.some((group) => group.items.length > 0)

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
            {isLoading ? (
              <>
                <div>
                  <Skeleton className="mb-2 h-4 w-24" />
                  <div className="grid gap-1">
                    <Skeleton className="h-9 w-full rounded-md" />
                    <Skeleton className="h-9 w-full rounded-md" />
                  </div>
                </div>
                <div>
                  <Skeleton className="mb-2 h-4 w-32" />
                  <div className="grid gap-1">
                    <Skeleton className="h-9 w-full rounded-md" />
                    <Skeleton className="h-9 w-full rounded-md" />
                    <Skeleton className="h-9 w-full rounded-md" />
                  </div>
                </div>
              </>
            ) : (
              collectionItems.map((group) => (
                <div key={group.title}>
                  <h3 className="mb-2 font-medium text-sidebar-foreground/60 text-xs uppercase tracking-wider">
                    {group.title}
                  </h3>
                  <div className="grid gap-1">
                    {group.items.length > 0 ? (
                      group.items.map((tab) => (
                        <Link
                          key={tab.path}
                          href={tab.path}
                          onClick={() => setMobileNavOpen(false)}
                          className={clx(
                            'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                            location.pathname === tab.path
                              ? 'bg-sidebar-primary/50 font-medium text-sidebar-foreground'
                              : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                          )}
                        >
                          <tab.icon className="size-4" />
                          <span>{tab.label}</span>
                        </Link>
                      ))
                    ) : (
                      <div className="flex items-center gap-2 rounded-md px-3 py-2 text-sidebar-foreground/50 text-sm italic">
                        <Lucide.Info className="size-4" />
                        <span>No {group.title.toLowerCase()} available</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </nav>

          {!isLoading && !hasItems && (
            <div className="mt-8 flex flex-col items-center justify-center rounded-md border border-sidebar-foreground/20 border-dashed p-4 text-center">
              <Lucide.FolderPlus className="mb-2 size-5 text-sidebar-foreground/40" />
              <p className="text-sidebar-foreground/60 text-xs">
                No collections found. Create your first collection to get started.
              </p>
            </div>
          )}

          {/* Collection Footer */}
          <div className="mt-auto pt-4 text-sidebar-foreground/50 text-xs">
            {/* TODO: Add content here */}
          </div>
        </div>
      </div>

      {/* Right Panel - Content */}
      <div className="flex-1 overflow-auto">
        <div className="h-full p-4 md:p-6">
          {isLoading ? (
            <div>
              <Skeleton className="mb-2 h-8 w-48" />
              <Skeleton className="mb-6 h-4 w-72" />
              <div className="grid gap-4">
                <Skeleton className="h-32 w-full rounded-md" />
                <Skeleton className="h-32 w-full rounded-md" />
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4 hidden md:mb-6 md:block">
                <h1 className="font-semibold text-xl">{activeTab.label}</h1>
                <p className="mt-1 text-muted-foreground text-sm">
                  Manage your {activeTab.label.toLowerCase()} settings and preferences.
                </p>
              </div>
              <Outlet />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
