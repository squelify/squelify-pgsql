import { useSeoMeta } from '@unhead/react'
import * as Lucide from 'lucide-react'
import EmptyState from '#/components/empty-state'

export default function Page() {
  useSeoMeta({ title: 'User Profile' })

  return (
    <EmptyState
      icon={Lucide.CircleUserRound}
      className="flex h-auto w-full items-center justify-center py-72"
    />
  )
}
