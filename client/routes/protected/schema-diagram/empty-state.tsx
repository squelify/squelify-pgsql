import * as Lucide from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center md:py-16">
      <div className="mb-6 rounded-full bg-muted/30 p-2">
        <Lucide.Proportions className="size-16 text-muted-foreground transition-colors duration-200 hover:text-primary" />
      </div>
      <h1 className="mb-2 font-bold text-2xl">No Schema Diagram Found</h1>
      <div className="space-y-4 text-muted-foreground">
        <p className="font-medium leading-7">
          You haven&apos;t created any tables yet. <br />
          To get started, you&apos;ll need to create a table.
        </p>
        <div className="mt-8 grid w-full max-w-md gap-4 rounded-lg border border-dashed p-6">
          <div className="flex items-center gap-3 text-left">
            <div className="rounded-md bg-muted p-2">
              <Lucide.ListTodo className="size-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Create a table</h3>
              <p className="text-muted-foreground text-sm">Learn more about tables</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-left">
            <div className="rounded-md bg-muted p-2">
              <Lucide.FileText className="size-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Create a view</h3>
              <p className="text-muted-foreground text-sm">Learn more about views</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
