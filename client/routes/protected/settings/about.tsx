import * as Lucide from 'lucide-react'
import { clx } from 'twistail-utils'
import { Button } from '#/components/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogDivider,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/dialog'
import Link from '#/components/link'
import pkg from '~~/package.json' with { type: 'json' }

export function AboutDialog() {
  const handleCheckForUpdates = () => {
    let repoURL = pkg.repository?.url
    if (repoURL) {
      repoURL = repoURL.replace(/^git\+/, '') // remove "git+" prefix
      const releasesURL = `${repoURL.replace(/\.git$/, '')}/releases`
      window.open(releasesURL, '_blank')
    }
  }

  return (
    <Dialog modal>
      <DialogTrigger asChild>
        <Button
          size="xs"
          className="debug flex items-center gap-1 text-muted-foreground transition-colors hover:bg-transparent hover:text-sidebar-foreground"
          variant="ghost"
        >
          <Lucide.Info className="size-3" />
          <span>v{pkg.version}</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="w-full max-w-md"
      >
        <DialogHeader className="relative flex flex-col gap-1">
          <DialogTitle className="flex items-center text-xl">About Squelify</DialogTitle>
          <span className="text-muted-foreground text-sm">Version: {pkg.version}</span>
          <DialogClose
            className={clx(
              'absolute top-0 right-0 text-center font-medium shadow-xs transition-all duration-150 ease-in-out',
              'border-transparent bg-transparent text-foreground shadow-none hover:bg-accent hover:text-accent-foreground',
              'rounded-md p-1.5 text-xs outline-accent disabled:text-muted-foreground',
              'border border-none outline-0 outline-offset-2 focus-visible:outline-2'
            )}
            aria-label="Close"
          >
            <Lucide.X className="size-4" />
          </DialogClose>
        </DialogHeader>
        <DialogDivider />
        <DialogDescription>
          <div className="mb-3">
            A modern headless CMS and backend-as-a-service platform powered by Nitro, TypeScript,
            Postgres, and Kysely.
          </div>
          <div className="mt-4 mb-6">
            <span className="font-semibold">Useful Links:</span>
            <ul className="mt-4 ml-0 space-y-2.5">
              <li className="flex items-center justify-between">
                <Link
                  href="https://github.com/squelify/squelify"
                  className="flex flex-1 items-center justify-between text-muted-foreground hover:text-primary"
                  newTab
                  aria-label="GitHub"
                >
                  <span>GitHub Repository</span>
                  <span className="mx-2 flex-1 border-b border-dotted" />
                  <Lucide.Github className="size-4" />
                </Link>
              </li>
              <li className="flex items-center justify-between">
                <Link
                  href={`${pkg.homepage}/docs`}
                  className="flex flex-1 items-center justify-between text-muted-foreground hover:text-primary"
                  newTab
                  aria-label="Docs"
                >
                  <span>Documentation</span>
                  <span className="mx-2 flex-1 border-b border-dotted" />
                  <Lucide.BookOpen className="size-4" />
                </Link>
              </li>
              <li className="flex items-center justify-between">
                <Link
                  href={pkg.homepage}
                  className="flex flex-1 items-center justify-between text-muted-foreground hover:text-primary"
                  aria-label="Website"
                  newTab
                >
                  <span>Official Website</span>
                  <span className="mx-2 flex-1 border-b border-dotted" />
                  <Lucide.Globe className="size-4" />
                </Link>
              </li>
            </ul>
          </div>
        </DialogDescription>
        <DialogFooter className="mt-8 flex flex-col gap-2">
          <Button size="sm" variant="primary" className="w-full" onClick={handleCheckForUpdates}>
            Check for updates
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
