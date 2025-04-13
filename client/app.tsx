import * as React from 'react'
import { type RouteObject, useRoutes } from 'react-router'
import { InternalError, NotFound } from '#/components/errors'

// Lazy load the components for better performance
const AuthLayout = React.lazy(() => import('#/routes/auth/layout'))
const ProtectedLayout = React.lazy(() => import('#/routes/protected/layout'))
const Dashboard = React.lazy(() => import('#/routes/protected/dashboard/page'))

const Auth = {
  Login: React.lazy(() => import('#/routes/auth/login/page')),
  ForgotPassword: React.lazy(() => import('#/routes/auth/password/forgot/page')),
  ResetPassword: React.lazy(() => import('#/routes/auth/password/reset/page')),
}

const routes: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Auth.Login /> },
      { path: '/forgot-password', element: <Auth.ForgotPassword /> },
      { path: '/reset-password', element: <Auth.ResetPassword /> },
    ],
    errorElement: <InternalError />,
  },
  {
    element: <ProtectedLayout />,
    children: [{ path: '/', element: <Dashboard /> }],
    errorElement: <InternalError />,
  },
  {
    path: '*',
    element: <NotFound />,
    errorElement: <InternalError />,
  },
]

// The main component for the application.
const MainApp = () => useRoutes(routes)

export default MainApp
