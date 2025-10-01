import * as Lucide from 'lucide-react'
import { useNavigate } from 'react-router'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '#/components/command/command'
import { ScrollArea } from '#/components/scroll-area'
import { toast } from '#/components/toast'
import { useTheme } from '#/context/hooks/use-theme'

interface AppCommandProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function AppCommand({ open, setOpen }: AppCommandProps) {
  const { setTheme, resolvedTheme } = useTheme()
  const navigate = useNavigate()

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
          shortcut: 'g h', // go home
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
            navigate('/table-editor')
            setOpen(false)
          },
          shortcut: 'g t', // go tables
        },
        {
          id: 'sql-console',
          icon: Lucide.SquareChartGantt,
          label: 'SQL Console',
          keywords: ['database', 'query', 'sql', 'console', 'command'],
          onSelect: () => {
            navigate('/sql-console')
            setOpen(false)
          },
          shortcut: 'g s', // go sql
        },
        {
          id: 'schema-diagram',
          icon: Lucide.Proportions,
          label: 'Schema Diagram',
          keywords: ['database', 'schema', 'diagram', 'erd', 'structure', 'visual'],
          onSelect: () => {
            navigate('/schema-diagram')
            setOpen(false)
          },
          shortcut: 'g d', // go diagram
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
            navigate('/collections')
            setOpen(false)
          },
          shortcut: 'g c', // go collections
        },
        {
          id: 'media-library',
          icon: Lucide.Image,
          label: 'Media Library',
          keywords: ['content', 'media', 'images', 'files', 'assets', 'upload'],
          onSelect: () => {
            navigate('/media-library')
            setOpen(false)
          },
          shortcut: 'g m', // go media
        },
        {
          id: 'functions',
          icon: Lucide.FunctionSquare,
          label: 'Functions',
          keywords: ['content', 'functions', 'serverless', 'code', 'logic'],
          onSelect: () => {
            navigate('/functions')
            setOpen(false)
          },
          shortcut: 'g f', // go functions
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
          shortcut: 'g u', // go users
        },
        {
          id: 'roles',
          icon: Lucide.ShieldEllipsis,
          label: 'Roles',
          keywords: ['auth', 'roles', 'permissions', 'access', 'authentication'],
          onSelect: () => {
            navigate('/auth/roles')
            setOpen(false)
          },
          shortcut: 'g r', // go roles
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
          shortcut: 'g p', // go permissions
        },
        {
          id: 'api-keys',
          icon: Lucide.GlobeLock,
          label: 'API Keys',
          keywords: ['auth', 'api', 'keys', 'tokens', 'access', 'security'],
          onSelect: () => {
            navigate('/auth/api-keys')
            setOpen(false)
          },
          shortcut: 'g k', // go keys
        },
      ],
      showSeparator: true,
    },
    {
      id: 'system',
      heading: 'System',
      items: [
        {
          id: 'audit-log',
          icon: Lucide.FileClock,
          label: 'Audit Log',
          keywords: ['audit', 'log', 'history', 'activity', 'system'],
          onSelect: () => {
            navigate('/audit-log')
            setOpen(false)
          },
          shortcut: 'g a', // go audit
        },
        {
          id: 'system-settings',
          icon: Lucide.Settings,
          label: 'System Settings',
          keywords: ['settings', 'preferences', 'options', 'system'],
          onSelect: () => {
            navigate('/settings')
            setOpen(false)
          },
          shortcut: 'g o', // go options/settings
        },
      ],
      showSeparator: true,
    },
    {
      id: 'settings',
      heading: 'Settings',
      items: [
        {
          id: 'application-settings',
          icon: Lucide.AppWindow,
          label: 'Application Settings',
          keywords: ['settings', 'application', 'config', 'system'],
          onSelect: () => {
            navigate('/settings/application')
            setOpen(false)
          },
          shortcut: 's a', // settings application
        },
        {
          id: 'authentication-settings',
          icon: Lucide.LockKeyhole,
          label: 'Authentication Settings',
          keywords: ['settings', 'authentication', 'login', 'security'],
          onSelect: () => {
            navigate('/settings/authentication')
            setOpen(false)
          },
          shortcut: 's u', // settings auth
        },
        {
          id: 'storage-settings',
          icon: Lucide.ImageUp,
          label: 'Storage & Media',
          keywords: ['settings', 'storage', 'media', 'files', 'upload'],
          onSelect: () => {
            navigate('/settings/storage')
            setOpen(false)
          },
          shortcut: 's s', // settings storage
        },
        {
          id: 'email-settings',
          icon: Lucide.Mail,
          label: 'SMTP Mailer',
          keywords: ['settings', 'email', 'smtp', 'mail', 'notifications'],
          onSelect: () => {
            navigate('/settings/email')
            setOpen(false)
          },
          shortcut: 's e', // settings email
        },
        {
          id: 'integrations-settings',
          icon: Lucide.Plug,
          label: 'Integrations',
          keywords: ['settings', 'integrations', 'connect', 'external', 'services'],
          onSelect: () => {
            navigate('/settings/integrations')
            setOpen(false)
          },
          shortcut: 's i', // settings integrations
        },
        {
          id: 'scheduler-settings',
          icon: Lucide.TimerReset,
          label: 'Scheduler',
          keywords: ['settings', 'scheduler', 'cron', 'jobs', 'tasks'],
          onSelect: () => {
            navigate('/settings/scheduler')
            setOpen(false)
          },
          shortcut: 's c', // settings cron
        },
        {
          id: 'webhooks-settings',
          icon: Lucide.Webhook,
          label: 'Webhooks',
          keywords: ['settings', 'webhooks', 'events', 'triggers', 'notifications'],
          onSelect: () => {
            navigate('/settings/webhooks')
            setOpen(false)
          },
          shortcut: 's w', // settings webhooks
        },
      ],
      showSeparator: true,
    },
    {
      id: 'backup',
      heading: 'Sync & Backup',
      items: [
        {
          id: 'backup-collections',
          icon: Lucide.Archive,
          label: 'Backup Database',
          keywords: ['backup', 'export', 'save', 'collections', 'data', 'database'],
          onSelect: () => {
            navigate('/settings/backup')
            setOpen(false)
          },
          shortcut: 'b c', // backup database
        },
        {
          id: 'restore-collections',
          icon: Lucide.ArchiveRestore,
          label: 'Restore Database',
          keywords: ['restore', 'import', 'load', 'collections', 'data', 'database'],
          onSelect: () => {
            navigate('/settings/restore')
            setOpen(false)
          },
          shortcut: 'r c', // restore database
        },
      ],
      showSeparator: true,
    },
    {
      id: 'account-settings',
      heading: 'Account Settings',
      items: [
        {
          id: 'profile-settings',
          icon: Lucide.User,
          label: 'Profile Settings',
          keywords: ['profile', 'account', 'user', 'personal'],
          onSelect: () => {
            navigate('/settings/profile')
            setOpen(false)
          },
          shortcut: 'a p', // account profile
        },
        {
          id: 'security-settings',
          icon: Lucide.ShieldEllipsis,
          label: 'Security Settings',
          keywords: ['security', 'password', 'mfa', 'authentication'],
          onSelect: () => {
            navigate('/settings/security')
            setOpen(false)
          },
          shortcut: 'a s', // account security
        },
        {
          id: 'preferences-settings',
          icon: Lucide.Settings2,
          label: 'Preferences',
          keywords: ['preferences', 'options', 'personalization', 'customize'],
          onSelect: () => {
            navigate('/settings/preferences')
            setOpen(false)
          },
          shortcut: 'a o', // account options
        },
        {
          id: 'activity-log',
          icon: Lucide.Activity,
          label: 'Activity Log',
          keywords: ['activity', 'log', 'history', 'actions', 'personal'],
          onSelect: () => {
            navigate('/settings/activity-log')
            setOpen(false)
          },
          shortcut: 'a l', // account log
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
          icon: resolvedTheme === 'dark' ? Lucide.Sun : Lucide.Moon,
          label: `Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} Theme`,
          keywords: ['theme', 'dark', 'light', 'mode', 'appearance', 'display'],
          onSelect: () => {
            setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
            setOpen(false)
          },
          shortcut: 't t', // toggle theme
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
          shortcut: 'h', // help
        },
      ],
      showSeparator: true,
    },
    {
      id: 'account',
      heading: 'Account',
      items: [
        {
          id: 'logout',
          icon: Lucide.LogOut,
          label: 'Logout',
          keywords: ['account', 'logout', 'sign out', 'exit', 'quit'],
          onSelect: handleLogout,
          shortcut: 'l', // logout
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
      <CommandInput placeholder="Jump to page or run an action..." />
      <CommandList>
        <CommandEmpty>No results found</CommandEmpty>
        <ScrollArea>
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
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  )
}
