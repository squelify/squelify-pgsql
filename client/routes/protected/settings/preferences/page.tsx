import { useSeoMeta } from '@unhead/react'
import * as Lucide from 'lucide-react'
import EmptyState from '#/components/empty-state'

export default function Page() {
  useSeoMeta({ title: 'Preferences' })

  return (
    <EmptyState
      icon={Lucide.Settings2}
      className="flex h-auto w-full items-center justify-center py-72"
    />
  )
}
