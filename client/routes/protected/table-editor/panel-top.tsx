import { useSeoMeta } from '@unhead/react'
import * as Lucide from 'lucide-react'
import { useQueryState } from 'nuqs'
import * as React from 'react'
import { Outlet } from 'react-router'
import { clx } from 'twistail-utils'
import { Button } from '#/components/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/tabs'

interface PanelTopProps {
  toggleLeftPanel: () => void
  toggleBottomPanel: () => void
  isLeftPanelVisible: boolean
  isBottomPanelVisible: boolean
}

export function PanelTop({
  toggleLeftPanel,
  toggleBottomPanel,
  isLeftPanelVisible,
  isBottomPanelVisible,
}: PanelTopProps) {
  // Use nuqs for tab state management
  const [activeTab, setActiveTab] = useQueryState('tab', { defaultValue: 'structure' })

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <div className={clx('overflow-auto bg-background', isBottomPanelVisible ? 'flex-1' : 'h-full')}>
      <div className="h-full p-0">
        {/* Tab Navigation with Toggle Buttons */}
        <div className="flex items-center justify-between border-border border-b px-1.5 pt-1">
          <div className="flex w-full items-center">
            <Button
              size="icon"
              variant="outline"
              className="mr-1.5 mb-0.5 size-8"
              onClick={toggleLeftPanel}
            >
              {isLeftPanelVisible ? (
                <>
                  <Lucide.PanelLeftClose className="size-4" />
                  <span className="sr-only">Hide Left Panel</span>
                </>
              ) : (
                <>
                  <Lucide.PanelLeftOpen className="size-4" />
                  <span className="sr-only">Show Left Panel</span>
                </>
              )}
            </Button>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="mr-2 w-full">
              <TabsList variant="curved" className="before:bg-transparent">
                <TabsTrigger value="structure">Structure</TabsTrigger>
                <TabsTrigger value="data">Data</TabsTrigger>
                <TabsTrigger value="indexes">Indexes</TabsTrigger>
                <TabsTrigger value="constraints">Constraints</TabsTrigger>
                <TabsTrigger value="relations">Relations</TabsTrigger>
                <TabsTrigger value="sql" disabled>
                  SQL
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="mb-0.5 ml-1.5 size-8"
            onClick={toggleBottomPanel}
          >
            {isBottomPanelVisible ? (
              <>
                <Lucide.PanelBottom className="size-4" />
                <span className="sr-only">Hide Bottom Panel</span>
              </>
            ) : (
              <>
                <Lucide.PanelBottomOpen className="size-4" />
                <span className="sr-only">Show Bottom Panel</span>
              </>
            )}
          </Button>
        </div>

        {/* Content Area with Outlet for nested routes */}
        <Tabs value={activeTab} className="h-max w-full p-2">
          <TabsContent value="structure">
            <span>Content structure</span>
          </TabsContent>
          <TabsContent value="data">
            <span>Content data</span>
          </TabsContent>
          <TabsContent value="indexes">
            <span>Content indexes</span>
          </TabsContent>
          <TabsContent value="constraints">
            <span>Content constraints</span>
          </TabsContent>
          <TabsContent value="relations">
            <span>Content relations</span>
          </TabsContent>
          <TabsContent value="sql">
            <span>Content SQL</span>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
