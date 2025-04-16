import * as Lucide from 'lucide-react'
import { Button } from '#/components/button'

interface EmptyQueryStateProps {
  onCreateNewQuery: () => void
}

export function EmptyQueryState({ onCreateNewQuery }: EmptyQueryStateProps) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <Lucide.Database className="mx-auto mb-4 size-12 text-muted-foreground" />
        <h3 className="mb-2 font-medium text-lg">No Queries Available</h3>
        <p className="mb-4 text-muted-foreground">
          Create a new query to start exploring your database.
        </p>
        <Button variant="outline" onClick={onCreateNewQuery}>
          <Lucide.Plus className="-ml-1 mr-2 size-4" />
          Create New Query
        </Button>
      </div>
    </div>
  )
}
