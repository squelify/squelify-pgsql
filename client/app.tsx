import * as Lucide from 'lucide-react'
import { useEffect, useState } from 'react'
import { clx } from 'twistail-utils'

type Theme = 'light' | 'dark' | 'system'

export default function App() {
  const [count, setCount] = useState(0)
  const [theme, setTheme] = useState<Theme>(() => {
    // Get theme from localStorage, otherwise use 'system'
    const savedTheme = localStorage.getItem('theme') as Theme
    return savedTheme || 'system'
  })
  const [greeting, setGreeting] = useState('')
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // Detect system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }

    // Set initial theme
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light')

    // Add event listener for system preference changes
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  useEffect(() => {
    // Update data-theme attribute and save theme to localStorage
    const htmlElement = document.documentElement
    const themeValue = theme === 'system' ? systemTheme : theme
    htmlElement.setAttribute('data-theme', themeValue)
    localStorage.setItem('theme', theme)
  }, [theme, systemTheme])

  useEffect(() => {
    // Set greeting message based on time
    const hours = new Date().getHours()
    if (hours < 12) setGreeting('Good morning')
    else if (hours < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('light')
  }

  // Determine actual theme and whether it's dark
  const actualTheme = theme === 'system' ? systemTheme : theme
  const isDark = actualTheme === 'dark'

  return (
    <div
      className={clx(
        'flex min-h-screen flex-col items-center justify-center transition-colors duration-300',
        isDark ? 'bg-gray-900' : 'bg-gray-100'
      )}
    >
      <div
        className={clx(
          'w-full max-w-md rounded-xl p-8 shadow-lg transition-colors duration-300',
          isDark ? 'bg-gray-800' : 'bg-white'
        )}
      >
        <div className="mb-6 flex items-center justify-between">
          <h1 className={clx('font-bold text-3xl', isDark ? 'text-white' : 'text-gray-800')}>
            {greeting}
          </h1>

          <button
            type="button"
            onClick={toggleTheme}
            className={clx('rounded-full p-2', isDark ? 'bg-gray-700' : 'bg-gray-200')}
          >
            {theme === 'light' && <Lucide.Sun size={20} className="text-yellow-500" />}
            {theme === 'dark' && <Lucide.Moon size={20} className="text-blue-400" />}
            {theme === 'system' && (
              <Lucide.Monitor size={20} className={isDark ? 'text-gray-300' : 'text-gray-700'} />
            )}
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className={clx('mb-8 text-center', isDark ? 'text-gray-300' : 'text-gray-600')}>
            <p className="mb-2">Welcome to simple counter</p>
            <div className="relative inline-block">
              <div
                className={clx(
                  'mb-1 font-bold text-5xl',
                  isDark ? 'text-indigo-400' : 'text-indigo-600'
                )}
              >
                {count}
              </div>
              <div className="text-sm">Current count</div>
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setCount(count - 1)}
              className={clx(
                isDark
                  ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                  : 'bg-red-100 text-red-600 hover:bg-red-200',
                'rounded-lg px-4 py-3 font-medium transition-colors'
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <Lucide.MinusCircle size={18} />
                <span>Decrease</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setCount(count + 1)}
              className={clx(
                isDark
                  ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50'
                  : 'bg-green-100 text-green-600 hover:bg-green-200',
                'rounded-lg px-4 py-3 font-medium transition-colors'
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <Lucide.PlusCircle size={18} />
                <span>Increase</span>
              </div>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setCount(0)}
            className={clx(
              'mt-4 w-full rounded-lg px-4 py-2 font-medium transition-colors',
              isDark
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            )}
          >
            <div className="flex items-center justify-center gap-2">
              <Lucide.RotateCcw size={18} />
              <span>Reset</span>
            </div>
          </button>
        </div>
      </div>

      <p className={clx('mt-6 text-sm', isDark ? 'text-gray-400' : 'text-gray-500')}>
        &copy; {new Date().getFullYear()} Nitro Application • Theme: {theme}
      </p>
    </div>
  )
}
