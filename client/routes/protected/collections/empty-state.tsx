import * as Lucide from 'lucide-react'
import { Button } from '#/components/button'

export function EmptyCollectionState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center md:py-16">
      <div className="mb-6 rounded-full bg-muted/30 p-2">
        <Lucide.Layers className="size-16 text-muted-foreground transition-colors duration-200 hover:text-primary" />
      </div>
      <h1 className="mb-2 font-bold text-2xl">No Collections Found</h1>
      <div className="space-y-4 text-muted-foreground">
        <p className="font-medium leading-7">
          You haven't created any collections yet. <br />
          Collections help you organize and manage your content.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
          <Button variant="secondary" className="w-full gap-2">
            <Lucide.FileQuestion className="size-4" />
            <span>Learn about collections</span>
          </Button>
          <Button variant="secondary" className="w-full gap-2">
            <Lucide.Plus className="size-4" />
            <span>Create collection</span>
          </Button>
        </div>
      </div>
      <div className="mt-12 grid w-full max-w-md gap-4 rounded-lg border border-dashed p-6">
        <div className="flex items-center gap-3 text-left">
          <div className="rounded-md bg-muted p-2">
            <Lucide.ListTodo className="size-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">Create a collection type</h3>
            <p className="text-muted-foreground text-sm">Define repeatable content structures</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-left">
          <div className="rounded-md bg-muted p-2">
            <Lucide.FileText className="size-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">Create a single type</h3>
            <p className="text-muted-foreground text-sm">Define one-off content structures</p>
          </div>
        </div>
      </div>
    </div>
  )
}
