import { useSeoMeta } from '@unhead/react'
import * as Lucide from 'lucide-react'
import EmptyState from '#/components/empty-state'

export default function Page() {
  useSeoMeta({ title: 'API Keys' })

  return (
    <EmptyState
      icon={Lucide.GlobeLock}
      className="mx-auto flex min-h-full w-full items-center justify-center py-44 sm:py-56 md:py-0"
    />
  )
}
