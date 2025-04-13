import { useSeoMeta } from '@unhead/react'
import { Heading } from '#/components/heading'
import SystemInformation from './system-information'
import SystemStatus from './system-status'

export default function Page() {
  useSeoMeta({ title: 'Dashoard' })

  return (
    <div className="flex min-h-full w-full flex-col items-start justify-start p-4 md:p-8">
      <div className="container mx-auto h-full">
        <Heading level="h1" className="sr-only">
          Dashboard
        </Heading>
        <SystemStatus />
        <SystemInformation />
      </div>
    </div>
  )
}
