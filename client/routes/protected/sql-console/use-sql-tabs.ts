import { consola } from 'consola'
import { useQueryState } from 'nuqs'
import * as React from 'react'

/**
 * Definition for a SQL query tab
 */
interface TabDefinition {
  id: string
  label: string
  defaultQuery: string
  disabled?: boolean
  unsaved?: boolean
}

/**
 * Hook to manage SQL query tabs
 */
export function useSqlTabs() {
  const [activeTab, setActiveTab] = useQueryState('id', {
    defaultValue: '91805e77-f5db-520f-84c2-d99980897c40',
  })

  // Define default tabs with their queries
  const [tabs, setTabs] = React.useState<TabDefinition[]>(() => [
    {
      id: '91805e77-f5db-520f-84c2-d99980897c40',
      label: 'Query 1',
      defaultQuery:
        "SELECT table_name, column_name, data_type, is_nullable\nFROM information_schema.columns\nWHERE table_schema = 'public'\nORDER BY table_name, ordinal_position;",
    },
    {
      id: '254a2d1a-2902-50ec-8a6a-092f518f62dc',
      label: 'Query 2',
      defaultQuery: 'SELECT * FROM users LIMIT 100;',
    },
    {
      id: 'da25367c-7047-571f-a654-6c8889b92434',
      label: 'Query 3',
      defaultQuery:
        "SELECT\n  i.relname as index_name,\n  t.relname as table_name,\n  a.attname as column_name,\n  ix.indisunique as is_unique\nFROM\n  pg_class i\n  JOIN pg_index ix ON i.oid = ix.indexrelid\n  JOIN pg_class t ON ix.indrelid = t.oid\n  JOIN pg_attribute a ON t.oid = a.attrelid AND a.attnum = ANY(ix.indkey)\nWHERE\n  t.relkind = 'r'\n  AND t.relname NOT LIKE 'pg_%'\n  AND t.relname NOT LIKE 'sql_%'\nORDER BY\n  t.relname, i.relname;",
    },
    {
      id: 'e7748bcc-4f31-5e89-9cf6-ae3c6a25489f',
      label: 'Query 4',
      defaultQuery:
        "SELECT\n  tc.constraint_name,\n  tc.table_name,\n  tc.constraint_type,\n  kcu.column_name,\n  ccu.table_name AS foreign_table_name,\n  ccu.column_name AS foreign_column_name\nFROM\n  information_schema.table_constraints tc\n  LEFT JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name\n  LEFT JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name\nWHERE\n  tc.constraint_type IN ('PRIMARY KEY', 'FOREIGN KEY', 'UNIQUE')\nORDER BY\n  tc.table_name, tc.constraint_type;",
    },
    {
      id: '08778b31-3a49-5565-942b-625baa0cf7d7',
      label: 'Query 5',
      defaultQuery:
        "SELECT\n  c.conname AS constraint_name,\n  tbl.relname AS table_name,\n  col.attname AS column_name,\n  referenced_tbl.relname AS referenced_table_name,\n  referenced_col.attname AS referenced_column_name\nFROM\n  pg_constraint c\n  JOIN pg_namespace nsp ON nsp.oid = c.connamespace\n  JOIN pg_class tbl ON tbl.oid = c.conrelid\n  JOIN pg_attribute col ON col.attrelid = c.conrelid AND col.attnum = ANY(c.conkey)\n  JOIN pg_class referenced_tbl ON referenced_tbl.oid = c.confrelid\n  JOIN pg_attribute referenced_col ON referenced_col.attrelid = c.confrelid AND referenced_col.attnum = ANY(c.confkey)\nWHERE\n  c.contype = 'f'\n  AND nsp.nspname = 'public'\nORDER BY\n  tbl.relname, c.conname;",
    },
  ])

  // Store queries for each tab - using localStorage for persistence
  const [queries, setQueries] = React.useState<Record<string, string>>(() => {
    // Try to load saved queries from localStorage
    try {
      const savedQueries = localStorage.getItem('sql-console-queries')
      if (savedQueries) {
        const parsed = JSON.parse(savedQueries)
        // Merge with default queries to ensure we have all tabs covered
        return tabs.reduce(
          (acc, tab) => {
            acc[tab.id] = parsed[tab.id] || tab.defaultQuery
            return acc
          },
          {} as Record<string, string>
        )
      }
    } catch (error) {
      consola.error('Failed to load saved queries:', error)
    }

    // Initialize with default queries if localStorage fails
    return tabs.reduce(
      (acc, tab) => {
        acc[tab.id] = tab.defaultQuery
        return acc
      },
      {} as Record<string, string>
    )
  })

  // Save queries to localStorage when they change
  React.useEffect(() => {
    try {
      localStorage.setItem('sql-console-queries', JSON.stringify(queries))
    } catch (error) {
      consola.error('Failed to save queries:', error)
    }
  }, [queries])

  // Handle tab change with memoization
  const handleTabChange = React.useCallback(
    (value: string) => {
      setActiveTab(value)
    },
    [setActiveTab]
  )

  // Handle query change for a specific tab with debounce
  const handleQueryChange = React.useCallback((tabId: string, query: string) => {
    setQueries((prev) => ({
      ...prev,
      [tabId]: query,
    }))

    // Mark tab as unsaved
    setTabs((prevTabs) =>
      prevTabs.map((tab) => (tab.id === tabId ? { ...tab, unsaved: true } : tab))
    )
  }, [])

  // Generate a new unique ID for new query tab
  const createNewQueryTab = React.useCallback(() => {
    const newId = crypto.randomUUID()
    const newTabNumber = tabs.length + 1
    const newTabLabel = `Query ${newTabNumber}`

    const newTab: TabDefinition = {
      id: newId,
      label: newTabLabel,
      defaultQuery: '-- Write your custom SQL query here\n\n',
      unsaved: true,
    }

    // Add the new tab to tabs list
    setTabs((prevTabs) => [...prevTabs, newTab])

    // Update queries state with the new tab
    setQueries((prev) => ({
      ...prev,
      [newId]: newTab.defaultQuery,
    }))

    // Set the new tab as active
    setActiveTab(newId)
  }, [tabs, setActiveTab])

  // Close a tab
  const closeTab = React.useCallback(
    (tabId: string) => {
      // Don't allow closing the last tab
      if (tabs.length <= 1) {
        return
      }

      // Find the tab to close
      const tabIndex = tabs.findIndex((tab) => tab.id === tabId)
      if (tabIndex === -1) return

      // If closing the active tab, switch to another tab
      if (tabId === activeTab) {
        // Determine which tab to activate next
        const newActiveIndex = tabIndex === 0 ? 1 : tabIndex - 1
        const newActiveTab = tabs[newActiveIndex].id
        setActiveTab(newActiveTab)
      }

      // Remove the tab from the tabs array
      setTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== tabId))

      // Remove the query from queries object
      setQueries((prevQueries) => {
        const newQueries = { ...prevQueries }
        delete newQueries[tabId]
        return newQueries
      })
    },
    [tabs, activeTab, setActiveTab]
  )

  // Check if there's any data
  const hasData = tabs.length > 0

  return {
    tabs,
    queries,
    activeTab,
    handleTabChange,
    handleQueryChange,
    createNewQueryTab,
    closeTab,
    hasData,
  }
}
