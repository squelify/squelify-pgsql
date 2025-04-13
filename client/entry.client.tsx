import './styles/global.css'
import consola from 'consola'
import * as React from 'react'
import ReactDOM from 'react-dom/client'
import { appConfig } from '~~/app.config'
import pkg from '~~/package.json' with { type: 'json' }
import ThemeProvider from '#/providers/theme-provider'
import MainApp from './app'

if (import.meta.env.PROD) {
  consola.log(
    `%cWelcome to ${appConfig.meta.title}!%c\n
Does this page need fixes or improvements? ${String.fromCodePoint(0x1f91d)} We like your curiosity!
Help us improve ${appConfig.meta.title} by joining the team: ${pkg.homepage}
`,
    'padding-top: 0.5em; font-size: 2em;',
    'padding-bottom: 0.5em;'
  )
}

// The root element for the app.
const rootElement = document.getElementById('app')

if (!rootElement) {
  throw new Error("Root element not found. Check if it's existss or if the id is correct.")
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
