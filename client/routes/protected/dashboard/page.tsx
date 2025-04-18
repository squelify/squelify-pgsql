import { useSeoMeta } from '@unhead/react'
import { Heading } from '#/components/heading'
import SystemInformation from './system-information'
import SystemStatus from './system-status'

export default function Page() {
  useSeoMeta({ title: 'Dashoard' })

  return (
    <div className="flex h-auto w-full flex-col">
      <div className="container mx-auto p-4 pb-6 md:p-6 md:pb-8">
        <Heading level="h1" className="sr-only">
          Dashboard
        </Heading>
        <SystemStatus />
        <SystemInformation />
      </div>
    </div>
  )
}
