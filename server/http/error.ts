import { process } from 'std-env'
import type { AppConfig } from '~~/app.config'

interface ErrorInfo {
  code: number
  name: string
  message: string
  stack?: string
}

interface RenderTemplate {
  title: string
  description: string
  error: ErrorInfo
  children: string
}

const renderTemplate = (props: RenderTemplate) => `<!DOCTYPE html>
<html lang="en" data-theme="light">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${props.description}">
    <title>Error ${props.error.code}</title>
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="icon" type="image/png" href="/favicon.png">
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <script src="https://unpkg.com/@lucide/web/dist/umd/lucide.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
      .scrollbar-thin::-webkit-scrollbar { width: 6px; height: 6px; }
      .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
      .scrollbar-thin::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.5); border-radius: 3px; }
      .dark .scrollbar-thin::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.3); }
    </style>
  </head>
  <body class="bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 antialiased">
    <div class="flex min-h-screen flex-col items-center justify-center p-4 md:p-6">
      <div class="w-full max-w-2xl mx-auto">
        <!-- Header with status code -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex"></div>
          <div class="px-3 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-sm font-mono text-zinc-600 dark:text-zinc-400 flex items-center">
            <span class="mr-2">Status</span>
            <span class="font-semibold ${props.error.code === 404 ? 'text-amber-500' : 'text-red-500'}">${props.error.code}</span>
          </div>
        </div>
        <!-- Main content -->
        <div class="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden">
          ${props.children}
        </div>
        <!-- Footer -->
        <div class="mt-5 text-center text-zinc-500 dark:text-zinc-400 text-xs">
          &copy; ${new Date().getFullYear()} ${props.title}
        </div>
      </div>
    </div>
    <script>
      // Initialize Lucide icons
      lucide.createIcons();

      // Copy error details functionality
      document.getElementById('copy-error')?.addEventListener('click', function() {
        const errorStack = document.getElementById('error-stack')?.textContent;
        const errorMessage = '${props.error.name}: ${props.error.message}\\n\\n' + (errorStack || '');

        navigator.clipboard.writeText(errorMessage).then(function() {
          const copyBtn = document.getElementById('copy-error');
          const originalContent = copyBtn.innerHTML;

          copyBtn.innerHTML = '<i data-lucide="check" class="h-3 w-3 mr-1"></i> Copied';
          lucide.createIcons();
          copyBtn.classList.add('text-green-500');

          setTimeout(function() {
            copyBtn.innerHTML = originalContent;
            lucide.createIcons();
            copyBtn.classList.remove('text-green-500');
          }, 2000);
        });
      });

      // Check system preference for dark mode and set data-theme
      function setThemePreference() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
      }

      // Set theme on load
      setThemePreference();

      // Listen for changes in system preference
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setThemePreference);
    </script>
  </body>
</html>`

// Render content for 404 error
const render404Content = (path: string) => `
<div class="p-6">
  <!-- Icon and Title -->
  <div class="flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
    <div class="flex-shrink-0 mx-auto sm:mx-0">
      <div class="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
        <i data-lucide="file-question" class="h-8 w-8 text-amber-500"></i>
      </div>
    </div>

    <div class="flex-grow text-center sm:text-left">
      <h1 class="text-xl font-medium tracking-tight">
        Page Not Found
      </h1>
      <p class="mt-2 text-zinc-600 dark:text-zinc-400">
        The page you're looking for doesn't exist or has been moved.
      </p>
    </div>
  </div>

  <!-- Error Details -->
  <div class="w-full mb-6 overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50">
    <div class="p-4">
      <div class="flex items-center gap-2 font-mono text-sm mb-2">
        <span class="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs">GET</span>
        <span class="text-amber-500 dark:text-amber-400 font-semibold">${path}</span>
      </div>
      <p class="font-mono text-zinc-700 dark:text-zinc-300 text-sm">
        The requested URL was not found on this server.
      </p>
    </div>
  </div>

  <!-- Action Buttons -->
  <div class="flex flex-col sm:flex-row gap-3">
    <a href="/" class="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
      <i data-lucide="arrow-left" class="mr-2 size-4"></i>
      Back to Home
    </a>
    <button onclick="window.location.reload()" class="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-600 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white transition-colors">
      <i data-lucide="refresh-cw" class="mr-2 size-4"></i>
      Try Again
    </button>
  </div>
</div>
`

// Render content for other errors
const renderErrorContent = (error: ErrorInfo, isDev: boolean) => `
<div class="p-6">
  <!-- Icon and Title -->
  <div class="flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
    <div class="flex-shrink-0 mx-auto sm:mx-0">
      <div class="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
        <i data-lucide="server-crash" class="h-8 w-8 text-red-500"></i>
      </div>
    </div>

    <div class="flex-grow text-center sm:text-left">
      <h1 class="text-xl font-medium tracking-tight">
        Something went wrong
      </h1>
      <p class="mt-2 text-zinc-600 dark:text-zinc-400">
        We've been notified and are working to fix the issue.
      </p>
    </div>
  </div>

  ${
    isDev && error.stack
      ? `
  <!-- Error Details -->
  <div class="w-full mb-6 overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50">
    <div class="border-b border-zinc-200 dark:border-zinc-700 px-4 py-2 flex justify-between items-center">
      <span class="font-medium text-zinc-700 dark:text-zinc-300 text-xs">Error Details</span>
      <button id="copy-error" class="text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors flex items-center text-xs font-medium cursor-pointer">
        <i data-lucide="clipboard" class="h-3 w-3 mr-1"></i>
        <span>Copy</span>
      </button>
    </div>
    <div class="p-4">
      <div class="mb-3 flex items-center gap-2">
        <span class="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium">${error.name}</span>
        <span class="font-mono text-red-500 dark:text-red-400 text-sm">${error.message}</span>
      </div>
      <pre id="error-stack" class="scrollbar-thin max-h-[400px] overflow-auto rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed font-mono">${error.stack}</pre>
    </div>
  </div>
  `
      : ''
  }

  <!-- Action Buttons -->
  <div class="flex flex-col sm:flex-row gap-3">
    <a href="/" class="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer">
      <i data-lucide="arrow-left" class="mr-2 size-4"></i>
      <span>Go Back</span>
    </a>
    <button onclick="window.location.reload()" class="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-md bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white transition-colors cursor-pointer">
      <i data-lucide="refresh-cw" class="mr-2 size-4"></i>
      <span>Try Again</span>
    </button>
  </div>
</div>
`

export default defineNitroErrorHandler((error, event) => {
  const appConfig = useAppConfig(event) as AppConfig

  if (event.path.startsWith('/api')) {
    setResponseHeader(event, 'Content-Type', 'application/json')
    return send(
      event,
      JSON.stringify({
        statusCode: error.statusCode || 500,
        message:
          error.statusCode === 404
            ? 'Resource not found'
            : error.message || 'Internal Server Error',
        ...(process.dev && {
          issues: error.stack
            ?.split('\n')
            .map((line) => line.trim())
            .filter(Boolean),
        }),
      })
    )
  }

  // Create error info object
  const errorInfo: ErrorInfo = {
    code: error.statusCode || 500,
    name: error.name || 'Error',
    message: error.message || 'An unexpected error occurred',
    stack: error.stack,
  }

  // Generate content based on error type
  const content =
    errorInfo.code === 404
      ? render404Content(event.path)
      : renderErrorContent(errorInfo, process.dev === true)

  // Render the complete HTML using the template
  const htmlBody = renderTemplate({
    title: appConfig.meta.title,
    description: appConfig.meta.description,
    error: errorInfo,
    children: content,
  })

  setResponseHeader(event, 'Content-Type', 'text/html')
  return send(event, htmlBody)
})
