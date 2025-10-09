import { useSeoMeta } from '@unhead/react'
import * as Lucide from 'lucide-react'
import EmptyState from '#/components/empty-state'

export default function Page() {
  useSeoMeta({ title: 'Activity Log' })

  return (
    <EmptyState
      icon={Lucide.Activity}
      className="flex h-auto w-full items-center justify-center py-72"
    />
  )
}
