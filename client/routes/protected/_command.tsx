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
          onSelect: handleLogout,
          shortcut: '⌘+L',
        },
      ],
      showSeparator: false,
    },
  ]

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found</CommandEmpty>
        {commandGroups.map((group) => (
          <div key={group.id}>
            <CommandGroup heading={group.heading}>
              {group.items.map((item) => (
                <CommandItem key={item.id} onSelect={item.onSelect}>
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
