import { useSeoMeta } from '@unhead/react'
import * as Lucide from 'lucide-react'
import EmptyState from '#/components/empty-state'

export default function Page() {
  useSeoMeta({ title: 'Audit Log' })

  return (
    <EmptyState
      icon={Lucide.FileClock}
      className="mx-auto flex min-h-full w-full items-center justify-center py-44 sm:py-56 md:py-0"
    />
  )
}
