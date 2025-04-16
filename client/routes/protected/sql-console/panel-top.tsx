import { consola } from 'consola'
import * as Lucide from 'lucide-react'
import * as React from 'react'
import { clx } from 'twistail-utils'
import { Button } from '#/components/button'
import CodeEditor, { type EditorContextData, type EditorRef } from '#/components/code-editor'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/tabs'
import { EmptyQueryState } from './empty-state'
import { useSqlTabs } from './use-sql-tabs'

interface PanelTopProps {
  toggleLeftPanel: () => void
  isLeftPanelVisible: boolean
  isBottomPanelVisible: boolean
}

export function PanelTop({
  toggleLeftPanel,
  isLeftPanelVisible,
  isBottomPanelVisible,
}: PanelTopProps) {
  const {
    tabs,
    queries,
    activeTab,
    handleTabChange,
    handleQueryChange,
    createNewQueryTab,
    closeTab,
    hasData,
  } = useSqlTabs()

  // Store editor refs for each tab using a callback ref pattern
  const editorRefs = React.useRef<Record<string, EditorRef | null>>({})

  const [isExecuting, setIsExecuting] = React.useState(false)
  const [lastExecutedQuery, setLastExecutedQuery] = React.useState<string>('')

  // Enhanced context data with more realistic database schema
  const editorContextData: EditorContextData = React.useMemo(
    () => ({
      tables: ['users', 'posts', 'comments', 'categories', 'tags', 'post_tags'],
      columns: {
        users: ['id', 'name', 'email', 'password', 'created_at', 'updated_at'],
        posts: ['id', 'title', 'content', 'user_id', 'published', 'created_at', 'updated_at'],
        comments: ['id', 'content', 'user_id', 'post_id', 'created_at'],
        categories: ['id', 'name', 'slug', 'description'],
        tags: ['id', 'name', 'slug'],
        post_tags: ['post_id', 'tag_id'],
      },
    }),
    []
  )

  // Add query execution logic here with debounce
  const handleExecute = React.useCallback(
    async (query: string) => {
      if (isExecuting || query === lastExecutedQuery) return

      setIsExecuting(true)
      setLastExecutedQuery(query)

      try {
        consola.log(`Executing query from ${activeTab} tab:`, query)
        // Simulate API call - in real implementation, this would be an actual API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Update the query for the active tab
        handleQueryChange(activeTab, query)
      } catch (error) {
        consola.error('Query execution failed:', error)
      } finally {
        setIsExecuting(false)

        // Focus the editor after execution
        requestAnimationFrame(() => {
          const currentEditorRef = editorRefs.current[activeTab]
          if (currentEditorRef) {
            currentEditorRef.focus()
          }
        })
      }
    },
    [activeTab, isExecuting, lastExecutedQuery, handleQueryChange]
  )

  // Handle close button click without triggering tab change
  const handleCloseClick = React.useCallback(
    (e: React.MouseEvent, tabId: string) => {
      e.stopPropagation()
      closeTab(tabId)
    },
    [closeTab]
  )

  return (
    <div
      className={clx(
        'flex flex-col overflow-hidden bg-background',
        isBottomPanelVisible ? 'flex-1' : 'h-full'
      )}
    >
      {/* Tab Navigation with Toggle Buttons */}
      <div className="flex items-center justify-between border-border border-b px-1.5 pt-1">
        <div className="flex w-full items-center">
          <Button
            size="icon"
            variant="outline"
            className="mr-1.5 mb-1 size-7"
            onClick={toggleLeftPanel}
            title={isLeftPanelVisible ? 'Hide Left Panel' : 'Show Left Panel'}
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
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  disabled={tab.disabled}
                  className="group flex items-center gap-1.5 py-1.5"
                  title={tab.label}
                >
                  <Lucide.SquareTerminal className="-ml-1 size-4" aria-hidden="true" />
                  <span className="truncate">{tab.label}</span>
                  <div className="ml-0.5 flex items-center">
                    {tab.unsaved ? (
                      <div
                        className="-ml-1 -mr-1.5 relative flex size-4 items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCloseClick(e, tab.id)
                        }}
                      >
                        <span className="absolute inset-0 flex items-center justify-center text-muted-foreground group-hover:opacity-0">
                          <Lucide.Circle className="size-2 fill-current" />
                        </span>
                        <span
                          className={clx(
                            'absolute inset-0 flex cursor-pointer items-center justify-center rounded-full text-muted-foreground opacity-0 transition-opacity',
                            'hover:bg-muted/60 hover:text-foreground focus:opacity-100 focus:outline-none',
                            'group-hover:opacity-60 group-hover:focus:opacity-100 group-hover:hover:opacity-100'
                          )}
                          title={`Close ${tab.label}`}
                        >
                          <Lucide.X className="size-3.5" strokeWidth={2} />
                          <span className="sr-only">Close tab</span>
                        </span>
                      </div>
                    ) : (
                      <div
                        className={clx(
                          '-ml-1 -mr-1.5 flex size-4 cursor-pointer items-center justify-center rounded-full text-muted-foreground opacity-0 transition-opacity',
                          'hover:bg-muted/60 hover:text-foreground focus:opacity-100 focus:outline-none',
                          'group-hover:opacity-60 group-hover:focus:opacity-100 group-hover:hover:opacity-100'
                        )}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCloseClick(e, tab.id)
                        }}
                        title={`Close ${tab.label}`}
                      >
                        <Lucide.X className="size-3.5" strokeWidth={2} />
                        <span className="sr-only">Close tab</span>
                      </div>
                    )}
                  </div>
                </TabsTrigger>
              ))}
              <Button
                size="sm"
                variant="ghost"
                className="mb-1 ml-1 flex h-7 items-center gap-1 px-1 pr-1.5 pl-1"
                onClick={createNewQueryTab}
                title="Create New Query"
              >
                <Lucide.Plus className="size-4" />
                <span>New Query</span>
              </Button>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content Area with Tabs*/}
      <div className="flex-1 overflow-hidden">
        {!hasData ? (
          <EmptyQueryState onCreateNewQuery={createNewQueryTab} />
        ) : (
          <Tabs value={activeTab} className="flex h-full flex-col">
            {tabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="flex-1 overflow-hidden">
                <CodeEditor
                  ref={(ref) => {
                    editorRefs.current[tab.id] = ref
                  }}
                  language="pgsql"
                  value={queries[tab.id]}
                  onChange={(value) => handleQueryChange(tab.id, value)}
                  contextData={editorContextData}
                  placeholder={`-- Write your ${tab.label} query here`}
                  onExecute={handleExecute}
                  isExecuting={isExecuting && activeTab === tab.id}
                  autoFocus={activeTab === tab.id}
                />
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  )
}
