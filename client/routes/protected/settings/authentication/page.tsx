import { useSeoMeta } from '@unhead/react'
import * as Lucide from 'lucide-react'
import EmptyState from '#/components/empty-state'

export default function Page() {
  useSeoMeta({ title: 'Authentication Settings' })

  return (
    <EmptyState
      icon={Lucide.LockKeyhole}
      className="flex h-auto w-full items-center justify-center py-72"
    />
  )
}
