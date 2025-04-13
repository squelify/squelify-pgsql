import { UnheadProvider, createHead } from '@unhead/react/client'
import consola from 'consola'
import React, { type ErrorInfo } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { type RouteObject, useRoutes } from 'react-router'
import { BrowserRouter } from 'react-router'
import { GlobalErrorBoundary, InternalError, NotFound } from '#/components/errors'
import { Toaster } from '#/components/toast'
import DataProvider from '#/providers/data-provider'

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
const AppRouter = () => useRoutes(routes)
const head = createHead()

export default function App() {
  // Do something with the error, e.g. log to an external API
  const onErrorHandle = (error: Error, info: ErrorInfo) => {
    consola.withTag('globalError').debug(error, info)
  }

  return (
    <ErrorBoundary FallbackComponent={GlobalErrorBoundary} onError={onErrorHandle}>
      <BrowserRouter basename="/admin">
        <DataProvider>
          <UnheadProvider head={head}>
            <AppRouter />
          </UnheadProvider>
          <Toaster position="bottom-right" />
        </DataProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
