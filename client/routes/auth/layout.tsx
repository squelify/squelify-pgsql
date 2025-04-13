import { useHead } from '@unhead/react'
import { Outlet } from 'react-router'

export default function AuthLayout() {
  useHead({ titleTemplate: '%s - Squelify' })

  return <Outlet />
}
