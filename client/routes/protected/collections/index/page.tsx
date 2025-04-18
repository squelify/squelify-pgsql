import { useSeoMeta } from '@unhead/react'
import { EmptyCollectionState } from '../empty-state'

export default function Page() {
  useSeoMeta({ title: 'Content Collections' })

  return (
    <div className="flex h-auto w-full flex-col">
      <div className="container mx-auto p-4 pb-6 md:p-6 md:pb-8">
        <EmptyCollectionState />
      </div>
    </div>
  )
}
