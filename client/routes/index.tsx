import * as React from 'react'
import { Navigate, type RouteObject, useRoutes } from 'react-router'
import { InternalError, NotFound } from '#/components/errors'

// Lazy load the components for better performance
const AuthLayout = React.lazy(() => import('#/routes/auth/layout'))
const ProtectedLayout = React.lazy(() => import('#/routes/protected/layout'))
const Dashboard = React.lazy(() => import('#/routes/protected/dashboard/page'))
const UserProfile = React.lazy(() => import('#/routes/protected/profile/page'))
const UserAccount = React.lazy(() => import('#/routes/protected/account/page'))
const Settings = React.lazy(() => import('#/routes/protected/settings/page'))
const AuditLog = React.lazy(() => import('#/routes/protected/audit-log/page'))

const Database = {
  SchemaDiagram: React.lazy(() => import('#/routes/protected/schema-diagram/page')),
  SqlConsole: React.lazy(() => import('#/routes/protected/sql-console/page')),
  TableEditor: React.lazy(() => import('#/routes/protected/table-editor/page')),
}

const Content = {
  Collections: React.lazy(() => import('#/routes/protected/collections/page')),
  MediaLibrary: React.lazy(() => import('#/routes/protected/media-library/page')),
}

const Authentication = {
  Users: React.lazy(() => import('#/routes/protected/authentication/users/page')),
  Roles: React.lazy(() => import('#/routes/protected/authentication/roles/page')),
  Permissions: React.lazy(() => import('#/routes/protected/authentication/permissions/page')),
  ApiKeys: React.lazy(() => import('#/routes/protected/authentication/api-keys/page')),
}

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
    children: [
      { path: '/', element: <Dashboard /> },
      { path: '/profile', element: <UserProfile /> },
      { path: '/account', element: <UserAccount /> },
      { path: '/schema-diagram', element: <Database.SchemaDiagram /> },
      { path: '/sql-console', element: <Database.SqlConsole /> },
      { path: '/table-editor', element: <Database.TableEditor /> },
      { path: '/collections', element: <Content.Collections /> },
      { path: '/media-library', element: <Content.MediaLibrary /> },
      { path: '/auth', element: <Navigate to="/auth/users" replace /> },
      { path: '/auth/users', element: <Authentication.Users /> },
      { path: '/auth/roles', element: <Authentication.Roles /> },
      { path: '/auth/permissions', element: <Authentication.Permissions /> },
      { path: '/auth/api-keys', element: <Authentication.ApiKeys /> },
      { path: '/settings', element: <Settings /> },
      { path: '/audit-log', element: <AuditLog /> },
    ],
    errorElement: <InternalError />,
  },
  {
    path: '*',
    element: <NotFound />,
    errorElement: <InternalError />,
  },
]

// The main component for the application.
const AppRouter = () => useRoutes(routes)

export default AppRouter
