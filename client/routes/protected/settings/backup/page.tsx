import { useSeoMeta } from '@unhead/react'
import * as Lucide from 'lucide-react'
import EmptyState from '#/components/empty-state'

export default function Page() {
  useSeoMeta({ title: 'Backup Database' })

  return (
    <EmptyState
      icon={Lucide.Archive}
      className="flex h-auto w-full items-center justify-center py-72"
    />
  )
}
