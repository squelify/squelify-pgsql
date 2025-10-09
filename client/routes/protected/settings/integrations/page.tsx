import { useSeoMeta } from '@unhead/react'
import * as Lucide from 'lucide-react'
import EmptyState from '#/components/empty-state'

export default function Page() {
  useSeoMeta({ title: 'Integrations' })

  return (
    <EmptyState
      icon={Lucide.Plug}
      className="flex h-auto w-full items-center justify-center py-72"
    />
  )
}
