import { useSeoMeta } from '@unhead/react'
import * as Lucide from 'lucide-react'
import EmptyState from '#/components/empty-state'

export default function Page() {
  useSeoMeta({ title: 'Storage Settings' })

  return (
    <EmptyState
      icon={Lucide.ImageUp}
      className="flex h-auto w-full items-center justify-center py-72"
    />
  )
}
