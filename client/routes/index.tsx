import * as React from 'react'
import { Navigate, type RouteObject, useRoutes } from 'react-router'
import { InternalError, NotFound } from '#/components/errors'

// Lazy load the components for better performance
const AuthLayout = React.lazy(() => import('#/routes/auth/layout'))
const ProtectedLayout = React.lazy(() => import('#/routes/protected/layout'))
const Dashboard = React.lazy(() => import('#/routes/protected/dashboard/page'))
const CollectionLayout = React.lazy(() => import('#/routes/protected/collections/layout'))
const SettingLayout = React.lazy(() => import('#/routes/protected/settings/layout'))
const AuditLog = React.lazy(() => import('#/routes/protected/audit-log/page'))
const Notifications = React.lazy(() => import('#/routes/protected/notifications/page'))
const Setup = React.lazy(() => import('#/routes/setup/page'))

const Settings = {
  Application: React.lazy(() => import('#/routes/protected/settings/application/page')),
  Authentication: React.lazy(() => import('#/routes/protected/settings/authentication/page')),
  Storage: React.lazy(() => import('#/routes/protected/settings/storage/page')),
  Email: React.lazy(() => import('#/routes/protected/settings/email/page')),
  Integrations: React.lazy(() => import('#/routes/protected/settings/integrations/page')),
  Scheduler: React.lazy(() => import('#/routes/protected/settings/scheduler/page')),
  Webhooks: React.lazy(() => import('#/routes/protected/settings/webhooks/page')),
  Backup: React.lazy(() => import('#/routes/protected/settings/backup/page')),
  Restore: React.lazy(() => import('#/routes/protected/settings/restore/page')),
  Profile: React.lazy(() => import('#/routes/protected/settings/profile/page')),
  Security: React.lazy(() => import('#/routes/protected/settings/security/page')),
  Preferences: React.lazy(() => import('#/routes/protected/settings/preferences/page')),
  ActivityLog: React.lazy(() => import('#/routes/protected/settings/activity-log/page')),
  AdminUsers: React.lazy(() => import('#/routes/protected/settings/administrator/page')),
  AdminRoles: React.lazy(() => import('#/routes/protected/settings/admin-roles/page')),
}

const Database = {
  SchemaDiagram: React.lazy(() => import('#/routes/protected/schema-diagram/page')),
  SqlConsole: React.lazy(() => import('#/routes/protected/sql-console/page')),
  SqlTemplates: React.lazy(() => import('#/routes/protected/sql-console/templates/page')),
  TableEditor: React.lazy(() => import('#/routes/protected/table-editor/page')),
}

const Content = {
  CollectionIndex: React.lazy(() => import('#/routes/protected/collections/index/page')),
  MediaLibrary: React.lazy(() => import('#/routes/protected/media-library/page')),
  Functions: React.lazy(() => import('#/routes/protected/functions/page')),
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
      { path: '/schema-diagram', element: <Database.SchemaDiagram /> },
      {
        path: '/sql-console',
        children: [
          { path: '', element: <Database.SqlConsole /> },
          { path: 'templates', element: <Database.SqlTemplates /> },
        ],
      },
      { path: '/table-editor', element: <Database.TableEditor /> },
      {
        path: 'collections',
        element: <CollectionLayout />,
        children: [{ path: '', element: <Content.CollectionIndex /> }],
        errorElement: <InternalError />,
      },
      { path: '/media-library', element: <Content.MediaLibrary /> },
      { path: '/functions', element: <Content.Functions /> },
      { path: '/auth', element: <Navigate to="/auth/users" replace /> },
      { path: '/auth/users', element: <Authentication.Users /> },
      { path: '/auth/roles', element: <Authentication.Roles /> },
      { path: '/auth/permissions', element: <Authentication.Permissions /> },
      { path: '/auth/api-keys', element: <Authentication.ApiKeys /> },
      { path: '/notifications', element: <Notifications /> },
      {
        path: 'settings',
        element: <SettingLayout />,
        children: [
          { path: '', element: <Navigate to="/settings/application" replace /> },
          { path: 'application', element: <Settings.Application /> },
          { path: 'authentication', element: <Settings.Authentication /> },
          { path: 'storage', element: <Settings.Storage /> },
          { path: 'email', element: <Settings.Email /> },
          { path: 'integrations', element: <Settings.Integrations /> },
          { path: 'scheduler', element: <Settings.Scheduler /> },
          { path: 'webhooks', element: <Settings.Webhooks /> },
          { path: 'backup', element: <Settings.Backup /> },
          { path: 'restore', element: <Settings.Restore /> },
          { path: 'profile', element: <Settings.Profile /> },
          { path: 'security', element: <Settings.Security /> },
          { path: 'preferences', element: <Settings.Preferences /> },
          { path: 'activity-log', element: <Settings.ActivityLog /> },
          { path: 'administrator', element: <Settings.AdminUsers /> },
          { path: 'admin-roles', element: <Settings.AdminRoles /> },
        ],
        errorElement: <InternalError />,
      },
      { path: '/audit-log', element: <AuditLog /> },
    ],
    errorElement: <InternalError />,
  },
  { path: '/setup', element: <Setup />, errorElement: <InternalError /> },
  { path: '*', element: <NotFound />, errorElement: <InternalError /> },
]

// The main component for the application.
const AppRouter = () => useRoutes(routes)

export default AppRouter
