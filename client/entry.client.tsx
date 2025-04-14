import './styles/global.css'
import { UnheadProvider, createHead } from '@unhead/react/client'
import consola from 'consola'
import React, { type ErrorInfo } from 'react'
import ReactDOM from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import { BrowserRouter } from 'react-router'
import { GlobalErrorBoundary } from '#/components/errors'
import { Toaster } from '#/components/toast'
import DataProvider from '#/providers/data-provider'
import ThemeProvider from '#/providers/theme-provider'
import AppRouter from '#/routes'

if (import.meta.env.PROD) {
  consola.log(
    `%cWelcome to Squelify!%c\n
Does this page need fixes or improvements? ${String.fromCodePoint(0x1f91d)} We like your curiosity!
Help us improve Squelify by joining the team: https://www.squelify.com
`,
    'padding-top: 0.5em; font-size: 2em;',
    'padding-bottom: 0.5em;'
  )
}

// The root element for the app.
const rootElement = document.getElementById('app')
const head = createHead()

if (!rootElement) {
  throw new Error("Root element not found. Check if it's existss or if the id is correct.")
}

function MainApp() {
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

// Strict Mode enables extra development-only checks for the entire component tree.
// These checks help you find common bugs in your components early in the development process.
// @ref: https://react.dev/reference/react/StrictMode
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  </React.StrictMode>
)
