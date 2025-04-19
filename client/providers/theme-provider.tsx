import { useStore } from '@nanostores/react'
import { createContext, useEffect, useState } from 'react'
import { type Theme, saveUiState, uiStore } from '#/context/stores/ui.store'

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'dark' | 'light'
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  resolvedTheme: 'light',
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

function ThemeProvider({ children }: React.PropsWithChildren) {
  const uiState = useStore(uiStore)
  const [theme, setTheme] = useState<Theme>(() => uiState.global.theme)
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('light')

  useEffect(() => {
    const root = document.documentElement

    // Function to set the resolved theme
    const updateResolvedTheme = (newTheme: 'dark' | 'light') => {
      root.dataset.theme = newTheme
      setResolvedTheme(newTheme)
    }

    // Update data-theme accordingly if user selects light or dark
    if (theme !== 'system') {
      updateResolvedTheme(theme as 'dark' | 'light')
      return
    }

    // For auto mode, we need to watch system preferences
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    // Set initial theme based on system preference
    updateResolvedTheme(mediaQuery.matches ? 'dark' : 'light')

    // Update theme when system preference changes
    function handleChange(event: MediaQueryListEvent) {
      updateResolvedTheme(event.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      saveUiState('global', { theme: newTheme })
      setTheme(newTheme)
    },
    resolvedTheme,
  }

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
}

export { ThemeProvider as default, ThemeProviderContext }
