import * as Lucide from 'lucide-react'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { clx } from 'twistail-utils'
import { Accordion, AccordionItem } from '#/components/accordion'
import { AccordionContent, AccordionTrigger } from '#/components/accordion'
import { Button } from '#/components/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '#/components/dropdown-menu'
import { DropdownMenuTrigger } from '#/components/dropdown-menu'
import { Input } from '#/components/input'
import { ScrollArea } from '#/components/scroll-area'
import { Skeleton } from '#/components/skeleton/skeleton'
import { SplitPane } from '#/components/split-pane'

interface LeftPanelProps {
  position: number
  isDragging: boolean
  separatorProps: React.HTMLAttributes<HTMLDivElement>
  isVisible: boolean
  toggleVisibility: () => void
  setPosition: (position: number) => void
}

// Query item interface
interface QueryItem {
  id: string
  name: string
  sql: string
}

// Category interface for organizing queries
interface QueryCategory {
  id: string
  name: string
  icon: React.ReactNode
  items: QueryItem[]
  emptyMessage: string
}

export function LeftPanel({
  position: leftPanelWidth,
  isDragging: isLeftPanelDragging,
  separatorProps: leftPanelSeparatorProps,
  // isVisible: isPanelVisible,
  // toggleVisibility: toggleLeftVisibility,
  // setPosition: setLeftPanelWidth,
}: LeftPanelProps) {
  // Determine if the panel is actually visible based on width
  const isLeftPanelVisible = leftPanelWidth > 0
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading state (remove after API integration)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  // Query categories with empty arrays for items
  const queryCategories: QueryCategory[] = [
    {
      id: 'favorites',
      name: 'Favorites',
      icon: <Lucide.BookmarkPlus className="size-3.5" />,
      items: [],
      emptyMessage: 'No favorite queries yet. Star your frequently used queries for quick access.',
    },
    {
      id: 'private',
      name: 'Private',
      icon: <Lucide.FileCode2 className="size-3.5" />,
      items: [],
      emptyMessage: 'No private queries found. Create a new query to get started.',
    },
    {
      id: 'shared',
      name: 'Shared',
      icon: <Lucide.GitCompare className="size-3.5" />,
      items: [],
      emptyMessage: 'No shared queries available. Share queries with your team for collaboration.',
    },
  ]

  return (
    <>
      <div
        className={clx(
          'h-full shrink-0 bg-sidebar transition-all duration-200 ease-in-out',
          isLeftPanelDragging && 'transition-none',
          !isLeftPanelVisible && 'opacity-0'
        )}
        style={{ width: `${leftPanelWidth}px` }}
      >
        <div className="flex h-full flex-col overflow-y-auto p-3">
          {isLoading ? (
            <>
              <div className="mb-2 flex flex-shrink-0 flex-col items-center justify-between gap-2 border-b pb-3">
                <Skeleton className="h-8 w-full rounded-md" />
                <Skeleton className="h-8 w-full rounded-md" />
              </div>

              {/* Table List Skeleton */}
              <div className="-mx-3 flex-grow overflow-hidden">
                <div className="space-y-1 p-3">
                  {Array(8)
                    .fill(0)
                    .map((val) => (
                      <Skeleton key={val} className="h-8 w-full rounded-md" />
                    ))}
                </div>
              </div>

              {/* Search box Skeleton */}
              <div className="mt-3 flex-shrink-0 border-t pt-3">
                <div className="flex flex-1 items-center gap-2">
                  <Skeleton className="h-8 w-full rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-2 flex-shrink-0 border-b pb-3">
                <div className="flex flex-1 items-center gap-2">
                  <Input placeholder="Search queries..." className="h-8 w-full" />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="size-8">
                        <Lucide.CopyPlus className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Lucide.FolderPlus className="size-3.5" />
                        <span>Create new folder</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Lucide.FileText className="size-3.5" />
                        <span>Create new query</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Quick Start and Templates links */}
              <div className="-mx-3 flex flex-col gap-1.5 border-b pb-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full justify-start gap-2 text-xs hover:bg-sidebar-accent"
                >
                  <Lucide.Zap className="size-3.5" />
                  <span>Quick Start</span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full justify-start gap-2 text-xs hover:bg-sidebar-accent"
                >
                  <Lucide.FileScan className="size-3.5" />
                  <span>Templates</span>
                </Button>
              </div>

              {/* Query List */}
              <div className="-mx-3 flex-grow overflow-hidden">
                <ScrollArea className="size-full">
                  <Accordion type="multiple" className="w-full" defaultValue={['favorites']}>
                    {queryCategories.map((category) => (
                      <AccordionItem key={category.id} value={category.id} className="border-none">
                        <AccordionTrigger
                          className="justify-start rounded-md border-border border-b bg-sidebar-accent/20 px-3 py-2.5 text-xs hover:bg-sidebar-accent/30"
                          triggerClassName="group-data-[state=open]:rotate-90"
                          triggerIcon={Lucide.ChevronRight}
                          triggerPosition="left"
                        >
                          {category.name}
                        </AccordionTrigger>
                        <AccordionContent>
                          <ScrollArea
                            className={clx(
                              '-mb-4 absolute inset-0 size-full border-border border-b',
                              category.items.length > 0 ? 'h-72' : 'h-auto'
                            )}
                          >
                            {category.items.length > 0 ? (
                              <div className="space-y-1 py-1">
                                {category.items.map((query) => (
                                  <Button
                                    key={query.id}
                                    size="sm"
                                    variant="ghost"
                                    className="w-full justify-start gap-2 pl-4 font-normal text-xs hover:bg-sidebar-accent active:font-medium"
                                  >
                                    <Lucide.FileText className="size-3.5" strokeWidth={1.8} />
                                    <span className="truncate">{query.name}</span>
                                  </Button>
                                ))}
                              </div>
                            ) : (
                              <div className="px-3 py-4">
                                <div className="flex flex-col items-center justify-center rounded-md border border-sidebar-foreground/20 border-dashed px-4 py-6 text-center">
                                  {category.icon}
                                  <p className="mt-2 text-sidebar-foreground/60 text-xs">
                                    {category.emptyMessage}
                                  </p>
                                </div>
                              </div>
                            )}
                          </ScrollArea>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </ScrollArea>
              </div>

              <div className="mt-2 flex-shrink-0 border-t pt-2">
                <Button size="sm" variant="ghost" className="w-full hover:bg-sidebar-accent">
                  <span>View all running queries</span>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Left Panel Separator */}
      {isLeftPanelVisible && (
        <SplitPane.Separator
          {...leftPanelSeparatorProps}
          isDragging={isLeftPanelDragging}
          orientation="horizontal"
        />
      )}
    </>
  )
}
