import { useSeoMeta } from '@unhead/react'
import * as Lucide from 'lucide-react'
import EmptyState from '#/components/empty-state'

export default function Page() {
  useSeoMeta({ title: 'Scheduler' })

  return (
    <EmptyState
      icon={Lucide.TimerReset}
      className="flex h-auto w-full items-center justify-center py-72"
    />
  )
}
