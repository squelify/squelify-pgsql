import { useQuery } from '@tanstack/react-query'
import * as Lucide from 'lucide-react'
import { Badge } from '#/components/badge'
import { Button } from '#/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardDivider,
  CardHeader,
  CardTitle,
} from '#/components/card'
import { DescriptionDetails, DescriptionList, DescriptionTerm } from '#/components/description-list'
import { Text } from '#/components/text'
import { orpc } from '#/utils/orpc'

export default function SystemInformation() {
  const { data, isLoading, error, refetch } = useQuery(orpc.sysinfo.queryOptions())

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* Left card - takes 2/3 width */}
      <Card className="w-full md:col-span-2">
        <CardHeader spacing="compact">
          <CardTitle>System Information</CardTitle>
          <CardDescription>
            Last updated: {data?.timestamp ? new Date(data.timestamp).toLocaleString() : 'N/A'}
          </CardDescription>
          <div className="absolute top-5 right-3 inline-flex h-14 items-center px-2">
            <Button size="sm" variant="outline" className="w-fit" onClick={() => refetch()}>
              <Lucide.RefreshCw className="mr-1 size-3.5" strokeWidth={2} />
              <span>Refresh</span>
            </Button>
          </div>
        </CardHeader>
        <CardDivider spacing="compact" />
        <CardContent spacing="compact">
          {isLoading ? (
            <div className="h-40 w-full animate-pulse rounded bg-muted" />
          ) : error ? (
            <Text className="text-destructive">Error loading system information</Text>
          ) : (
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              <div>
                <Text className="mb-2 flex items-center font-medium">
                  <Lucide.Info className="mr-2 size-4" strokeWidth={2} />
                  System
                </Text>
                <DescriptionList className="w-full">
                  <DescriptionTerm>Status</DescriptionTerm>
                  <DescriptionDetails className="inline-flex w-full items-center justify-end">
                    <Badge variant={data?.status === 'healthy' ? 'success' : 'error'}>
                      {data?.status === 'healthy' ? (
                        <Lucide.CheckCircle className="mr-1 h-3.5 w-3.5" strokeWidth={2} />
                      ) : (
                        <Lucide.XCircle className="mr-1 h-3.5 w-3.5" strokeWidth={2} />
                      )}
                      {data?.status || 'Unknown'}
                    </Badge>
                  </DescriptionDetails>

                  <DescriptionTerm>Uptime</DescriptionTerm>
                  <DescriptionDetails className="inline-flex w-full items-center justify-end">
                    {data?.uptime || 'N/A'}
                  </DescriptionDetails>

                  <DescriptionTerm>Timestamp</DescriptionTerm>
                  <DescriptionDetails className="inline-flex w-full items-center justify-end">
                    {data?.timestamp ? new Date(data.timestamp).toLocaleString() : 'N/A'}
                  </DescriptionDetails>
                </DescriptionList>

                <Text className="mt-4 mb-2 flex items-center font-medium">
                  <Lucide.Settings2 className="mr-2 size-4" strokeWidth={2} />
                  Environment
                </Text>
                <DescriptionList className="w-full">
                  <DescriptionTerm>Mode</DescriptionTerm>
                  <DescriptionDetails className="inline-flex w-full items-center justify-end">
                    {data?.environment.mode || 'N/A'}
                  </DescriptionDetails>

                  <DescriptionTerm>Log Level</DescriptionTerm>
                  <DescriptionDetails className="inline-flex w-full items-center justify-end">
                    {data?.environment.logLevel || 'N/A'}
                  </DescriptionDetails>

                  <DescriptionTerm>Node Version</DescriptionTerm>
                  <DescriptionDetails className="inline-flex w-full items-center justify-end">
                    {data?.environment?.nodeVersion || 'N/A'}
                  </DescriptionDetails>
                </DescriptionList>
              </div>

              <div>
                <Text className="mb-2 flex items-center font-medium">
                  <Lucide.Microchip className="mr-2 size-4" strokeWidth={2} />
                  CPU &amp; Memory
                </Text>
                <DescriptionList className="w-full">
                  <DescriptionTerm>Heap Used</DescriptionTerm>
                  <DescriptionDetails className="inline-flex w-full items-center justify-end">
                    {data?.memory.heapUsed || 'N/A'}
                  </DescriptionDetails>

                  <DescriptionTerm>Heap Total</DescriptionTerm>
                  <DescriptionDetails className="inline-flex w-full items-center justify-end">
                    {data?.memory.heapTotal || 'N/A'}
                  </DescriptionDetails>

                  <DescriptionTerm>External</DescriptionTerm>
                  <DescriptionDetails className="inline-flex w-full items-center justify-end">
                    {data?.memory.external || 'N/A'}
                  </DescriptionDetails>

                  <DescriptionTerm>RSS</DescriptionTerm>
                  <DescriptionDetails className="inline-flex w-full items-center justify-end">
                    {data?.memory.residentSetSize || 'N/A'}
                  </DescriptionDetails>
                </DescriptionList>

                <Text className="mt-4 mb-2 flex items-center font-medium">
                  <Lucide.DatabaseZap className="mr-2 size-4" strokeWidth={2} />
                  Database
                </Text>
                <DescriptionList className="w-full">
                  <DescriptionTerm>Connection</DescriptionTerm>
                  <DescriptionDetails className="inline-flex w-full items-center justify-end">
                    <Badge variant={data?.database?.connected ? 'success' : 'error'}>
                      {data?.database?.connected ? (
                        <Lucide.CheckCircle className="mr-1 h-3.5 w-3.5" strokeWidth={2} />
                      ) : (
                        <Lucide.XCircle className="mr-1 h-3.5 w-3.5" strokeWidth={2} />
                      )}
                      {data?.database?.connected ? 'Connected' : 'Disconnected'}
                    </Badge>
                  </DescriptionDetails>

                  <DescriptionTerm>Latency</DescriptionTerm>
                  <DescriptionDetails className="inline-flex w-full items-center justify-end">
                    {data?.database?.latency || 'N/A'}
                  </DescriptionDetails>
                </DescriptionList>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Right card - takes 1/3 width */}
      <Card className="w-full">
        <CardHeader spacing="compact">
          <CardTitle>Raw Data</CardTitle>
          <CardDescription>Raw data for debugging and troubleshooting</CardDescription>
        </CardHeader>
        <CardDivider spacing="compact" />
        <CardContent spacing="compact">
          {isLoading ? (
            <div className="h-40 w-full animate-pulse rounded bg-muted" />
          ) : error ? (
            <Text className="text-destructive">Error loading system information</Text>
          ) : (
            <pre className="overflow-auto rounded-md bg-muted p-4 font-mono text-xs">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
