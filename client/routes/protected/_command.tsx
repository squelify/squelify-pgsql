import * as Lucide from 'lucide-react'
import { useNavigate } from 'react-router'
import { CommandDialog, CommandEmpty, CommandGroup } from '#/components/command/command'
import { CommandInput, CommandItem, CommandList } from '#/components/command/command'
import { CommandSeparator, CommandShortcut } from '#/components/command/command'
import { toast } from '#/components/toast'
import { useTheme } from '#/context/hooks/use-theme'

interface AppCommandProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function AppCommand({ open, setOpen }: AppCommandProps) {
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()

  const handleLogout = () => {
    localStorage.removeItem('squelify_user')
    sessionStorage.removeItem('squelify_user')
    toast.success('You have been logged out')
    navigate('/login')
    setOpen(false)
  }

  const commandGroups = [
    {
      id: 'main-nav',
      heading: 'Overview',
      items: [
        {
          id: 'overview',
          icon: Lucide.LayoutDashboard,
          label: 'Overview',
          keywords: ['dashboard', 'home', 'main', 'landing'],
          onSelect: () => {
            navigate('/')
            setOpen(false)
          },
          shortcut: '/',
        },
      ],
      showSeparator: true,
    },
    {
      id: 'database',
      heading: 'Database',
      items: [
        {
          id: 'table-editor',
          icon: Lucide.Table2,
          label: 'Table Editor',
          keywords: ['database', 'tables', 'schema', 'edit', 'structure'],
          onSelect: () => {
            navigate('/database/table-editor')
            setOpen(false)
          },
          shortcut: '/db/table',
        },
        {
          id: 'sql-console',
          icon: Lucide.SquareChartGantt,
          label: 'SQL Console',
          keywords: ['database', 'query', 'sql', 'console', 'command'],
          onSelect: () => {
            navigate('/database/sql-console')
            setOpen(false)
          },
          shortcut: '/db/sql',
        },
        {
          id: 'schema-diagram',
          icon: Lucide.Proportions,
          label: 'Schema Diagram',
          keywords: ['database', 'schema', 'diagram', 'erd', 'structure', 'visual'],
          onSelect: () => {
            navigate('/database/schema-diagram')
            setOpen(false)
          },
          shortcut: '/db/schema',
        },
      ],
      showSeparator: true,
    },
    {
      id: 'content',
      heading: 'Content',
      items: [
        {
          id: 'collections',
          icon: Lucide.Layers,
          label: 'Collections',
          keywords: ['content', 'collections', 'data', 'entries'],
          onSelect: () => {
            navigate('/content/collections')
            setOpen(false)
          },
          shortcut: '/content',
        },
        {
          id: 'media-library',
          icon: Lucide.Image,
          label: 'Media Library',
          keywords: ['content', 'media', 'images', 'files', 'assets', 'upload'],
          onSelect: () => {
            navigate('/content/media')
            setOpen(false)
          },
          shortcut: '/media',
        },
      ],
      showSeparator: true,
    },
    {
      id: 'authentication',
      heading: 'Authentication',
      items: [
        {
          id: 'users',
          icon: Lucide.Users,
          label: 'Users',
          keywords: ['auth', 'users', 'accounts', 'people', 'authentication'],
          onSelect: () => {
            navigate('/auth/users')
            setOpen(false)
          },
          shortcut: '/users',
        },
        {
          id: 'roles',
          icon: Lucide.Shield,
          label: 'Roles',
          keywords: ['auth', 'roles', 'permissions', 'access', 'authentication'],
          onSelect: () => {
            navigate('/auth/roles')
            setOpen(false)
          },
          shortcut: '/roles',
        },
        {
          id: 'permissions',
          icon: Lucide.Lock,
          label: 'Permissions',
          keywords: ['auth', 'permissions', 'access', 'security', 'authentication'],
          onSelect: () => {
            navigate('/auth/permissions')
            setOpen(false)
          },
          shortcut: '/perms',
        },
      ],
      showSeparator: true,
    },
    {
      id: 'miscellaneous',
      heading: 'Miscellaneous',
      items: [
        {
          id: 'toggle-theme',
          icon: theme === 'dark' ? Lucide.Sun : Lucide.Moon,
          label: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`,
          keywords: ['theme', 'dark', 'light', 'mode', 'appearance', 'display'],
          onSelect: () => {
            setTheme(theme === 'dark' ? 'light' : 'dark')
            setOpen(false)
          },
          shortcut: '⌘+T',
        },
        {
          id: 'help',
          icon: Lucide.HelpCircle,
          label: 'Help & Documentation',
          keywords: ['help', 'docs', 'documentation', 'support', 'guide'],
          onSelect: () => {
            window.open('https://squelify.com/docs', '_blank')
            setOpen(false)
          },
          shortcut: '⌘+H',
        },
      ],
      showSeparator: true,
    },
    {
      id: 'account',
      heading: 'Account',
      items: [
        {
          id: 'profile',
          icon: Lucide.UserCircle,
          label: 'Profile Settings',
          keywords: ['account', 'profile', 'settings', 'user', 'personal'],
          onSelect: () => {
            navigate('/profile')
            setOpen(false)
          },
          shortcut: '/profile',
        },
        {
          id: 'logout',
          icon: Lucide.LogOut,
          label: 'Logout',
          keywords: ['account', 'logout', 'sign out', 'exit', 'quit'],
          onSelect: handleLogout,
          shortcut: '⌘+L',
        },
      ],
      showSeparator: false,
    },
  ]

  // Implementation of fuzzy search algorithm
  const fuzzyFilter = (value: string, search: string, keywords?: string[]): number => {
    // If search is empty, show all items
    if (!search.trim()) return 1

    // Convert to lowercase for case-insensitive search
    const searchLower = search.toLowerCase()
    const valueLower = value.toLowerCase()

    // Exact match gets highest score
    if (valueLower === searchLower) return 2

    // If value contains search as a substring, give high score
    if (valueLower.includes(searchLower)) return 1.5

    // Check if all search characters exist in value in sequence
    let searchIndex = 0
    let valueIndex = 0

    while (searchIndex < searchLower.length && valueIndex < valueLower.length) {
      if (searchLower[searchIndex] === valueLower[valueIndex]) {
        searchIndex++
      }
      valueIndex++
    }

    // If all search characters were found in sequence
    if (searchIndex === searchLower.length) return 1

    // Check keywords if available
    if (keywords?.some((keyword) => keyword.toLowerCase().includes(searchLower))) {
      return 0.5
    }

    return 0
  }

  return (
    <CommandDialog open={open} modal={true} onOpenChange={setOpen} filter={fuzzyFilter}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found</CommandEmpty>
        {commandGroups.map((group) => (
          <div key={group.id}>
            <CommandGroup heading={group.heading}>
              {group.items.map((item) => (
                <CommandItem key={item.id} onSelect={item.onSelect} keywords={item.keywords}>
                  <item.icon className="mr-2 size-4" strokeWidth={2} />
                  <span>{item.label}</span>
                  {item.shortcut && <CommandShortcut>{item.shortcut}</CommandShortcut>}
                </CommandItem>
              ))}
            </CommandGroup>
            {group.showSeparator && <CommandSeparator />}
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  )
}
