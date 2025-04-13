import * as Lucide from 'lucide-react'
import { useNavigate } from 'react-router'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/avatar'
import { Button } from '#/components/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup } from '#/components/dropdown-menu'
import { DropdownMenuItem, DropdownMenuLabel } from '#/components/dropdown-menu'
import { DropdownMenuSeparator, DropdownMenuTrigger } from '#/components/dropdown-menu'
import Link from '#/components/link'
import { toast } from '#/components/toast'

export default function UserMenu() {
  const navigate = useNavigate()

  // Get user data from storage (in a real app, this would come from a context)
  const getUserData = () => {
    const userData =
      localStorage.getItem('squelify_user') || sessionStorage.getItem('squelify_user')
    return userData ? JSON.parse(userData) : null
  }

  const user = getUserData()

  const handleLogout = () => {
    localStorage.removeItem('squelify_user')
    sessionStorage.removeItem('squelify_user')
    toast.success('You have been logged out')
    navigate('/login')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar>
            <AvatarImage
              src={`https://avatar.vercel.sh/${user?.name || 'user'}`}
              alt={user?.name || 'User'}
            />
            <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="font-medium text-sm">{user?.name || 'User'}</p>
            <p className="text-muted-foreground text-xs">{user?.email || 'user@example.com'}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href="/profile" className="flex items-center">
              <Lucide.User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/settings" className="flex items-center">
              <Lucide.Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="flex items-center">
          <Lucide.LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
