import * as Lucide from 'lucide-react'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { clx } from 'twistail-utils'
import { Button } from '#/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/dropdown-menu'
import { Input } from '#/components/input'
import {
  Listbox,
  ListboxContent,
  ListboxItem,
  ListboxTrigger,
  ListboxValue,
} from '#/components/listbox'
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

// Table data interface
interface TableItem {
  name: string
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

  // Table list data
  const tables: TableItem[] = []

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
              {/* Schema Selector Skeleton */}
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
              {/* Schema Selector */}
              <div className="mb-2 flex flex-shrink-0 flex-col items-center justify-between gap-2 border-b pb-3">
                <Listbox defaultValue="public">
                  <ListboxTrigger className="h-8 w-full shadow-none">
                    <ListboxValue placeholder="Choose a schema" />
                  </ListboxTrigger>
                  <ListboxContent>
                    <ListboxItem className="py-1.5" value="auth">
                      auth
                    </ListboxItem>
                    <ListboxItem className="py-1.5" value="public">
                      public
                    </ListboxItem>
                    <ListboxItem className="py-1.5" value="realtime">
                      realtime
                    </ListboxItem>
                    <ListboxItem className="py-1.5" value="storage">
                      storage
                    </ListboxItem>
                  </ListboxContent>
                </Listbox>
                <Button variant="outline" size="sm" className="h-8 w-full justify-start gap-2">
                  <Lucide.CopyPlus className="size-3.5" />
                  <span>New Table</span>
                </Button>
              </div>

              {/* Table List */}
              <div className="-mx-3 flex-grow overflow-hidden">
                {tables.length > 0 ? (
                  <ScrollArea className="size-full space-y-1">
                    {tables.map((table) => (
                      <Button
                        key={table.name}
                        size="sm"
                        variant="ghost"
                        className="w-full justify-start gap-2 pl-3 font-normal hover:bg-sidebar-accent active:font-medium"
                      >
                        <Lucide.Table2 className="size-3.5" strokeWidth={1.8} />
                        <span>{table.name}</span>
                      </Button>
                    ))}
                  </ScrollArea>
                ) : (
                  <div className="px-3 py-2">
                    <div className="flex flex-col items-center justify-center rounded-md border border-sidebar-foreground/20 border-dashed px-4 py-6 text-center">
                      <Lucide.TableProperties className="mb-2 size-5 text-sidebar-foreground/30" />
                      <p className="text-sidebar-foreground/60 text-xs">
                        No tables found. Create your first table to get started.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Search box */}
              <div className="mt-3 flex-shrink-0 border-t pt-3">
                <div className="flex flex-1 items-center gap-2">
                  <Input placeholder="Search object..." className="h-8 w-full" />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="size-8">
                        <Lucide.Filter className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      <DropdownMenuLabel>Show entity type</DropdownMenuLabel>
                      <DropdownMenuItem>Table</DropdownMenuItem>
                      <DropdownMenuItem>View</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Materialized View</DropdownMenuItem>
                      <DropdownMenuItem>Foreign Table</DropdownMenuItem>
                      <DropdownMenuItem>Partitioned Table</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
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
